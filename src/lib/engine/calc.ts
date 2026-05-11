import type { RawWater, TargetIons, CalcOptions, PrescriptionResult, FertAmounts, Warning } from './types.js';
import { FERTILIZERS } from './fertilizers.js';
import { EC_F } from './defaults.js';

// ── P0 Safety: clamp raw water values ────────────────────────
export function clampRaw(raw: Partial<RawWater>): RawWater {
  const safe = (v: unknown, lo = 0, hi = 1e9) =>
    typeof v === 'number' && isFinite(v) ? Math.max(lo, Math.min(hi, v)) : 0;
  return {
    pH:    safe(raw.pH,    4, 9),
    EC:    safe(raw.EC,    0, 20),
    NO3:   safe(raw.NO3),
    NH4:   safe(raw.NH4),
    K:     safe(raw.K),
    Ca:    safe(raw.Ca),
    Mg:    safe(raw.Mg),
    H2PO4: safe(raw.H2PO4),
    SO4:   safe(raw.SO4),
    HCO3:  safe(raw.HCO3),
    Na:    safe(raw.Na),
    Cl:    safe(raw.Cl),
  };
}

// helper: grams→mmol/L contribution of ion from fertilizer
const contrib = (grams: number, mmolPerG: number, F: number) =>
  (grams * mmolPerG) / F;

// ── v2.14 calculation engine ─────────────────────────────────
export function calcPrescription(
  tg: TargetIons,
  rawInput: Partial<RawWater>,
  opts: CalcOptions,
): PrescriptionResult {
  const raw = clampRaw(rawInput);
  const warnings: Warning[] = [];
  const ferts: FertAmounts = {};

  // F = concentrate × dilution (e.g. 600L × 100 = 60 000)
  const F = opts.tankVol * opts.dilution;

  // pool = running ion concentrations in FINAL solution (mmol/L)
  const pool: RawWater = { ...raw };

  // ── Step 1: HCO₃ neutralisation → HNO₃ (Tank C) ─────────────
  const hco3N = Math.max(0, pool.HCO3 - opts.residualHCO3);
  if (hco3N > 0.01) {
    const mL = (hco3N * F) / FERTILIZERS.hno3.NO3;
    ferts.hno3 = mL;
    pool.NO3  += hco3N;
    pool.HCO3  = opts.residualHCO3;
  }

  // ── Step 2: Ca source (Tank A) ───────────────────────────────
  const caN = Math.max(0, tg.Ca - pool.Ca);
  if (caN > 0.01) {
    const avail = opts.available ?? {};
    const pri = opts.calcinit;
    const alt: typeof pri = pri === 'agrogold155' ? 'calcinit_yara' : 'agrogold155';
    const src = avail[pri] !== false ? pri
               : avail[alt] !== false ? alt
               : null;

    if (!src) {
      warnings.push({ level: 'P0', code: 'CA_UNAVAILABLE', detail: 'No Ca fertilizer — prescription blocked' });
      return { ferts, ions: pool, ec: 0, warnings };
    }
    if (src !== pri) {
      warnings.push({ level: 'P1', code: 'CA_FALLBACK', detail: `Auto-switched ${pri} → ${src}` });
    }
    const f = FERTILIZERS[src];
    const caKg = (caN * F) / (f.Ca * 1000);
    ferts[src]  = caKg;
    pool.Ca    += contrib(caKg * 1000, f.Ca,  F); // = caN
    pool.NO3   += contrib(caKg * 1000, f.NO3, F);
    pool.NH4   += contrib(caKg * 1000, f.NH4, F);
  }

  // ── Step 3: Fe chelate (Tank A) ──────────────────────────────
  const feN = tg.Fe_umol / 1000; // µmol → mmol
  if (feN > 0) {
    const f = FERTILIZERS[opts.feSource];
    const feKg = (feN * F) / (f.Fe * 1000);
    ferts[opts.feSource] = feKg;
    // Fe doesn't affect macro pool
  }

  // ── Step 4: NH₄ balance → NH₄NO₃ (Tank A) ───────────────────
  // Done early so pool.NH4 is accurate before K step
  const nh4N = Math.max(0, tg.NH4 - pool.NH4);
  if (nh4N > 0.01) {
    const f = FERTILIZERS.nh4no3;
    const nh4Kg = (nh4N * F) / (f.NH4 * 1000);
    ferts.nh4no3 = nh4Kg;
    pool.NH4 += contrib(nh4Kg * 1000, f.NH4, F); // = nh4N
    pool.NO3 += contrib(nh4Kg * 1000, f.NO3, F); // NH₄NO₃ also adds NO₃
  }

  // ── Step 5: P → KH₂PO₄ (Tank B) ─────────────────────────────
  const pN = Math.max(0, tg.H2PO4 - pool.H2PO4);
  if (pN > 0.01) {
    const f = FERTILIZERS.kh2po4;
    const kh2Kg = (pN * F) / (f.H2PO4 * 1000);
    ferts.kh2po4  = kh2Kg;
    pool.H2PO4   += contrib(kh2Kg * 1000, f.H2PO4, F); // = pN
    pool.K        += contrib(kh2Kg * 1000, f.K,     F); // ★ K goes into pool
  }

  // ── Step 6: Mg → MgSO₄ or Mg(NO₃)₂ (Tank B) ────────────────
  const mgN = Math.max(0, tg.Mg - pool.Mg);
  if (mgN > 0.01) {
    const f = FERTILIZERS[opts.mgSource];
    const mgKg = (mgN * F) / (f.Mg * 1000);
    ferts[opts.mgSource] = mgKg;
    pool.Mg  += contrib(mgKg * 1000, f.Mg,  F); // = mgN
    pool.SO4 += contrib(mgKg * 1000, f.SO4, F); // ★ SO₄ goes into pool
    pool.NO3 += contrib(mgKg * 1000, f.NO3, F);
  }

  // ── Step 7: K balance — K₂SO₄ first (for SO₄), then KNO₃ ────
  // pool.K already includes K from KH₂PO₄ (Step 5)
  let kN = Math.max(0, tg.K - pool.K);

  // K₂SO₄ satisfies both SO₄ and K deficits simultaneously
  const so4Need = Math.max(0, tg.SO4 - pool.SO4);
  if (so4Need > 0 && kN > 0.01) {
    const f = FERTILIZERS.k2so4;
    let k2so4Kg = so4Need / (f.SO4 / F * 1000);
    // = (so4Need * F) / (f.SO4 * 1000) but limit by K budget
    k2so4Kg = (so4Need * F) / (f.SO4 * 1000);
    let kFromK2 = contrib(k2so4Kg * 1000, f.K, F);
    if (kFromK2 > kN) {
      k2so4Kg = (kN * F) / (f.K * 1000); // cap to K need
      kFromK2  = kN;
    }
    ferts.k2so4  = k2so4Kg;
    pool.K       += kFromK2;
    pool.SO4     += contrib(k2so4Kg * 1000, f.SO4, F);
    kN            = Math.max(0, kN - kFromK2);
  }

  // KNO₃ for all remaining K (also adds NO₃ to pool)
  if (kN > 0.01) {
    const f = FERTILIZERS.kno3;
    const kno3Kg = (kN * F) / (f.K * 1000);
    ferts.kno3  = (ferts.kno3 ?? 0) + kno3Kg;
    pool.K      += contrib(kno3Kg * 1000, f.K,   F); // = kN
    pool.NO3    += contrib(kno3Kg * 1000, f.NO3, F);
  }

  // ── Step 8: Optional phosphite H₃PO₃ (Tank B) ────────────────
  if (opts.addPhosphite) {
    const ph3n = 0.5;
    const f = FERTILIZERS.h3po3;
    ferts.h3po3 = (ph3n * F) / (f.H2PO4 * 1000);
  }

  // ── Step 9: NO₃ shortfall check (P3 guard) ───────────────────
  const no3Delta = tg.NO3 - pool.NO3;
  if (no3Delta > 1.5) {
    warnings.push({
      level: 'P3', code: 'NO3_SHORTFALL',
      detail: `NO₃ ${no3Delta.toFixed(2)} mmol/L below target — high-HCO₃ K ceiling`,
    });
  }

  // ── Step 10: Micronutrients (Tank B) ─────────────────────────
  const micros: [keyof FertAmounts, number, string][] = [
    ['h3bo3',   tg.B_umol  / 1000, 'B'],
    ['mnso4',   tg.Mn_umol / 1000, 'Mn'],
    ['znso4',   tg.Zn_umol / 1000, 'Zn'],
    ['cuso4',   tg.Cu_umol / 1000, 'Cu'],
    ['na2moo4', tg.Mo_umol / 1000, 'Mo'],
  ];
  for (const [id, mmol, key] of micros) {
    if (mmol > 0) {
      const rate = (FERTILIZERS[id] as unknown as Record<string, number>)[key] as number;
      if (rate > 0) ferts[id] = (mmol * F) / (rate * 1000);
    }
  }

  // ── EC estimation (Sonneveld 2009, v2.5 coefficients) ────────
  const ec =
    pool.NO3   * EC_F.NO3   +
    pool.NH4   * EC_F.NH4   +
    pool.K     * EC_F.K     +
    pool.Ca    * EC_F.Ca    +
    pool.Mg    * EC_F.Mg    +
    pool.H2PO4 * EC_F.H2PO4 +
    pool.SO4   * EC_F.SO4   +
    raw.Na     * EC_F.Na    +
    raw.Cl     * EC_F.Cl;

  if (ec < 0.5 || ec > 3.5) {
    warnings.push({ level: 'P2', code: 'EC_OUT_OF_RANGE', detail: `EC ${ec.toFixed(2)} mS/cm` });
  }

  return { ferts, ions: pool, ec, warnings };
}

// ── Tank grouping helper ─────────────────────────────────────
export function byTank(ferts: FertAmounts): Record<'A' | 'B' | 'C', FertAmounts> {
  const out: Record<'A' | 'B' | 'C', FertAmounts> = { A: {}, B: {}, C: {} };
  for (const [id, amt] of Object.entries(ferts)) {
    if (!amt || amt <= 0) continue;
    const tank = FERTILIZERS[id as keyof typeof FERTILIZERS]?.tank ?? 'B';
    out[tank][id as keyof FertAmounts] = amt;
  }
  return out;
}

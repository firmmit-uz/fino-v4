import type { RawWater, TargetIons, CalcOptions, PrescriptionResult, FertAmounts, Warning, TankItem } from './types.js';
import { FERTILIZERS as FERT } from './fertilizers.js';
import { EC_F } from './defaults.js';

// ── P0 Safety: clamp + validate raw water ────────────────────
export function clampRaw(raw: Partial<RawWater>): { water: RawWater; warnings: Warning[] } {
  const warnings: Warning[] = [];
  const safe = (v: unknown, lo: number, hi: number, field: string): number => {
    const n = typeof v === 'number' && isFinite(v) ? v : 0;
    if (n < lo || n > hi) warnings.push({ level: 'P2', code: 'RAW_OUT_OF_RANGE', params: { field, value: String(n.toFixed(2)), lo: String(lo), hi: String(hi) } });
    return Math.max(lo, Math.min(hi, isFinite(n) ? n : 0));
  };
  const water: RawWater = {
    pH:    safe(raw.pH,    3,  10, 'pH'),
    EC:    safe(raw.EC,    0,  20, 'EC'),
    NO3:   safe(raw.NO3,   0,  30, 'NO3'),
    NH4:   safe(raw.NH4,   0,  10, 'NH4'),
    K:     safe(raw.K,     0,  20, 'K'),
    Ca:    safe(raw.Ca,    0,  20, 'Ca'),
    Mg:    safe(raw.Mg,    0,  15, 'Mg'),
    H2PO4: safe(raw.H2PO4, 0,  10, 'H2PO4'),
    SO4:   safe(raw.SO4,   0,  30, 'SO4'),
    HCO3:  safe(raw.HCO3,  0,  10, 'HCO3'),  // >10 = explosive acid dose
    Na:    safe(raw.Na,    0,  30, 'Na'),
    Cl:    safe(raw.Cl,    0,  30, 'Cl'),
  };
  return { water, warnings };
}

// ── v2.14 calc engine ────────────────────────────────────────
// Convention:
//   xKg_per_L = g per L of FINAL solution  (= need_mmol_L / FERT.x.ion_mmolPerG)
//   For liquids (hno3, h3po4): xmL_per_L  = mL per L of FINAL solution
//   pool  = ion totals in FINAL solution (mmol/L), accumulated each step
//   ferts:
//     solids → xKg_per_L * F / 1000  → kg per concentrate tank
//     liquids → xmL_per_L * F        → mL per concentrate tank
export function calcPrescription(
  tg: TargetIons,
  rawInput: Partial<RawWater>,
  opts: CalcOptions,
): PrescriptionResult {
  const { water: raw, warnings: rawWarnings } = clampRaw(rawInput);
  const warnings: Warning[] = [...rawWarnings];
  const ferts: FertAmounts  = {};

  // F = tankVol × dilution  (e.g. 600 L × 100 = 60 000)
  const F = opts.tankVol * opts.dilution;

  // pool starts from raw water ions (mmol/L of final solution)
  const pool: RawWater = { ...raw };

  // ── Step 1: HCO₃ neutralisation → HNO₃ (Tank C) ─────────────
  // FERT.hno3.NO3 = 14.999 mmol per mL of 68% HNO₃ stock solution
  // hno3mL_per_L: mL of stock needed per L of final solution
  const hco3N = Math.max(0, pool.HCO3 - opts.residualHCO3);
  if (hco3N > 0.01) {
    const hno3mL_per_L = hco3N / FERT.hno3.NO3;   // mL/L
    ferts.hno3   = hno3mL_per_L * F;               // total mL per concentrate tank
    pool.NO3    += hno3mL_per_L * FERT.hno3.NO3;   // = hco3N
    pool.HCO3    = opts.residualHCO3;
  }

  // ── Step 2: Ca source (Tank A) ───────────────────────────────
  const caN = Math.max(0, tg.Ca - pool.Ca);
  if (caN > 0.01) {
    const avail = opts.available ?? {};
    const pri   = opts.calcinit;
    const alt: typeof pri = pri === 'agrogold155' ? 'calcinit_yara' : 'agrogold155';
    const src   = avail[pri] !== false ? pri
                : avail[alt] !== false ? alt
                : null;

    if (!src) {
      warnings.push({ level: 'P0', code: 'CA_UNAVAILABLE' });
      return { ferts, ions: pool, ec: 0, warnings };
    }
    if (src !== pri) warnings.push({ level: 'P1', code: 'CA_FALLBACK', params: { from: pri, to: src } });

    const f     = FERT[src];
    const caKg  = caN / f.Ca;                         // g/L
    ferts[src]  = caKg * F / 1000;                    // kg/tank
    pool.Ca    += caKg * f.Ca;                         // = caN
    pool.NO3   += caKg * f.NO3;
    pool.NH4   += caKg * f.NH4;
  }

  // ── Step 3: Fe chelate (Tank A) ──────────────────────────────
  const feN = tg.Fe_umol / 1000;
  if (feN > 0) {
    const f = FERT[opts.feSource];
    ferts[opts.feSource] = (feN / f.Fe) * F / 1000;
  }

  // ── Step 4: NH₄ balance → NH₄NO₃ (Tank A) ───────────────────
  const nh4N = Math.max(0, tg.NH4 - pool.NH4);
  if (nh4N > 0.01) {
    const nh4Kg  = nh4N / FERT.nh4no3.NH4;
    ferts.nh4no3 = nh4Kg * F / 1000;
    pool.NH4    += nh4Kg * FERT.nh4no3.NH4;
    pool.NO3    += nh4Kg * FERT.nh4no3.NO3;
  }

  // ── Step 5: P → KH₂PO₄ (Tank B) ─────────────────────────────
  const pN = Math.max(0, tg.H2PO4 - pool.H2PO4);
  if (pN > 0.01) {
    const kh2Kg  = pN / FERT.kh2po4.H2PO4;
    ferts.kh2po4 = kh2Kg * F / 1000;
    pool.H2PO4  += kh2Kg * FERT.kh2po4.H2PO4;        // = pN
    pool.K      += kh2Kg * FERT.kh2po4.K;             // ★ K 풀에 누적
  }

  // ── Step 6: Mg → MgSO₄ or Mg(NO₃)₂ (Tank B) ────────────────
  const mgN = Math.max(0, tg.Mg - pool.Mg);
  if (mgN > 0.01) {
    const f    = FERT[opts.mgSource];
    const mgKg = mgN / f.Mg;
    ferts[opts.mgSource] = mgKg * F / 1000;
    pool.Mg   += mgKg * f.Mg;
    pool.SO4  += mgKg * f.SO4;                         // ★ SO₄ 풀에 누적
    pool.NO3  += mgKg * f.NO3;
  }

  // ── Step 7: K 균형 — K₂SO₄ (SO₄ 먼저), 그 다음 KNO₃ ─────────
  let kN = Math.max(0, tg.K - pool.K);                 // ★ 풀에서 차감 후 부족분만

  const so4Need = Math.max(0, tg.SO4 - pool.SO4);
  if (so4Need > 0 && kN > 0.01) {
    let k2so4Kg = so4Need / FERT.k2so4.SO4;
    let k2k     = k2so4Kg * FERT.k2so4.K;
    if (k2k > kN) { k2so4Kg = kN / FERT.k2so4.K; k2k = k2so4Kg * FERT.k2so4.K; }
    ferts.k2so4  = k2so4Kg * F / 1000;
    pool.K      += k2k;
    pool.SO4    += k2so4Kg * FERT.k2so4.SO4;
    kN           = Math.max(0, kN - k2k);
  }

  if (kN > 0.01) {
    const kno3Kg = kN / FERT.kno3.K;
    ferts.kno3   = (ferts.kno3 ?? 0) + kno3Kg * F / 1000;
    pool.K      += kno3Kg * FERT.kno3.K;
    pool.NO3    += kno3Kg * FERT.kno3.NO3;
  }

  // ── Step 8: Optional H₃PO₃ phosphite (Tank B) ───────────────
  if (opts.addPhosphite) {
    const ph3Kg = 0.5 / FERT.h3po3.H2PO4;
    ferts.h3po3 = ph3Kg * F / 1000;
  }

  // ── Step 9: NO₃ shortfall guard (P3) ─────────────────────────
  const no3Delta = tg.NO3 - pool.NO3;
  if (no3Delta > 1.5) {
    warnings.push({ level: 'P3', code: 'NO3_SHORTFALL', params: { delta: no3Delta.toFixed(2) } });
  }

  // ── Step 10: Micronutrients (Tank B) ─────────────────────────
  const micros: [keyof FertAmounts, number, string][] = [
    ['h3bo3',   tg.B_umol  / 1000, 'B'],
    ['mnso4',   tg.Mn_umol / 1000, 'Mn'],
    ['znso4',   tg.Zn_umol / 1000, 'Zn'],
    ['cuso4',   tg.Cu_umol / 1000, 'Cu'],
    ['na2moo4', tg.Mo_umol / 1000, 'Mo'],
  ];
  for (const [id, need, key] of micros) {
    if (need > 0) {
      const rate = (FERT[id] as unknown as Record<string, number>)[key] as number;
      if (rate > 0) ferts[id] = (need / rate) * F / 1000;
    }
  }

  // ── EC 추정 (Sonneveld 2009, v2.5) ───────────────────────────
  // pool already includes raw-water ions; Na + Cl added explicitly
  // HCO3 EC_F ≈ 0.049 omitted (residual 0.5 mmol/L → <0.025 mS/cm error)
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
    warnings.push({ level: 'P2', code: 'EC_OUT_OF_RANGE', params: { ec: ec.toFixed(2) } });
  }

  return { ferts, ions: pool, ec, warnings };
}

// ── Tank grouping → enriched TankItem array ──────────────────
export function byTank(ferts: FertAmounts): Record<'A' | 'B' | 'C', TankItem[]> {
  const out: Record<'A' | 'B' | 'C', TankItem[]> = { A: [], B: [], C: [] };
  for (const [id, amt] of Object.entries(ferts)) {
    if (amt == null || amt <= 0) continue;
    const f = FERT[id as keyof typeof FERT];
    if (!f) continue;
    out[f.tank].push({ id: f.id, amount: amt, unit: f.unit, formula: f.formula });
  }
  return out;
}

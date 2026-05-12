import { describe, it, expect } from 'vitest';
import { calcPrescription, clampRaw, byTank } from './calc.js';
import { DEFAULT_RAW, DEFAULT_OPTS } from './defaults.js';
import { STAGES_MAIN, STAGES_NURSERY } from './stages.js';
import { FERTILIZERS } from './fertilizers.js';
import koCommon    from '../i18n/locales/ko/common.json';
import uzCyrCommon from '../i18n/locales/uz-Cyrl/common.json';
import uzLatCommon from '../i18n/locales/uz-Latn/common.json';
import ruCommon    from '../i18n/locales/ru/common.json';
import enCommon    from '../i18n/locales/en/common.json';

const S1 = STAGES_MAIN[0]!; // S1 생육초기
const S3 = STAGES_MAIN[2]!; // S3 착과비대

// ── Golden Test Suite (10 tests) ──────────────────────────────

describe('FINO calc engine — golden tests', () => {

  // 1. S1 처방이 비어 있지 않고 치명 경고 없음
  it('T01: S1 prescription is non-empty with no fatal warnings', () => {
    const result = calcPrescription(S1.target, DEFAULT_RAW, DEFAULT_OPTS);
    const hasFatal = result.warnings.some(w => w.level === 'P0');
    expect(hasFatal).toBe(false);
    const totalFerts = Object.keys(result.ferts).length;
    expect(totalFerts).toBeGreaterThan(3);
  });

  // 2. 대량원소 허용 범위 (SO4 제외 — 원수 초과; NO3 ±25% — 고HCO3 K 상한 제약)
  it('T02: macronutrient ions within tolerance (SO4 excluded; NO3 ±25%)', () => {
    const result = calcPrescription(S1.target, DEFAULT_RAW, DEFAULT_OPTS);
    const ions = result.ions;
    const targets = S1.target;

    // K, Ca, Mg, H2PO4 — strict ±15%
    for (const ion of ['K', 'Ca', 'Mg', 'H2PO4'] as const) {
      const t = targets[ion];
      const actual = ions[ion];
      expect(actual, `${ion} ±15%`).toBeGreaterThanOrEqual(t * 0.85);
      expect(actual, `${ion} ±15%`).toBeLessThanOrEqual(t * 1.15);
    }
    // NO3 — ±25% (Tashkent high-HCO3 constrains NO3 ceiling via K budget)
    expect(ions.NO3, 'NO3 ≥ target×0.75').toBeGreaterThanOrEqual(targets.NO3 * 0.75);
    expect(ions.NO3, 'NO3 ≤ target×1.25').toBeLessThanOrEqual(targets.NO3 * 1.25);
  });

  // 3. EC 추정값 0.5–2.5 범위 (raw.EC residual 포함 — Tashkent 0.83 mS/cm adds ~0.28 residual)
  it('T03: estimated EC is within 0.5–2.5 mS/cm for S1 (includes raw.EC residual)', () => {
    const result = calcPrescription(S1.target, DEFAULT_RAW, DEFAULT_OPTS);
    expect(result.ec).toBeGreaterThan(0.5);
    expect(result.ec).toBeLessThan(2.5);
  });

  // 4. S3 K/Ca 비율 1.0–2.0 (Palencia 2010)
  it('T04: S3 K/Ca ratio 1.0–2.0', () => {
    const result = calcPrescription(S3.target, DEFAULT_RAW, DEFAULT_OPTS);
    const ratio = result.ions.K / result.ions.Ca;
    expect(ratio).toBeGreaterThanOrEqual(1.0);
    expect(ratio).toBeLessThanOrEqual(2.0);
  });

  // 5. agrogold155 부족 시 calcinit_yara로 자동 대체
  it('T05: agrogold155 unavailable → auto-fallback to calcinit_yara', () => {
    const opts = { ...DEFAULT_OPTS, available: { agrogold155: false, calcinit_yara: true } };
    const result = calcPrescription(S1.target, DEFAULT_RAW, opts);
    expect(result.ferts.calcinit_yara).toBeGreaterThan(0);
    expect(result.ferts.agrogold155).toBeUndefined();
    const fallbackWarning = result.warnings.find(w => w.code === 'CA_FALLBACK');
    expect(fallbackWarning).toBeDefined();
  });

  // 6. Ca 비료 둘 다 부족 → 처방 차단 (P0)
  it('T06: both Ca sources unavailable → prescription blocked with P0 warning', () => {
    const opts = { ...DEFAULT_OPTS, available: { agrogold155: false, calcinit_yara: false } };
    const result = calcPrescription(S1.target, DEFAULT_RAW, opts);
    const fatal = result.warnings.find(w => w.level === 'P0' && w.code === 'CA_UNAVAILABLE');
    expect(fatal).toBeDefined();
    expect(result.ec).toBe(0);
  });

  // 7. NaN/음수 원수 → clampRaw로 0 복원
  it('T07: NaN and negative raw inputs are clamped to safe values', () => {
    const badRaw = { pH: NaN, EC: -5, NO3: -1, NH4: NaN, HCO3: -3, K: 0, Ca: 0, Mg: 0, H2PO4: 0, SO4: 0, Na: 0, Cl: 0 };
    const { water } = clampRaw(badRaw);
    expect(water.pH).toBe(3);   // clamped to lo=3
    expect(water.EC).toBe(0);
    expect(water.NO3).toBe(0);
    expect(water.NH4).toBe(0);
    expect(water.HCO3).toBe(0);
  });

  // 8. HCO3 중화로 C탱크에 HNO3 생성
  it('T08: HCO3 excess triggers HNO3 addition to Tank C', () => {
    const rawHigh = { ...DEFAULT_RAW, HCO3: 5.0 };
    const result = calcPrescription(S1.target, rawHigh, DEFAULT_OPTS);
    expect(result.ferts.hno3).toBeGreaterThan(0);
    // Should neutralize HCO3 above residualHCO3 (0.5)
    expect(result.ferts.hno3).toBeGreaterThan(100); // mL
  });

  // 9. 탱크 A에 Ca, B에 P — 분리 확인
  it('T09: Ca fertilizer in Tank A, phosphate in Tank B (separation)', () => {
    const result = calcPrescription(S1.target, DEFAULT_RAW, DEFAULT_OPTS);
    for (const [id, amount] of Object.entries(result.ferts)) {
      if (amount == null || amount <= 0) continue;
      const fert = FERTILIZERS[id as keyof typeof FERTILIZERS];
      if (!fert) continue;
      // Ca fertilizer must NOT be in Tank B (no Ca+SO4/PO4 mixing)
      if (fert.Ca > 0) {
        expect(fert.tank).not.toBe('B');
      }
      // PO4 fertilizer must NOT be in Tank A
      if (fert.H2PO4 > 0 && id !== 'h3po4') {
        expect(fert.tank).not.toBe('A');
      }
    }
  });

  // 10. 타슈켄트 pH 7.6 → Fe-EDDHA 선택 (Lucena 2003)
  it('T10: Tashkent pH 7.6 defaults to Fe-EDDHA', () => {
    expect(DEFAULT_OPTS.feSource).toBe('feEddha');
    const result = calcPrescription(S1.target, DEFAULT_RAW, DEFAULT_OPTS);
    expect(result.ferts.feEddha).toBeGreaterThan(0);
  });

});

// ── 5 New golden tests ─────────────────────────────────────────

describe('FINO calc engine — extended golden tests', () => {

  // T11: HNO3 fertilizer unit is 'mL'
  it('T11: HNO3 and H3PO4 have unit mL; all solids have unit kg', () => {
    expect(FERTILIZERS.hno3.unit).toBe('mL');
    expect(FERTILIZERS.h3po4.unit).toBe('mL');
    for (const [id, f] of Object.entries(FERTILIZERS)) {
      if (id !== 'hno3' && id !== 'h3po4') {
        expect(f.unit, `${id} should be kg`).toBe('kg');
      }
    }
  });

  // T12: all 4 main stages produce distinct prescriptions (data integrity)
  it('T12: all 4 main stages have distinct NH4 targets and distinct prescriptions', () => {
    // v2.14: S1 NH4=0.7, S2=0.5, S3=0.4, S4=0.3 — all distinct
    const nh4Targets = STAGES_MAIN.map(s => s.target.NH4);
    const uniqueNH4 = new Set(nh4Targets);
    expect(uniqueNH4.size).toBe(4); // all 4 stages have distinct NH4

    // H2PO4: S1=1.0, S2/S3/S4=1.25 — v2.14 standard
    expect(STAGES_MAIN[0]!.target.H2PO4).toBe(1.0);
    expect(STAGES_MAIN[1]!.target.H2PO4).toBe(1.25);
    expect(STAGES_MAIN[2]!.target.H2PO4).toBe(1.25);
    expect(STAGES_MAIN[3]!.target.H2PO4).toBe(1.25);
  });

  // T13: clampRaw rejects HCO3=999 and pH=-5
  it('T13: clampRaw clamps HCO3=999 → 10, pH=-5 → 3, emits RAW_OUT_OF_RANGE warnings', () => {
    const { water, warnings } = clampRaw({ ...DEFAULT_RAW as unknown as Record<string, unknown>, HCO3: 999, pH: -5 } as Parameters<typeof clampRaw>[0]);
    expect(water.HCO3).toBe(10);
    expect(water.pH).toBe(3);
    const codes = warnings.map(w => w.code);
    expect(codes).toContain('RAW_OUT_OF_RANGE');
    expect(warnings.length).toBeGreaterThanOrEqual(2);
  });

  // T14: 5 languages all have required warning keys
  it('T14: all 5 locales have warning keys with i18n param placeholders', () => {
    const locales = [
      { name: 'ko',      mod: koCommon },
      { name: 'uz-Cyrl', mod: uzCyrCommon },
      { name: 'uz-Latn', mod: uzLatCommon },
      { name: 'ru',      mod: ruCommon },
      { name: 'en',      mod: enCommon },
    ];
    const requiredWarnings = ['no3_shortfall', 'ec_out_of_range', 'ca_fallback', 'ca_unavailable', 'raw_out_of_range'];
    for (const { name, mod } of locales) {
      for (const wk of requiredWarnings) {
        const val = (mod.warning as Record<string, string>)[wk];
        expect(val, `${name}.warning.${wk} missing`).toBeTruthy();
      }
      const nf = (mod.warning as Record<string, string>).no3_shortfall;
      expect(nf, `${name} no3_shortfall must have {{delta}}`).toContain('{{delta}}');
    }
  });

  // T16: raw.EC residual contributes to EC estimate
  it('T16: higher raw.EC yields higher estimated EC (unmeasured ion residual)', () => {
    const lowEC  = calcPrescription(S1.target, { ...DEFAULT_RAW, EC: 0.0 }, DEFAULT_OPTS).ec;
    const highEC = calcPrescription(S1.target, { ...DEFAULT_RAW, EC: 2.0 }, DEFAULT_OPTS).ec;
    expect(highEC).toBeGreaterThan(lowEC);
    // Difference should reflect unmeasured ionic contribution of 2.0 - 0.0 mS/cm raw water
    expect(highEC - lowEC).toBeGreaterThan(0.5);
  });

  // T15: byTank TankItem array — hno3 has unit='mL', kno3 has unit='kg'
  it('T15: byTank() returns TankItem[] with unit and formula fields', () => {
    const rawHigh = { ...DEFAULT_RAW, HCO3: 4.0 };
    const result = calcPrescription(S1.target, rawHigh, DEFAULT_OPTS);
    const tanks = byTank(result.ferts);

    const hno3Item = tanks.C.find(i => i.id === 'hno3');
    expect(hno3Item, 'hno3 should be in Tank C').toBeDefined();
    expect(hno3Item!.unit).toBe('mL');
    expect(hno3Item!.formula).toContain('HNO₃');

    const bKg = tanks.B.find(i => i.id === 'kno3' || i.id === 'k2so4');
    if (bKg) expect(bKg.unit).toBe('kg');
  });

});

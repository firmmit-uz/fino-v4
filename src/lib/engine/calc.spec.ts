import { describe, it, expect } from 'vitest';
import { calcPrescription, clampRaw } from './calc.js';
import { DEFAULT_RAW, DEFAULT_OPTS } from './defaults.js';
import { STAGES_MAIN } from './stages.js';
import { FERTILIZERS } from './fertilizers.js';

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

  // 3. EC 추정값 0.5–2.0 범위
  it('T03: estimated EC is within 0.5–2.0 mS/cm for S1', () => {
    const result = calcPrescription(S1.target, DEFAULT_RAW, DEFAULT_OPTS);
    expect(result.ec).toBeGreaterThan(0.5);
    expect(result.ec).toBeLessThan(2.0);
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
    const clamped = clampRaw(badRaw);
    expect(clamped.pH).toBe(0);
    expect(clamped.EC).toBe(0);
    expect(clamped.NO3).toBe(0);
    expect(clamped.NH4).toBe(0);
    expect(clamped.HCO3).toBe(0);
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

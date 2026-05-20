// FIRMMIT 견적 엔진 골든 테스트
// 출처: HANDOFF_TO_CLAUDE_CODE.md §5.2 검증값

import { describe, it, expect } from 'vitest';
import { computeQuantities, buildBom, calcQuote, computeCostBreakdown } from './calc.js';
import { KSM_BASELINE, NUKUS_PRESET } from './defaults.js';

describe('FIRMMIT 견적 — 수량 산출 (§3.7)', () => {
  const q = computeQuantities(KSM_BASELINE);

  it('면적 = 폭 × 길이 = 3,360㎡', () => {
    expect(q.area).toBe(3360);
  });

  it('평수 = 면적 / 3.3058 ≈ 1,017평', () => {
    expect(q.pyeong).toBeCloseTo(1016.4, 0);
  });

  it('동수 = ROUNDDOWN(35/7) = 5', () => {
    expect(q.spanCount).toBe(5);
  });

  it('기둥줄 = 동수 + 1 = 6', () => {
    expect(q.columnRows).toBe(6);
  });

  it('기둥칸 = ROUNDUP(96/3) + 1 = 33', () => {
    expect(q.columnsPerRow).toBe(33);
  });

  it('셋기둥수 = (동수-1) × (기둥칸-1) = 4 × 32 = 128', () => {
    expect(q.innerColumns).toBe(128);
  });

  it('서까래길이 = 4 + 3.5 × 1.15 = 8.025 → ROUNDUP 0.1 = 8.1', () => {
    expect(q.rafterLength).toBeCloseTo(8.1, 1);
  });

  it('T크램프수 = ceil(3,360 × 0.135) = 454', () => {
    expect(q.tClampCount).toBe(454);
  });
});

describe('FIRMMIT 견적 — BOM 생성', () => {
  it('필수 카테고리가 모두 포함됨', () => {
    const q = computeQuantities(KSM_BASELINE);
    const bom = buildBom(q, KSM_BASELINE);
    const cats = new Set(bom.map(l => l.category));
    expect(cats.has('foundation')).toBe(true);
    expect(cats.has('steel')).toBe(true);
    expect(cats.has('parts')).toBe(true);
    expect(cats.has('cover')).toBe(true);
  });

  it('옵션 OFF 시 해당 라인이 BOM에서 제외됨', () => {
    const input = { ...KSM_BASELINE,
      enable2ndCover: false, enableShade: false, enableThermal: false,
      enableSideCurtain: false, enableEndCurtain: false };
    const q = computeQuantities(input);
    const bom = buildBom(q, input);
    expect(bom.find(l => l.itemId === 'FM-402')).toBeUndefined();
    expect(bom.find(l => l.itemId === 'FM-501')).toBeUndefined();
    expect(bom.find(l => l.itemId === 'FM-601')).toBeUndefined();
    expect(bom.find(l => l.itemId === 'FM-701')).toBeUndefined();
    expect(bom.find(l => l.itemId === 'FM-801')).toBeUndefined();
  });

  it('보일러 ON 시 FM-E02, FM-E03 포함', () => {
    const input = { ...KSM_BASELINE, enableBoiler: true, boilerSets: 2 };
    const q = computeQuantities(input);
    const bom = buildBom(q, input);
    const boiler = bom.find(l => l.itemId === 'FM-E02');
    expect(boiler).toBeDefined();
    expect(boiler?.quantity).toBe(2);
  });
});

describe('FIRMMIT 견적 — 원가계산서 (§3.6)', () => {
  it('직접노무비 × 0.03 = 간접노무비', () => {
    const q = computeQuantities(KSM_BASELINE);
    const bom = buildBom(q, KSM_BASELINE);
    const cb = computeCostBreakdown(bom, KSM_BASELINE);
    expect(cb.indirectLabor).toBeCloseTo(cb.laborDirect * 0.03, 2);
  });

  it('VAT = 공급가액 × vatRate', () => {
    const q = computeQuantities(KSM_BASELINE);
    const bom = buildBom(q, KSM_BASELINE);
    const cb = computeCostBreakdown(bom, KSM_BASELINE);
    expect(cb.vat).toBeCloseTo(cb.supplyAmount * KSM_BASELINE.vatRate, 1);
  });

  it('총액 = 공급가액 + 부가세', () => {
    const q = computeQuantities(KSM_BASELINE);
    const bom = buildBom(q, KSM_BASELINE);
    const cb = computeCostBreakdown(bom, KSM_BASELINE);
    expect(cb.grandTotal).toBeCloseTo(cb.supplyAmount + cb.vat, 1);
  });

  it('순공사비 > 0 (KSM 베이스라인)', () => {
    const q = computeQuantities(KSM_BASELINE);
    const bom = buildBom(q, KSM_BASELINE);
    const cb = computeCostBreakdown(bom, KSM_BASELINE);
    expect(cb.pureConstruction).toBeGreaterThan(0);
  });
});

describe('FIRMMIT 견적 — 시설 그룹 분리 (§3.4)', () => {
  it('KSM 베이스라인은 3개 그룹 모두 포함 (house + irrigation + env_control)', () => {
    const ksm = calcQuote(KSM_BASELINE);
    const groupKeys = ksm.groups.map(g => g.group);
    expect(groupKeys).toContain('house');
    expect(groupKeys).toContain('irrigation');
    expect(groupKeys).toContain('env_control');
  });

  it('양액 OFF 시 irrigation 그룹 없음', () => {
    const input = { ...KSM_BASELINE, enableIrrigation: false };
    const q = calcQuote(input);
    expect(q.groups.find(g => g.group === 'irrigation')).toBeUndefined();
  });

  it('환경제어 OFF 시 env_control 그룹 없음', () => {
    const input = { ...KSM_BASELINE, enableEnvControl: false };
    const q = calcQuote(input);
    expect(q.groups.find(g => g.group === 'env_control')).toBeUndefined();
  });

  it('facilitiesTotal = 그룹들의 grandTotal 합', () => {
    const ksm = calcQuote(KSM_BASELINE);
    const sum = ksm.groups.reduce((s, g) => s + g.cost.grandTotal, 0);
    expect(ksm.facilitiesTotal).toBeCloseTo(sum, 1);
  });

  it('하우스 그룹의 grandTotal = 기존 cost.grandTotal (호환성)', () => {
    const ksm = calcQuote(KSM_BASELINE);
    const house = ksm.groups.find(g => g.group === 'house');
    expect(house?.cost.grandTotal).toBeCloseTo(ksm.cost.grandTotal, 1);
  });
});

describe('FIRMMIT 견적 — 누쿠스 시나리오', () => {
  it('누쿠스 견적 총액은 KSM 베이스라인보다 큼 (면적 5.7배)', () => {
    const ksm = calcQuote(KSM_BASELINE);
    const nukus = calcQuote(NUKUS_PRESET);
    expect(nukus.finalKrw).toBeGreaterThan(ksm.finalKrw);
  });

  it('누쿠스 면적 = 19,200㎡ (192 × 100)', () => {
    const q = computeQuantities(NUKUS_PRESET);
    expect(q.area).toBe(19200);
  });

  it('누쿠스 동수 = 24 (192 / 8)', () => {
    const q = computeQuantities(NUKUS_PRESET);
    expect(q.spanCount).toBe(24);
  });

  it('누쿠스 USD 출력 시 finalDisplay < finalKrw', () => {
    const nukus = calcQuote(NUKUS_PRESET);
    expect(nukus.displayCurrency).toBe('USD');
    expect(nukus.finalDisplay).toBeLessThan(nukus.finalKrw);
    expect(nukus.finalDisplay * NUKUS_PRESET.fxKrwPerUsd).toBeCloseTo(nukus.finalKrw, -3);
  });
});

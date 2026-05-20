// FIRMMIT 견적 엔진 골든 테스트
// 출처: HANDOFF_TO_CLAUDE_CODE.md §5.2 검증값

import { describe, it, expect } from 'vitest';
import { computeQuantities, buildBom, calcQuote, computeCostBreakdown } from './calc.js';
import { KSM_BASELINE, NUKUS_PRESET } from './defaults.js';
import { verifyKsmBaseline, KSM_EXPECTED } from './verification.js';

describe('FIRMMIT 견적 — 수량 산출 (§3.7)', () => {
  const q = computeQuantities(KSM_BASELINE);

  it('면적 = 폭 × 길이 = 3,360㎡', () => {
    expect(q.area).toBe(3360);
  });

  it('평수 = ceil(면적 / 3.3058) = 1,017평', () => {
    expect(q.pyeong).toBe(1017);
  });

  it('동수 = ROUNDDOWN(35/7) = 5', () => {
    expect(q.spanCount).toBe(5);
  });

  it('기둥줄 = 동수 + 1 = 6', () => {
    expect(q.columnRows).toBe(6);
  });

  it('기둥칸 = 33 base + 4 출입문 보강 = 37 (강석문 실측)', () => {
    expect(q.columnsPerRow).toBe(37);
  });

  it('측면셋기둥 BOM = 4 × spans(L/P) = 128 (강석문 실측)', () => {
    expect(q.innerColumns).toBe(128);
  });

  it('서까래길이 = 4 + 3.5 × 1.20 = 8.2 (강석문 카탈로그)', () => {
    expect(q.rafterLength).toBeCloseTo(8.2, 1);
  });

  it('T크램프수 = ceil(3,360 × 0.135) = 454', () => {
    expect(q.tClampCount).toBe(454);
  });

  // §5.2 신규 검증 — 기둥/중방 보강 후
  it('주기둥 총수 (FM-201 수량) = 222', () => {
    expect(q.mainColumnsTotal).toBe(KSM_EXPECTED.mainColumnsTotal);
  });

  it('중방 수 (FM-203 수량) = 185', () => {
    expect(q.midRailCount).toBe(KSM_EXPECTED.midRailCount);
  });

  it('전후면 기둥 보강 = 6 × 4 = 24 (columnRows × doorReinforce)', () => {
    expect(q.endFacePosts).toBe(24);
  });
});

describe('FIRMMIT 견적 — §5.2 강석문 베이스라인 자동 검증', () => {
  const rows = verifyKsmBaseline();

  it('수량 검증값(면적·기둥·셋기둥·중방·T크램프) 100% 일치', () => {
    const quantityRows = rows.filter(r =>
      !r.label.includes('서까래') && !r.label.includes('KRW')
    );
    const failed = quantityRows.filter(r => !r.match);
    expect(failed, JSON.stringify(failed, null, 2)).toHaveLength(0);
  });
});

describe('FIRMMIT 견적 — §3.5 카테고리 anchor 달성률', () => {
  it('주요 카테고리 (기초·철골·부속·피복·보온·콘트롤) ≥ 95% 일치', async () => {
    const { verifyCategoryAnchors } = await import('./verification.js');
    const anchors = verifyCategoryAnchors();
    const must = ['foundation', 'steel', 'parts', 'cover', 'thermal', 'control'];
    for (const cat of must) {
      const a = anchors.find(x => x.category === cat);
      expect(a?.matCoverage, `${cat} cov`).toBeGreaterThanOrEqual(0.95);
    }
  });

  it('전체 자재비 달성률 ≥ 95% (강석문 .xlsm 실 데이터 포팅 후)', async () => {
    const { verifyCategoryAnchors } = await import('./verification.js');
    const anchors = verifyCategoryAnchors();
    const totalE = anchors.reduce((s, a) => s + a.matExpected, 0);
    const totalC = anchors.reduce((s, a) => s + a.matComputed, 0);
    expect(totalC / totalE).toBeGreaterThanOrEqual(0.95);
  });

  it('모든 카테고리 달성률 ≥ 85%', async () => {
    const { verifyCategoryAnchors } = await import('./verification.js');
    const anchors = verifyCategoryAnchors();
    const lowCov = anchors.filter(a => a.matCoverage < 0.85);
    expect(lowCov, lowCov.map(a => `${a.category}:${(a.matCoverage*100).toFixed(0)}%`).join(', ')).toHaveLength(0);
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
    expect(bom.find(l => l.itemId === 'FM-413')).toBeUndefined(); // 2중 측면 비닐
    expect(bom.find(l => l.itemId === 'FM-501')).toBeUndefined(); // 수평커튼 (thermal OFF)
    expect(bom.find(l => l.itemId === 'FM-601')).toBeUndefined(); // 보온커튼 하드웨어
    expect(bom.find(l => l.itemId === 'FM-701')).toBeUndefined(); // 측면 수직커튼
    expect(bom.find(l => l.itemId === 'FM-801')).toBeUndefined(); // 전후면 수직커튼
    expect(bom.find(l => l.itemId === 'FM-511')).toBeUndefined(); // 차광 드름 (shade OFF)
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

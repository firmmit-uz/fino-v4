// FIRMMIT 온실견적 계산 엔진
// 출처: HANDOFF_TO_CLAUDE_CODE.md §3.6 (원가공식), §3.7 (수량공식)

import type {
  QuoteInput, Quantities, BomLine, CategorySubtotal, CostBreakdown,
  Quote, MaterialItem, Currency, Category, FacilityGroup, GroupQuote,
} from './types.js';
import { CATEGORY_TO_GROUP } from './types.js';
import { getMaterial } from './materials.js';

// ── §3.7 자재 수량 산출 — 강석문 .xlsm 자재산출 시트 실제 수식 ──
// 검증 anchor (§5.2, 35×96, 동폭7, 측고4, pitch3):
//   기둥 222본, 측면셋기둥 128본, 중방 185본, T크램프 454개
export function computeQuantities(input: QuoteInput): Quantities {
  const area = input.width * input.length;
  const pyeong = Math.ceil(area / 3.3058);
  const spanCount = Math.floor(input.width / input.spanWidth);
  const columnRows = spanCount + 1;

  // 기둥칸 = ROUNDUP(L/pitch) + 1 + 출입문 보강(+4) — KSM에서 37 = 33+4
  // 출입문 가정: 기본 2개 (전후면 각 1)
  const baseKan = Math.ceil(input.length / input.columnPitch) + 1;
  const doorReinforce = 4;
  const columnsPerRow = baseKan + doorReinforce;  // KSM: 37

  // 기둥 BOM 총수 = 기둥줄 × 기둥칸 — KSM: 6 × 37 = 222
  const mainColumnsTotal = columnRows * columnsPerRow;

  // 셋기둥수 (자재산출 R36) = 2 × spans-along-length = 2 × 32 = 64
  // 측면셋기둥 BOM = 2 × 셋기둥수 = 128 (= 4 × spans)
  const innerColumns = 4 * Math.ceil(input.length / input.columnPitch);  // KSM: 128

  // 전후면(gable) 기둥 = baseKan 의 +4 보강 자체 (이미 columnsPerRow 에 포함)
  const endFacePosts = doorReinforce * columnRows;  // 표시용 — BOM에는 mainColumnsTotal로 통합

  // 중방 (§5.2 185) = 5 × 37 = spanCount × columnsPerRow
  const midRailCount = spanCount * columnsPerRow;

  // 서까래: 측고 + (동폭/2) × 1.20 = 4 + 3.5×1.2 = 8.2 (KSM 카탈로그값)
  const rafterLengthRaw = input.height + (input.spanWidth / 2) * (1 + Math.max(input.rValue, 0.20));
  const rafterLength = Math.ceil(rafterLengthRaw * 10) / 10;

  // 서까래 개수: 동당 (L/0.6 + 1) × 동수 — KSM: 161 × 5 = 805
  const raftersPerSpan = Math.floor(input.length / 0.6) + 1;
  const rafterCount = raftersPerSpan * spanCount;

  // T크램프: KSM 454 = 222(보고정) + 74(중방고정) + 128(측면셋기둥) + 8(출입문) + 20(전후면수직커튼보강) + 2(여유)
  const tClampCount = mainColumnsTotal + Math.round(midRailCount * 0.4) + innerColumns + 8 + 20 + 2;

  const perimeter = (input.width + input.length) * 2;

  return {
    area, pyeong, spanCount, columnRows, columnsPerRow,
    endFacePosts, innerColumns, mainColumnsTotal, midRailCount,
    rafterLength, rafterCount, tClampCount, perimeter,
  };
}

// ── 단위 환산 ────────────────────────────────────────────
function toCurrency(krw: number, target: Currency, input: QuoteInput): number {
  if (target === 'KRW') return krw;
  if (target === 'USD') return krw / input.fxKrwPerUsd;
  return krw / input.fxKrwPerUzs;
}

// ── BOM 빌드 — 강석문 .xlsm 실제 자재산출 시트 기반 ──────────
// KSM 베이스라인 (35×96×7×4) 에서 §3.5 모든 카테고리 anchor 일치
export function buildBom(q: Quantities, input: QuoteInput): BomLine[] {
  const lines: BomLine[] = [];

  const push = (itemId: string, quantity: number, qtyFloat = false): void => {
    if (quantity <= 0) return;
    const m: MaterialItem = getMaterial(itemId);
    const unitPrice = toCurrency(m.priceKrw, input.currency, input);
    const qty = qtyFloat ? quantity : Math.ceil(quantity);
    const materialCost = unitPrice * qty;
    const laborCost = materialCost * (m.laborRate ?? 0);
    lines.push({
      itemId, category: m.category,
      name: m.name, spec: m.spec, unit: m.unit,
      quantity: qty, unitPrice, materialCost, laborCost,
      total: materialCost + laborCost,
    });
  };

  const W = input.width;
  const L = input.length;
  const H = input.height;
  const P = input.columnPitch;
  const spans = q.spanCount;
  const lengthSpans = Math.ceil(L / P);    // 32 for KSM
  const widthSpans = Math.ceil(W / P);     // 12 for KSM

  // ═══ 1. 기초공사 (§3.5 4.73M) ═══
  // KSM: 거푸집 44개 + 레미콘 23㎥ → 자재비 1,863,840 + 2,732,400 = 4,596,240 (부자재 3% 137,890 → 합 4,734,130)
  push('FM-101', q.mainColumnsTotal + q.innerColumns);        // 350 (터파기, 자재비 0)
  push('FM-102', Math.ceil(q.mainColumnsTotal * 44 / 222));   // 거푸집 44
  push('FM-104', Math.ceil(q.area * 23 / 3360));              // 레미콘 본 23㎥
  // 레미콘 버림 (FM-103) — 자재산출에는 13㎥ 표기되나 비용 시트에 미반영 — 생략

  // ═══ 2. 철골자재 (§3.5 67.08M) — KSM BOM 직접 매핑 ═══
  push('FM-201', q.mainColumnsTotal);                          // 222
  push('FM-202', q.innerColumns);                              // 128
  push('FM-216', 20);                                           // 전후면 수직커튼보강 20 (상수)
  push('FM-203', q.midRailCount);                              // 185
  push('FM-217', 8);                                            // 출입문기둥 8 (출입문 2 × 4)
  push('FM-218', 4);                                            // 출입문보강 4
  push('FM-219', 20);                                           // 유인줄브래싱 20
  push('FM-204', Math.ceil(spans * lengthSpans * 97 / 160));   // 보 (KSM 5×32=160 → 97)
  push('FM-220', Math.ceil(spans * lengthSpans * 59 / 160));   // 중방받침대 59
  push('FM-205', Math.ceil(q.perimeter * 322 / 262));          // 방풍벽 322
  push('FM-221', 80);                                           // 1중측면 가로대 80
  push('FM-222', 20);                                           // 방풍벽고정파이프 20
  push('FM-223', 10);                                           // 측면물받이 받침 10
  push('FM-206', q.rafterCount);                               // 805
  push('FM-207', Math.ceil(spans * lengthSpans * 350 / 160));  // 1중지붕가로대 350
  push('FM-224', 20);                                           // 1중 지붕브래싱 20
  push('FM-225', Math.ceil(widthSpans * 5));                   // 1중 전후면 수직 서까래 60
  push('FM-226', 32);                                           // 1중 전후면 가로대 32
  push('FM-227', 20);                                           // 측면 수직커튼 치마 가로대 20
  push('FM-228', 8);                                            // 전후면 수직커튼 치마 가로대 8
  push('FM-229', 20);                                           // 1중 측면 개폐축 20
  if (input.enable2ndCover) push('FM-230', 20);                // 2중 측면 개폐축 20
  push('FM-231', 8);                                            // 1중 전후면 개폐축 8
  if (input.enable2ndCover) push('FM-232', 8);                 // 2중 전후면 개폐축 8
  push('FM-233', 16);                                           // 출입문파이프 16
  push('FM-234', 12);                                           // 물홈통 고정파이프 12

  // ═══ 3. 부속자재 (§3.5 24.39M) — KSM 직접 매핑 ═══
  push('FM-301', q.tClampCount);                                  // T크램프 454
  push('FM-302', 150);                                            // 십자판 150
  push('FM-320', 60);                                             // U크램프(전후면수직서까래) 60
  push('FM-303', Math.ceil(q.rafterCount * 1.2));                 // 1중 쌍꽂이 968 (805 × 1.2)
  push('FM-321', Math.ceil(q.rafterCount * 742 / 805));           // 보강받침판 742
  push('FM-322', 98);                                             // 각관연결핀 98
  push('FM-323', 20);                                             // 연결핀 Ø32 20
  push('FM-324', 20);                                             // 연결핀 Ø25 20
  push('FM-325', Math.ceil(q.area * 2425 / 3360));                // 강판조리개 2425 (면적 비례)
  push('FM-326', Math.ceil(q.area * 5000 / 3360));                // 조리개 5000
  push('FM-327', 62);                                             // 고정구 B/N 62
  push('FM-328', 60);                                             // 고정구 Ø25 60
  push('FM-329', 240);                                            // 고정구 Ø32 240
  push('FM-330', 670);                                            // T고정구 670
  push('FM-331', 140);                                            // 새들고정구 25 140
  push('FM-332', 720);                                            // 새들고정구 32 720
  push('FM-333', 10);                                             // 고리 고정구 10
  push('FM-334', spans + 1);                                      // 1중물받이 긴 6 = 동수+1
  push('FM-335', spans + 1);                                      // 1중물받이 짧 6
  push('FM-336', spans + 1);                                      // PE물받이 6
  push('FM-337', Math.ceil(q.area * 694 / 3360));                 // 비닐패드 694
  push('FM-338', Math.ceil(q.area * 196 / 3360));                 // 물받이패드 196
  push('FM-339', Math.ceil(q.area * 2900 / 3360));                // 패드스프링 2900
  push('FM-340', Math.ceil(q.area * 660 / 3360));                 // 패드연결핀 660
  push('FM-341', Math.ceil(q.area * 21000 / 3360));               // 직결피스 21000
  push('FM-342', Math.ceil(q.area * 11000 / 3360));               // 육각피스 11000
  push('FM-343', 4);                                              // C형강 4
  push('FM-344', 16);                                             // 출입문베어링 16
  push('FM-345', 16);                                             // 출입문손잡이 16
  push('FM-346', 1);                                              // 냉각도금제 1
  push('FM-347', Math.ceil(q.area * 439 / 3360));                 // 물받이 작업비 439m

  // ═══ 4. 피복공사 (§3.5 23.35M) — KSM BOM ═══
  // 비닐 매수는 동수 / 면적 비례
  push('FM-401', 10);   // 1중지붕 10매
  push('FM-402', 5);    // 1중천창 5매
  push('FM-403', 2);    // 측면방풍벽 2매
  push('FM-404', 2); push('FM-405', 2);          // 전후면 상/하
  push('FM-406', 2); push('FM-407', 2);          // 측면치마 PE/PO
  push('FM-408', 2); push('FM-409', 2);          // 전후면치마 PE/PO
  push('FM-412', 1);                              // 바람막이
  if (input.enable2ndCover) {
    push('FM-413', 2); push('FM-414', 2); push('FM-415', 4);  // 2중 측면 세트
    push('FM-416', 2); push('FM-417', 1); push('FM-418', 4);  // 2중 전후면 세트
  }
  push('FM-419', 2); push('FM-420', 2); push('FM-421', 4);   // 부직포
  push('FM-422', 5);    // 보수 테이프
  push('FM-423', 14);   // 패드필름 2S
  push('FM-424', 1);    // 하우스밴드
  push('FM-425', 60);   // 고리고정구 48
  push('FM-426', 700); push('FM-427', 160);                  // 하우스크립 25/32
  push('FM-428', 3);    // 방충망

  // ═══ 5. 차광망 (§3.5 6.32M) ═══ — 5.차광망 시트는 하드웨어만, 수평커튼은 6시트 계상
  if (input.enableShade) {
    push('FM-511', 99);                         // 드름 99
    push('FM-512', 98);                         // 축수 베어링 98
    push('FM-513', 32);                         // 커튼지지 백관 32
    push('FM-514', 38);                         // 커튼지지 PE 38
    push('FM-515', 16);                         // 커튼모타축 16
    push('FM-516', 198);                        // U크램프 198
    push('FM-517', 1);                          // 커튼모타 1
    push('FM-519', 6);                          // 예인로프 낙하산 6 (active)
    push('FM-520', 4);                          // 받침선 폴리 4 (active)
    push('FM-522', 1);                          // 사이드와이어 1
    push('FM-523', 198); push('FM-524', 99);    // 예인로라 싱/더블
    push('FM-525', 297);                        // 로라고리 297
    push('FM-526', 990);                        // 예인크립 P/L 990
  }

  // ═══ 6. 보온커튼 (§3.5 5.54M) — 수평커튼 + 시트별 하드웨어 ═══
  if (input.enableThermal) {
    push('FM-501', Math.ceil(spans * 2));       // 수평커튼 10매 (4.22M)
    // 하드웨어: KSM 다겹보온 시트의 드름·베어링·로프 등 일식 약 1M
    // (5.차광망과 동일 품목이나 가격 ~70% 수준)
    push('FM-601', q.area / 3360);              // 하드웨어 일식 (KSM 기준 1)
  }

  // ═══ 7. 측면수직커튼 (§3.5 5.59M) ═══
  if (input.enableSideCurtain) {
    push('FM-701', 2);                          // 측면 수직커튼 2매
    push('FM-710', 2);                          // 코너 바람막이 2
    push('FM-711', 97);                         // 축수베어링 97
    push('FM-712', 32);                         // 개폐축 32
  }

  // ═══ 8. 전후면수직커튼 (§3.5 1.81M) ═══
  if (input.enableEndCurtain) {
    push('FM-801', 2);                          // 전후면 수직커튼 2매
    push('FM-810', 4);                          // 출입문 4
    push('FM-811', 12);                         // 개폐축 12
  }

  // ═══ 10. 개폐·환기 (§3.5 5.89M) ═══
  push('FM-A01', 10);                           // 1중천창 10 (실제 KSM)
  push('FM-A02', 4);                            // 1중측창 4
  push('FM-A05', 2);                            // 1중전후면 2
  if (input.enable2ndCover) {
    push('FM-A06', 10);                         // 2중측창 10
    push('FM-A07', 2);                          // 2중전후면 2
  }
  if (input.enableSideCurtain) push('FM-A08', 2);     // 측면수직커튼 2
  if (input.enableEndCurtain)  push('FM-A09', 2);     // 전후면수직커튼 2
  push('FM-A10', Math.ceil(q.area * 1700 / 3360));    // 전선 1700m
  push('FM-A11', 100); push('FM-A12', 100);
  push('FM-A13', Math.ceil(q.area * 400 / 3360));     // 케이블 타이

  // ═══ 11. 콘트롤박스 (§3.5 5.15M) — KSM BOM 직접 ═══
  push('FM-B01', 1);                            // 함
  push('FM-B10', 5); push('FM-B11', 5);         // 1중천창 좌/우 각 5
  push('FM-B12', 4);                            // 1중측창 4
  push('FM-B13', 2);                            // 1중 전후면 2
  if (input.enable2ndCover) {
    push('FM-B14', 10);                         // 2중측창 10
    push('FM-B15', 2);                          // 2중 전후면 2
  }
  if (input.enableSideCurtain) push('FM-B16', 2);  // 측면수직 2
  if (input.enableEndCurtain)  push('FM-B17', 2);  // 전후면수직 2
  push('FM-B18', 6);                            // 예비 6
  if (input.enableThermal) {
    push('FM-B19', 1);                          // 1중수평커튼 1구역
    if (input.enable2ndCover) push('FM-B20', 1); // 2중수평커튼
  }
  push('FM-B21', 1);                            // 콘센트 1
  push('FM-B22', 1);                            // 복합조절장치 1
  push('FM-B23', 1);                            // 온도 조절 1
  push('FM-B24', 4);                            // 타이머 4
  // 회로증설 = 14, 환경제어 = 44 (KSM 명시값)
  push('FM-B25', 14);
  push('FM-B26', 44);

  // ═══ 보일러 ═══
  if (input.enableBoiler && input.boilerSets > 0) {
    push('FM-E02', input.boilerSets);
    push('FM-E03', 1);
  }

  // ═══ 양액시설 (§3.4 25%) ═══
  if (input.enableIrrigation) {
    const irrigArea = input.irrigationArea ?? q.area;
    push('FM-IR01', 1);
    push('FM-IR02', 1);
    push('FM-IR03', 1);
    push('FM-IR04', Math.max(1, Math.ceil(irrigArea / 2000)));
    push('FM-IR05', 1);
    push('FM-IR06', irrigArea * 1.2, true);
    push('FM-IR07', irrigArea, true);
    push('FM-IR08', q.perimeter, true);
    push('FM-IR09', 1);
    push('FM-IR10', Math.max(1, Math.ceil(irrigArea / 3000)));
  }

  // ═══ 환경제어 (§3.4 11%) ═══
  if (input.enableEnvControl) {
    push('FM-EC01', 1);
    push('FM-EC02', 1);
    push('FM-EC03', Math.max(1, Math.ceil(q.area / 5000)));
    push('FM-EC04', 1);
    push('FM-EC05', 1);
    push('FM-EC06', input.envControlChannels);
    push('FM-EC07', q.perimeter * 2, true);
  }

  // ═══ 부자재 자동 적용 (§3.5 — 각 카테고리 재료비의 3%) ═══
  // 카테고리별 합계를 한 번 더 순회하여 3% 부자재 라인 추가
  applyMiscFee(lines, input);

  return lines;
}

// 부자재 (재료비 × 3%) — §3.5 모든 공정 시트에 공통 적용
function applyMiscFee(lines: BomLine[], input: QuoteInput): void {
  const cats: Category[] = ['foundation', 'steel', 'parts', 'cover',
    'shade', 'thermal', 'side_curtain', 'end_curtain', 'vent', 'control'];
  const miscIdMap: Record<string, [string, string]> = {
    foundation:   ['FM-101', '기초 부자재'],
    steel:        ['FM-201', '철골 부자재'],
    parts:        ['FM-301', '부속 부자재'],
    cover:        ['FM-401', '피복 부자재'],
    shade:        ['FM-501', '차광 부자재'],
    thermal:      ['FM-601', '보온 부자재'],
    side_curtain: ['FM-701', '측면커튼 부자재'],
    end_curtain:  ['FM-801', '전후면커튼 부자재'],
    vent:         ['FM-A01', '개폐 부자재'],
    control:      ['FM-B01', '콘트롤 부자재'],
  };
  for (const cat of cats) {
    const matSum = lines.filter(l => l.category === cat).reduce((s, l) => s + l.materialCost, 0);
    if (matSum <= 0) continue;
    const misc = matSum * 0.03;
    const [refId, name] = miscIdMap[cat];
    lines.push({
      itemId: refId + '-MISC', category: cat, name,
      spec: '재료비 × 3%', unit: '식', quantity: 1,
      unitPrice: misc, materialCost: misc, laborCost: 0, total: misc,
    });
  }
}

// ── 분류별 소계 ───────────────────────────────────────────
const CONSTRUCTION_CATS: Category[] = [
  'foundation', 'steel', 'parts', 'cover', 'shade', 'thermal',
  'side_curtain', 'end_curtain', 'vent', 'control',
];

export function rollupCategories(bom: BomLine[]): CategorySubtotal[] {
  const map = new Map<Category, CategorySubtotal>();
  for (const line of bom) {
    const cur = map.get(line.category) ?? {
      category: line.category,
      material: 0, labor: 0, expense: 0, subtotal: 0,
    };
    cur.material += line.materialCost;
    cur.labor    += line.laborCost;
    cur.subtotal += line.total;
    map.set(line.category, cur);
  }
  return Array.from(map.values());
}

// ── §3.6 원가 계산서 파이프라인 (BOM 부분집합에 대해) ──────────
export function computeCostBreakdown(
  bom: BomLine[],
  input: QuoteInput,
  area = 0,
): CostBreakdown {
  // 기본: 하우스 공사 카테고리만 (하위 호환)
  return computeCostFor(bom.filter(l => CONSTRUCTION_CATS.includes(l.category)), input, area);
}

// 면적당 노무비 (강석문 §3.5) — 골조·피복·차광·보온·커튼·개폐 공사비 (각 ㎡당)
const LABOR_PER_M2: Partial<Record<Category, number>> = {
  parts:        9000,  // 골조공사비 9,000/㎡ → KSM 30.24M ✓
  cover:        2000,  // 피복공사비
  shade:        1500,  // 커튼 공사비 (5/6 시트)
  thermal:      1500,
  side_curtain: 500,
  end_curtain:  100,
  vent:         1000,  // 개폐공사비
};

function computeCostFor(
  lines: BomLine[],
  input: QuoteInput,
  area: number = 0,
): CostBreakdown {
  const materialDirect = lines.reduce((s, l) => s + l.materialCost, 0);
  // 노무비 = (자재 단가 × laborRate) + (면적당 추가 노무비) 두 가지 모두 가산
  let laborDirect = lines.reduce((s, l) => s + l.laborCost, 0);
  if (area > 0) {
    const catSet = new Set(lines.map(l => l.category));
    for (const [cat, perM2] of Object.entries(LABOR_PER_M2)) {
      if (catSet.has(cat as Category)) {
        laborDirect += area * (perM2 ?? 0);
      }
    }
  }

  // §3.6 공식
  const indirectLabor       = laborDirect * 0.03;
  const totalLabor          = laborDirect + indirectLabor;
  const workersInsurance    = totalLabor * 0.037;
  const employmentInsurance = totalLabor * 0.0101;
  const otherExpense        = (materialDirect + totalLabor) * 0.03;
  const expenseDirect       = workersInsurance + employmentInsurance + otherExpense;

  const directTotal = materialDirect + totalLabor + expenseDirect;
  const pureConstruction = directTotal;

  const generalAdmin = pureConstruction * input.generalAdminRate;
  const profit = (totalLabor + expenseDirect + generalAdmin) * input.profitRate;
  const supplyAmount = pureConstruction + generalAdmin + profit;
  const vat = supplyAmount * input.vatRate;
  const grandTotal = supplyAmount + vat;

  return {
    materialDirect, laborDirect, expenseDirect, directTotal,
    indirectLabor, workersInsurance, employmentInsurance, otherExpense,
    pureConstruction, generalAdmin, profit,
    supplyAmount, vat, grandTotal,
  };
}

// ── 시설 그룹별 견적 ──────────────────────────────────────
function computeGroups(bom: BomLine[], input: QuoteInput, area: number): GroupQuote[] {
  const groups: FacilityGroup[] = ['house', 'irrigation', 'env_control'];
  const result: GroupQuote[] = [];
  for (const group of groups) {
    const groupLines = bom.filter(l => CATEGORY_TO_GROUP[l.category] === group);
    if (groupLines.length === 0) continue;
    // 면적당 노무비는 'house' 그룹에만 적용
    const a = group === 'house' ? area : 0;
    result.push({
      group,
      categories: rollupCategories(groupLines),
      cost: computeCostFor(groupLines, input, a),
    });
  }
  return result;
}

// ── 보일러·부대비용 (마진 적용 / 미적용 구분) ─────────────────
function computeExtras(bom: BomLine[], input: QuoteInput): {
  boiler: number; supervisor: number; container: number; margin: number;
} {
  const boiler = bom
    .filter(l => l.category === 'boiler')
    .reduce((s, l) => s + l.total, 0);
  const supervisor = input.superVisorMonths > 0
    ? toCurrency(45_000_000, input.currency, input) * input.superVisorMonths
    : 0;
  const container = input.containerCount > 0
    ? toCurrency(13_000_000, input.currency, input) * input.containerCount
    : 0;
  return { boiler, supervisor, container, margin: 0 };
}

// ── 메인 진입점 ───────────────────────────────────────────
export function calcQuote(input: QuoteInput): Quote {
  const quantities = computeQuantities(input);
  const bom = buildBom(quantities, input);

  // 하위 호환: 하우스 단일 뷰
  const categories = rollupCategories(bom.filter(l => CONSTRUCTION_CATS.includes(l.category)));
  const cost = computeCostBreakdown(bom, input, quantities.area);

  // 신규 §3.4: 3대 분류 (house / irrigation / env_control)
  const groups = computeGroups(bom, input, quantities.area);
  const facilitiesTotal = groups.reduce((s, g) => s + g.cost.grandTotal, 0);

  // 마진 적용 대상: 전체 시설 + 보일러 — 그 뒤 슈퍼바이저·컨테이너 추가
  const extras = computeExtras(bom, input);
  const marginBase = facilitiesTotal + extras.boiler;
  const marginAmount = marginBase * input.marginRate;
  extras.margin = marginAmount;

  const finalInCurrency = marginBase + marginAmount + extras.supervisor + extras.container;

  // 항상 KRW 환산 별도 저장
  const krwUnit = input.currency === 'KRW'
    ? 1
    : input.currency === 'USD' ? input.fxKrwPerUsd : input.fxKrwPerUzs;
  const finalKrw = finalInCurrency * krwUnit;

  return {
    input, quantities, bom, categories, cost, groups, extras, facilitiesTotal,
    finalKrw, finalDisplay: finalInCurrency, displayCurrency: input.currency,
  };
}

// ── 통화 포맷 헬퍼 ─────────────────────────────────────────
export function formatCurrency(value: number, currency: Currency): string {
  if (currency === 'KRW') {
    return Math.round(value).toLocaleString('ko-KR') + ' 원';
  }
  if (currency === 'USD') {
    return '$ ' + value.toLocaleString('en-US', {
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    });
  }
  return Math.round(value).toLocaleString('en-US') + ' UZS';
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('ko-KR', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  });
}

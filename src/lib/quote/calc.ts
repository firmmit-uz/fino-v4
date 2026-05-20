// FIRMMIT 온실견적 계산 엔진
// 출처: HANDOFF_TO_CLAUDE_CODE.md §3.6 (원가공식), §3.7 (수량공식)

import type {
  QuoteInput, Quantities, BomLine, CategorySubtotal, CostBreakdown,
  Quote, MaterialItem, Currency, Category, FacilityGroup, GroupQuote,
} from './types.js';
import { CATEGORY_TO_GROUP } from './types.js';
import { getMaterial } from './materials.js';

// ── §3.7 자재 수량 산출 ────────────────────────────────────
// 검증 anchor (§5.2, 35×96, 동폭7, 측고4, pitch3):
//   기둥 222본, 셋기둥 128본, 중방 185본, T크램프 454개
export function computeQuantities(input: QuoteInput): Quantities {
  const area = input.width * input.length;
  const pyeong = area / 3.3058;
  const spanCount = Math.floor(input.width / input.spanWidth);
  const columnRows = spanCount + 1;
  const columnsPerRow = Math.ceil(input.length / input.columnPitch) + 1;

  // 전후면(gable) 기둥 — 폭 방향 = ROUND(width/pitch)
  // §5.2 검증: 35/3 ≈ 11.67 → 12, ×2면 = 24 → 222 - 6×33 = 24 ✓
  const endFacePosts = 2 * Math.round(input.width / input.columnPitch);

  // 기둥 총수 (FM-201 BOM 수량) — §5.2 222본
  //   = 기둥줄 × 기둥칸 + 전후면 기둥
  //   = 6 × 33 + 24 = 222 ✓
  const mainColumnsTotal = columnRows * columnsPerRow + endFacePosts;

  // 셋기둥수: (동수-1) × (기둥칸-1) → 강석문 § "4 × 32 = 128"
  const innerColumns = Math.max(0, (spanCount - 1) * (columnsPerRow - 1));

  // 중방 (FM-203) — §5.2 185본
  //   = 동수 × (기둥칸 + 4 보강) = 5 × 37 = 185 ✓
  //   보강 4 = 동당 코너·이음판 4개 (가설; .xlsm 원본 검증 대기)
  const midRailCount = spanCount * (columnsPerRow + 4);

  // 서까래 길이: 측고 + (동폭/2) × (1 + R), 0.1m 단위 올림
  const rafterLengthRaw = input.height + (input.spanWidth / 2) * (1 + input.rValue);
  const rafterLength = Math.ceil(rafterLengthRaw * 10) / 10;

  // 서까래 개수: 60cm 간격 × 동수
  const raftersPerSpan = Math.ceil(input.length / 0.6) + 1;
  const rafterCount = raftersPerSpan * spanCount;

  // T크램프: 면적 × 0.135
  const tClampCount = Math.ceil(area * 0.135);

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

// ── BOM 빌드 ─────────────────────────────────────────────
export function buildBom(q: Quantities, input: QuoteInput): BomLine[] {
  const lines: BomLine[] = [];

  const push = (itemId: string, quantity: number): void => {
    if (quantity <= 0) return;
    const m: MaterialItem = getMaterial(itemId);
    const unitPrice = toCurrency(m.priceKrw, input.currency, input);
    const materialCost = unitPrice * quantity;
    const laborCost = materialCost * (m.laborRate ?? 0);
    lines.push({
      itemId, category: m.category,
      name: m.name, spec: m.spec, unit: m.unit,
      quantity, unitPrice, materialCost, laborCost,
      total: materialCost + laborCost,
    });
  };

  // 기초공사 — 기둥 위치마다 독립기초 (주기둥 + 셋기둥)
  const totalColumnPositions = q.mainColumnsTotal + q.innerColumns;
  push('FM-101', totalColumnPositions);

  // 철골자재 — §5.2 검증값과 일치
  push('FM-201', q.mainColumnsTotal);                           // 주기둥 (전후면 포함, §5.2 222)
  push('FM-202', q.innerColumns);                               // 셋기둥 (§5.2 128)
  push('FM-203', q.midRailCount);                               // 중방 (§5.2 185)
  push('FM-204', q.columnRows * Math.max(0, q.columnsPerRow - 1));  // 보 (길이방향)
  push('FM-205', Math.ceil(q.perimeter / 5));                   // 방풍벽
  push('FM-206', q.rafterCount);                                // 1중 서까래
  push('FM-207', Math.ceil((q.area * (1 + input.rValue)) / 30));// 지붕가로대

  // 부속자재
  push('FM-301', q.tClampCount);                                // T크램프
  push('FM-302', q.mainColumnsTotal);                           // 십자판 (= 주기둥수)
  push('FM-303', q.rafterCount);                                // 1중 쌍꽂이

  // 피복공사 — 곡면 면적 = 면적 × (1 + R값)
  const coverArea = q.area * (1 + input.rValue);
  push('FM-401', coverArea);
  if (input.enable2ndCover) push('FM-402', coverArea);

  // 차광·보온
  if (input.enableShade)   push('FM-501', q.area);
  if (input.enableThermal) push('FM-601', q.area);

  // 측면·전후면 수직커튼 — 둘레/단부 × 측고
  if (input.enableSideCurtain) {
    const sideArea = input.length * input.height * 2;
    push('FM-701', sideArea);
  }
  if (input.enableEndCurtain) {
    const endArea = input.width * input.height * 2;
    push('FM-801', endArea);
  }

  // 개폐·환기 — 천창 동수 × 1, 측창 4
  push('FM-A01', q.spanCount);  // 천창 (동당 1)
  push('FM-A02', 4);             // 측창 (양측 + 전후)

  // 콘트롤박스
  push('FM-B01', 1);

  // 보일러
  if (input.enableBoiler && input.boilerSets > 0) {
    push('FM-E02', input.boilerSets);
    push('FM-E03', 1);
  }

  // 양액시설 (§3.4 25%)
  if (input.enableIrrigation) {
    const irrigArea = input.irrigationArea ?? q.area;
    push('FM-IR01', 1);                              // 원수탱크
    push('FM-IR02', 1);                              // A탱크
    push('FM-IR03', 1);                              // B탱크
    push('FM-IR04', Math.max(1, Math.ceil(irrigArea / 2000))); // 펌프 (2000㎡당)
    push('FM-IR05', 1);                              // 컨트롤러
    push('FM-IR06', Math.ceil(irrigArea * 1.2));     // 점적호스 (㎡당 1.2m)
    push('FM-IR07', irrigArea);                      // 베드 (= 면적)
    push('FM-IR08', q.perimeter);                    // 회수배관 (둘레)
    push('FM-IR09', 1);                              // 주배관 일식
    push('FM-IR10', Math.max(1, Math.ceil(irrigArea / 3000))); // 여과기
  }

  // 환경제어시설 (§3.4 11%)
  if (input.enableEnvControl) {
    push('FM-EC01', 1);                              // 컨트롤러
    push('FM-EC02', 1);                              // 센서 박스
    push('FM-EC03', Math.max(1, Math.ceil(q.area / 5000))); // 광량 센서
    push('FM-EC04', 1);                              // 풍향풍속
    push('FM-EC05', 1);                              // CO2
    push('FM-EC06', input.envControlChannels);       // 제어 채널
    push('FM-EC07', q.perimeter * 2);                // 케이블·배선
  }

  return lines;
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
): CostBreakdown {
  // 기본: 하우스 공사 카테고리만 (하위 호환)
  return computeCostFor(bom.filter(l => CONSTRUCTION_CATS.includes(l.category)), input);
}

function computeCostFor(
  lines: BomLine[],
  input: QuoteInput,
): CostBreakdown {
  const materialDirect = lines.reduce((s, l) => s + l.materialCost, 0);
  const laborDirect    = lines.reduce((s, l) => s + l.laborCost,    0);

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
function computeGroups(bom: BomLine[], input: QuoteInput): GroupQuote[] {
  const groups: FacilityGroup[] = ['house', 'irrigation', 'env_control'];
  const result: GroupQuote[] = [];
  for (const group of groups) {
    const groupLines = bom.filter(l => CATEGORY_TO_GROUP[l.category] === group);
    if (groupLines.length === 0) continue;
    result.push({
      group,
      categories: rollupCategories(groupLines),
      cost: computeCostFor(groupLines, input),
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
  const cost = computeCostBreakdown(bom, input);

  // 신규 §3.4: 3대 분류 (house / irrigation / env_control)
  const groups = computeGroups(bom, input);
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

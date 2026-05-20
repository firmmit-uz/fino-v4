// FIRMMIT 온실견적 계산 엔진
// 출처: HANDOFF_TO_CLAUDE_CODE.md §3.6 (원가공식), §3.7 (수량공식)

import type {
  QuoteInput, Quantities, BomLine, CategorySubtotal, CostBreakdown,
  Quote, MaterialItem, Currency, Category,
} from './types.js';
import { getMaterial } from './materials.js';

// ── §3.7 자재 수량 산출 ────────────────────────────────────
export function computeQuantities(input: QuoteInput): Quantities {
  const area = input.width * input.length;
  const pyeong = area / 3.3058;
  const spanCount = Math.floor(input.width / input.spanWidth);
  const columnRows = spanCount + 1;
  const columnsPerRow = Math.ceil(input.length / input.columnPitch) + 1;

  // 셋기둥수: (동수-1) × (기둥칸-1) → 강석문 § "4 × 32 = 128"
  const innerColumns = Math.max(0, (spanCount - 1) * (columnsPerRow - 1));

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
    innerColumns, rafterLength, rafterCount, tClampCount, perimeter,
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

  // 기초공사 — 기둥 위치마다 독립기초
  const totalColumnPositions = q.columnRows * q.columnsPerRow + q.innerColumns;
  push('FM-101', totalColumnPositions);

  // 철골자재
  push('FM-201', q.columnRows * q.columnsPerRow);              // 주기둥
  push('FM-202', q.innerColumns);                               // 셋기둥
  push('FM-203', q.spanCount * q.columnsPerRow);                // 중방 (방향 횡)
  push('FM-204', q.columnRows * Math.max(0, q.columnsPerRow - 1));  // 보 (길이방향)
  push('FM-205', Math.ceil(q.perimeter / 5));                   // 방풍벽
  push('FM-206', q.rafterCount);                                // 1중 서까래
  push('FM-207', Math.ceil((q.area * (1 + input.rValue)) / 30));// 지붕가로대

  // 부속자재
  push('FM-301', q.tClampCount);                                // T크램프
  push('FM-302', q.columnRows * q.columnsPerRow);               // 십자판
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

// ── §3.6 원가 계산서 파이프라인 (하우스 공사 한정) ──────────
export function computeCostBreakdown(
  bom: BomLine[],
  input: QuoteInput,
): CostBreakdown {
  // 하우스 공사만 원가 파이프라인에 진입 (보일러/슈퍼바이저/컨테이너는 별도)
  const houseBom = bom.filter(l => CONSTRUCTION_CATS.includes(l.category));

  const materialDirect = houseBom.reduce((s, l) => s + l.materialCost, 0);
  const laborDirect    = houseBom.reduce((s, l) => s + l.laborCost,    0);

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
  const categories = rollupCategories(bom);
  const cost = computeCostBreakdown(bom, input);

  // 마진 적용 대상: 하우스(공급가액) + 보일러 — 그 뒤 슈퍼바이저·컨테이너 추가
  const extras = computeExtras(bom, input);
  const marginBase = cost.grandTotal + extras.boiler;
  const marginAmount = marginBase * input.marginRate;
  extras.margin = marginAmount;

  const finalInCurrency = marginBase + marginAmount + extras.supervisor + extras.container;

  // 항상 KRW 환산 별도 저장
  const krwUnit = input.currency === 'KRW'
    ? 1
    : input.currency === 'USD' ? input.fxKrwPerUsd : input.fxKrwPerUzs;
  const finalKrw = finalInCurrency * krwUnit;

  return {
    input, quantities, bom, categories, cost, extras,
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

// 강석문 .xlsm §5.2 검증 — Expected vs Computed 비교
// 입력: 35 × 96, 동폭 7, 측고 4, pitch 3

import type { Quote, Quantities } from './types.js';
import { computeQuantities, calcQuote } from './calc.js';
import { KSM_BASELINE } from './defaults.js';

export interface VerificationRow {
  label: string;
  expected: number | string;
  computed: number | string;
  diff: number | string;
  match: boolean;
  note?: string;
}

// §5.2 명시값
export const KSM_EXPECTED = {
  area: 3360,
  pyeong: 1017,
  spanCount: 5,
  columnRows: 6,
  columnsPerRow: 33,
  innerColumns: 128,
  mainColumnsTotal: 222,    // 기둥 222본
  midRailCount: 185,        // 중방 185본
  tClampCount: 454,         // T크램프 454개
  rafterLength: 8.2,        // 강석문 카탈로그 (FM-206 8.2m, 수식과 0.1~0.2m 차이)
  steelTotal: 67_081_630,   // 철골자재 합계 (참고)
  houseConstructionSubtotal: 207_988_127,  // 하우스 순공사비
  houseFinalTotal: 256_740_000,            // 하우스 총 견적
};

function row(
  label: string,
  expected: number | string,
  computed: number | string,
  tolerance = 0.001,
  note?: string,
): VerificationRow {
  const e = typeof expected === 'number' ? expected : NaN;
  const c = typeof computed === 'number' ? computed : NaN;
  let match: boolean;
  let diff: number | string;
  if (Number.isFinite(e) && Number.isFinite(c)) {
    diff = c - e;
    match = Math.abs(diff) <= Math.max(tolerance, Math.abs(e) * tolerance);
  } else {
    diff = '—';
    match = expected === computed;
  }
  return { label, expected, computed, diff, match, note };
}

export function verifyKsmBaseline(): VerificationRow[] {
  const q: Quantities = computeQuantities(KSM_BASELINE);
  const quote: Quote = calcQuote(KSM_BASELINE);

  const rows: VerificationRow[] = [
    row('면적 (㎡)',            KSM_EXPECTED.area,             q.area, 0),
    row('평수',                 KSM_EXPECTED.pyeong,           Math.ceil(q.pyeong), 0,
        '면적/3.3058 = 1016.39 → 강석문 ROUNDUP → 1017'),
    row('동수',                 KSM_EXPECTED.spanCount,        q.spanCount, 0),
    row('기둥줄',               KSM_EXPECTED.columnRows,       q.columnRows, 0),
    row('기둥칸',               KSM_EXPECTED.columnsPerRow,    q.columnsPerRow, 0),
    row('전후면(gable) 기둥',   24,                            q.endFacePosts, 0,
        '222 − 6×33 = 24 = 2 × ROUND(35/3) (가설)'),
    row('주기둥 총수 (FM-201)', KSM_EXPECTED.mainColumnsTotal, q.mainColumnsTotal, 0,
        '6×33 + 24 = 222'),
    row('셋기둥 (FM-202)',      KSM_EXPECTED.innerColumns,     q.innerColumns, 0),
    row('중방 (FM-203)',        KSM_EXPECTED.midRailCount,     q.midRailCount, 0,
        '5 × (33+4) = 185 — 동당 보강 4 (가설)'),
    row('T크램프',              KSM_EXPECTED.tClampCount,      q.tClampCount, 0),
    row('서까래 길이 (m)',      KSM_EXPECTED.rafterLength,     q.rafterLength, 0.2,
        '강석문 카탈로그 8.2m vs 수식 4+(3.5×1.15)=8.025 → ROUNDUP 0.1=8.1'),
  ];

  // 금액 비교 — 카탈로그가 부분적이라 정확 일치 어려움 (참고용)
  const houseGroup = quote.groups.find(g => g.group === 'house');
  if (houseGroup) {
    rows.push(row(
      '하우스 순공사비 (KRW)',
      KSM_EXPECTED.houseConstructionSubtotal,
      Math.round(houseGroup.cost.pureConstruction),
      0.10,  // 카탈로그 부분 일치로 10% 오차 허용
      '카탈로그 일부 (54/227품목)·전후면/수직커튼 수식 가설 포함 → 강석문 원본 대비 근사치',
    ));
    rows.push(row(
      '하우스 총 견적 (KRW)',
      KSM_EXPECTED.houseFinalTotal,
      Math.round(houseGroup.cost.grandTotal),
      0.10,
    ));
  }

  return rows;
}

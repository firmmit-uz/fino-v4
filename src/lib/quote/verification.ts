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

// §3.5 — 하우스 11개 공정별 자재비 anchor (단위: 원)
// 카테고리 -> { material, labor, expense } (백만원 → 원)
export const KSM_CATEGORY_ANCHORS: Record<string, { mat: number; lab: number; exp: number }> = {
  foundation:   { mat:  4_730_000, lab:  4_410_000, exp: 1_300_000 },
  steel:        { mat: 67_080_000, lab:          0, exp:         0 },
  parts:        { mat: 24_390_000, lab: 30_240_000, exp:         0 },
  cover:        { mat: 23_350_000, lab:  6_720_000, exp:         0 },
  shade:        { mat:  6_320_000, lab:  5_040_000, exp:         0 },
  thermal:      { mat:  5_540_000, lab:  5_040_000, exp:         0 },
  side_curtain: { mat:  5_590_000, lab:  1_680_000, exp:         0 },
  end_curtain:  { mat:  1_810_000, lab:    340_000, exp:         0 },
  vent:         { mat:  5_890_000, lab:  3_360_000, exp:         0 },
  control:      { mat:  5_150_000, lab:          0, exp:         0 },
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
      0.15,
      '카탈로그 54+5/227품목·일부 수식 가설 포함 → 강석문 원본 대비 근사치',
    ));
    rows.push(row(
      '하우스 총 견적 (KRW)',
      KSM_EXPECTED.houseFinalTotal,
      Math.round(houseGroup.cost.grandTotal),
      0.15,
    ));
  }

  return rows;
}

// §3.5 카테고리별 자재/노무비 비교
export interface CategoryAnchorRow {
  category: string;
  label: string;
  matExpected: number;
  matComputed: number;
  matGap: number;
  matCoverage: number;   // computed / expected (0-1+)
  labExpected: number;
  labComputed: number;
}

export function verifyCategoryAnchors(): CategoryAnchorRow[] {
  const quote = calcQuote(KSM_BASELINE);
  const houseGroup = quote.groups.find(g => g.group === 'house');
  if (!houseGroup) return [];

  const result: CategoryAnchorRow[] = [];
  const labels: Record<string, string> = {
    foundation: '1. 기초공사', steel: '2. 철골자재', parts: '3. 부속자재',
    cover: '4. 피복공사', shade: '5. 차광망', thermal: '6. 보온커튼',
    side_curtain: '7. 측면수직커튼', end_curtain: '8. 전후면수직커튼',
    vent: '10. 개폐·환기', control: '11. 콘트롤박스',
  };

  for (const [cat, anchor] of Object.entries(KSM_CATEGORY_ANCHORS)) {
    const sub = houseGroup.categories.find(c => c.category === cat);
    const matComputed = sub?.material ?? 0;
    const labComputed = sub?.labor ?? 0;
    result.push({
      category: cat,
      label: labels[cat] ?? cat,
      matExpected: anchor.mat,
      matComputed: Math.round(matComputed),
      matGap: Math.round(matComputed - anchor.mat),
      matCoverage: anchor.mat > 0 ? matComputed / anchor.mat : 0,
      labExpected: anchor.lab,
      labComputed: Math.round(labComputed),
    });
  }
  return result;
}

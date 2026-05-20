// FIRMMIT 자재 카탈로그 — 강석문 .xlsm 단가 마스터의 핵심 품목 포팅
// 출처: HANDOFF_TO_CLAUDE_CODE.md §3.8
// 추후 ItemMaster.csv (227 품목 전체)로 확장 예정

import type { MaterialItem } from './types.js';

export const MATERIALS: MaterialItem[] = [
  // ── 2. 철골자재 (steel) ───────────────────────────────────
  {
    id: 'FM-201', category: 'steel',
    name: '기둥', spec: '60×60×2.3t × 5m',
    unit: '본', priceKrw: 35720,
  },
  {
    id: 'FM-202', category: 'steel',
    name: '측면셋기둥', spec: '60×60×2.3t × 4.8m',
    unit: '본', priceKrw: 34290,
  },
  {
    id: 'FM-203', category: 'steel',
    name: '중방', spec: '60×60×2.3t × 7m',
    unit: '본', priceKrw: 57710,
  },
  {
    id: 'FM-204', category: 'steel',
    name: '보', spec: '60×60×2.3t × 6m',
    unit: '본', priceKrw: 49460,
  },
  {
    id: 'FM-205', category: 'steel',
    name: '방풍벽', spec: 'Ø33.5×2.3t × 5m',
    unit: '본', priceKrw: 18120,
  },
  {
    id: 'FM-206', category: 'steel',
    name: '1중 서까래', spec: 'Ø31.8×1.7t × 8.2m',
    unit: '본', priceKrw: 17910,
  },
  {
    id: 'FM-207', category: 'steel',
    name: '1중 지붕가로대', spec: 'Ø25.4×1.5t × 10m',
    unit: '본', priceKrw: 16200,
  },

  // ── 3. 부속자재 (parts) ──────────────────────────────────
  {
    id: 'FM-301', category: 'parts',
    name: 'T크램프', spec: '60×60',
    unit: '조', priceKrw: 2489,
    laborRate: 0.5,
  },
  {
    id: 'FM-302', category: 'parts',
    name: '십자판', spec: '60×60',
    unit: '조', priceKrw: 3273,
    laborRate: 0.5,
  },
  {
    id: 'FM-303', category: 'parts',
    name: '1중 쌍꽂이', spec: '60×32',
    unit: '개', priceKrw: 3645,
    laborRate: 0.4,
  },

  // ── 1. 기초공사 (foundation) — 면적당 일괄 ─────────────────
  {
    id: 'FM-101', category: 'foundation',
    name: '기초콘크리트', spec: '독립기초 (기둥당)',
    unit: '개소', priceKrw: 12000,
    laborRate: 0.93,
  },

  // ── 4. 피복공사 (cover) ─────────────────────────────────
  {
    id: 'FM-401', category: 'cover',
    name: '1중 PO 비닐', spec: '0.12mm × 폭6m',
    unit: '㎡', priceKrw: 1400,
    laborRate: 0.29,
  },
  {
    id: 'FM-402', category: 'cover',
    name: '2중 PE 비닐', spec: '0.10mm × 폭6m',
    unit: '㎡', priceKrw: 950,
    laborRate: 0.29,
  },

  // ── 5. 차광망 (shade) ─────────────────────────────────
  {
    id: 'FM-501', category: 'shade',
    name: '차광망 60%', spec: '4.5m × 96m',
    unit: '㎡', priceKrw: 1430,
    laborRate: 0.80,
  },

  // ── 6. 보온커튼 (thermal) ────────────────────────────────
  {
    id: 'FM-601', category: 'thermal',
    name: '보온커튼', spec: '알루미늄 4겹',
    unit: '㎡', priceKrw: 1530,
    laborRate: 0.91,
  },

  // ── 7. 측면수직커튼 ─────────────────────────────────────
  {
    id: 'FM-701', category: 'side_curtain',
    name: '측면 수직커튼', spec: '보온 4겹',
    unit: '㎡', priceKrw: 1450,
    laborRate: 0.30,
  },

  // ── 8. 전후면수직커튼 ───────────────────────────────────
  {
    id: 'FM-801', category: 'end_curtain',
    name: '전후면 수직커튼', spec: '보온 4겹',
    unit: '㎡', priceKrw: 1450,
    laborRate: 0.19,
  },

  // ── 10. 개폐·환기 (vent) ─────────────────────────────────
  {
    id: 'FM-A01', category: 'vent',
    name: '롤업 개폐기', spec: '1중 천창',
    unit: '대', priceKrw: 285000,
    laborRate: 0.57,
  },
  {
    id: 'FM-A02', category: 'vent',
    name: '롤업 개폐기', spec: '측창',
    unit: '대', priceKrw: 285000,
    laborRate: 0.57,
  },

  // ── 11. 콘트롤박스 (control) ─────────────────────────────
  {
    id: 'FM-B01', category: 'control',
    name: '콘트롤박스', spec: '4채널 표준',
    unit: '식', priceKrw: 5150000,
  },

  // ── FIRMMIT 추가 — 보일러 ───────────────────────────────
  {
    id: 'FM-E02', category: 'boiler',
    name: '가스 보일러', spec: '180만 kcal / 세트',
    unit: '세트', priceKrw: 95000000,
  },
  {
    id: 'FM-E03', category: 'boiler',
    name: '보일러 부속자재', spec: '배관·연결구',
    unit: '식', priceKrw: 15000000,
  },

  // ── FIRMMIT 추가 — 운송·인건비 (견적 외, 옵션) ──────────────
  {
    id: 'FM-X01', category: 'extra',
    name: '슈퍼바이저 파견', spec: '한국 1명 / 월',
    unit: '개월', priceKrw: 45000000,
  },
  {
    id: 'FM-X02', category: 'extra',
    name: '컨테이너 운송', spec: '40ft / 대',
    unit: '대', priceKrw: 13000000,
  },

  // ── 철골자재 확장 (선택적 — 두께 2.1t 옵션) ─────────────────
  {
    id: 'FM-211', category: 'steel',
    name: '기둥', spec: '60×60×2.1t × 5m',
    unit: '본', priceKrw: 32760,
  },
  {
    id: 'FM-212', category: 'steel',
    name: '측면셋기둥', spec: '60×60×2.1t × 4.8m',
    unit: '본', priceKrw: 31450,
  },
  {
    id: 'FM-213', category: 'steel',
    name: '중방', spec: '60×60×2.1t × 7m',
    unit: '본', priceKrw: 52920,
  },

  // ── 부속자재 확장 ──────────────────────────────────────
  {
    id: 'FM-310', category: 'parts',
    name: '서까래 고정구', spec: 'Ø31.8 → 60각 연결',
    unit: '개', priceKrw: 1850,
    laborRate: 0.4,
  },
  {
    id: 'FM-311', category: 'parts',
    name: '결로받이 라운드', spec: 'Ø25 × 6m',
    unit: '본', priceKrw: 8400,
    laborRate: 0.35,
  },
  {
    id: 'FM-312', category: 'parts',
    name: '비닐 패드 (롤업용)', spec: '폭 50mm × 100m',
    unit: '롤', priceKrw: 28000,
    laborRate: 0.20,
  },
  {
    id: 'FM-313', category: 'parts',
    name: '비닐 압착스프링', spec: 'Z형, 2m',
    unit: '개', priceKrw: 950,
    laborRate: 0.40,
  },

  // ── 피복 확장 ────────────────────────────────────────
  {
    id: 'FM-410', category: 'cover',
    name: '측면 PE 비닐', spec: '0.10mm × 2.5m',
    unit: '㎡', priceKrw: 900,
    laborRate: 0.25,
  },
  {
    id: 'FM-411', category: 'cover',
    name: '결로방지 PO 필름', spec: '5겹 0.15mm',
    unit: '㎡', priceKrw: 2100,
    laborRate: 0.30,
  },

  // ── 환기·개폐 확장 ─────────────────────────────────────
  {
    id: 'FM-A03', category: 'vent',
    name: '천창 개폐모터', spec: 'AC 220V, 50W',
    unit: '대', priceKrw: 420000,
    laborRate: 0.40,
  },
  {
    id: 'FM-A04', category: 'vent',
    name: '리미트 스위치', spec: '천창·측창용',
    unit: '개', priceKrw: 35000,
    laborRate: 0.30,
  },

  // ── 콘트롤 확장 ────────────────────────────────────────
  {
    id: 'FM-B02', category: 'control',
    name: '온습도 센서', spec: 'SHT30, IP65',
    unit: '개', priceKrw: 280000,
  },
  {
    id: 'FM-B03', category: 'control',
    name: '회로 증설 모듈', spec: '4채널 추가',
    unit: '식', priceKrw: 1200000,
  },
];

export const MATERIAL_BY_ID: Record<string, MaterialItem> = Object.fromEntries(
  MATERIALS.map(m => [m.id, m])
);

export function getMaterial(id: string): MaterialItem {
  const m = MATERIAL_BY_ID[id];
  if (!m) throw new Error(`Unknown material: ${id}`);
  return m;
}

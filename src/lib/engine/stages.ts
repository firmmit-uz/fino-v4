import type { Stage } from './types.js';

// Standard micro targets (µmol/L) — Sonneveld & Voogt 2009
const STD_MICRO = { Fe_umol: 15, B_umol: 20, Mn_umol: 5, Zn_umol: 3, Cu_umol: 0.5, Mo_umol: 0.5 };
const LOW_MICRO = { Fe_umol: 10, B_umol: 15, Mn_umol: 3, Zn_umol: 2, Cu_umol: 0.3, Mo_umol: 0.3 };

// ── 본격재배 (Main Crop) — S1~S4 ─────────────────────────────
// Source: FIRMMIT v2.14 calc engine, validated against RDA 2018 Korea strawberry standard
// Note: S3·S4 share most values; NH4 decreases gradually (0.4 → 0.3) per fruit-load protocol
// Note: H2PO4 1.25 from S2 onward reflects increased P demand at fruit initiation
export const STAGES_MAIN: Stage[] = [
  {
    id: 'S1', label: 'stage.main.s1', mode: 'main',
    ecMin: 0.8, ecMax: 1.0,
    // v2.14: early growth — higher NH4 (0.7) encourages vegetative establishment
    target: { NO3: 11.5, NH4: 0.7, K: 4.0, Ca: 3.5, Mg: 1.0, H2PO4: 1.0, SO4: 1.0, ...STD_MICRO },
  },
  {
    id: 'S2', label: 'stage.main.s2', mode: 'main',
    ecMin: 1.0, ecMax: 1.2,
    // v2.14: flowering — H2PO4 raised to 1.25 for flower/fruit initiation
    target: { NO3: 11.5, NH4: 0.5, K: 5.5, Ca: 4.0, Mg: 1.5, H2PO4: 1.25, SO4: 1.5, ...STD_MICRO },
  },
  {
    id: 'S3', label: 'stage.main.s3', mode: 'main',
    ecMin: 1.2, ecMax: 1.4,
    // v2.14: fruit set — NH4 0.4 (reduced to limit vegetative growth during fruiting)
    target: { NO3: 12.0, NH4: 0.4, K: 6.0, Ca: 4.0, Mg: 1.5, H2PO4: 1.25, SO4: 1.5, ...STD_MICRO },
  },
  {
    id: 'S4', label: 'stage.main.s4', mode: 'main',
    ecMin: 1.3, ecMax: 1.6,
    // v2.14: harvest — NH4 0.3 (minimum; quality-driven sugar accumulation)
    target: { NO3: 12.0, NH4: 0.3, K: 6.0, Ca: 4.0, Mg: 1.5, H2PO4: 1.25, SO4: 1.5, ...STD_MICRO },
  },
];

// ── 육묘장 (Nursery) v4.3 — NPK→PK 4-stage 매트릭스 ────────────
// Source: build_v43.py — 김대영 2013 (자묘 +71%), Bradford 1986 (N 차단), Bot 1983 (측고 4m)
export const STAGES_NURSERY: Stage[] = [
  {
    id: 'S1', label: 'stage.nursery.s1', mode: 'nursery',
    ecMin: 0.7, ecMax: 0.9, dates: '6/1~6/21', days: '21',
    // v4.3: NPK 활착+초기 — Mg 길항 보정 위해 Mg 1.5
    target: { NO3: 8.0, NH4: 0.5, K: 4.0, Ca: 3.0, Mg: 1.5, H2PO4: 1.0, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S2', label: 'stage.nursery.s2', mode: 'nursery',
    ecMin: 0.8, ecMax: 1.0, dates: '6/22~7/22', days: '31',
    // v4.3: NPK 모주+러너
    target: { NO3: 9.0, NH4: 0.6, K: 4.5, Ca: 3.0, Mg: 1.5, H2PO4: 1.0, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S3', label: 'stage.nursery.s3', mode: 'nursery',
    ecMin: 0.8, ecMax: 1.0, dates: '7/23~8/14', days: '23',
    // v4.3: PK 자묘+화아분화 — N 55% 감량, P 1.5로 상승 (김대영 2013)
    target: { NO3: 4.0, NH4: 0.3, K: 5.0, Ca: 3.0, Mg: 1.5, H2PO4: 1.5, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S4', label: 'stage.nursery.s4', mode: 'nursery',
    ecMin: 0.7, ecMax: 0.9, dates: '8/15~8/30', days: '16',
    // v4.3: PK 경화+출하 — N 67% 감량, P 1.2 (Bradford 1986)
    target: { NO3: 3.0, NH4: 0.2, K: 4.5, Ca: 3.0, Mg: 1.5, H2PO4: 1.2, SO4: 1.2, ...STD_MICRO },
  },
];

export const ALL_STAGES = [...STAGES_MAIN, ...STAGES_NURSERY];

export function findStage(mode: 'main' | 'nursery', id: string): Stage | undefined {
  const list = mode === 'main' ? STAGES_MAIN : STAGES_NURSERY;
  return list.find(s => s.id === id);
}

import type { Stage } from './types.js';

// Standard micro targets (µmol/L) — Sonneveld & Voogt 2009
const STD_MICRO = { Fe_umol: 15, B_umol: 20, Mn_umol: 5, Zn_umol: 3, Cu_umol: 0.5, Mo_umol: 0.5 };

// ── 본격재배 (Main Crop) — S1~S4 ─────────────────────────────
// Source: FIRMMIT v2.14 calc engine, validated against RDA 2018 Korea strawberry standard
export const STAGES_MAIN: Stage[] = [
  {
    id: 'S1', label: 'stage.main.s1', mode: 'main',
    ecMin: 0.8, ecMax: 1.0,
    // v2.14: early growth — NH4 0.7 encourages vegetative establishment
    target: { NO3: 11.5, NH4: 0.7, K: 4.0, Ca: 3.5, Mg: 1.0, H2PO4: 1.0, SO4: 1.0, ...STD_MICRO },
  },
  {
    id: 'S2', label: 'stage.main.s2', mode: 'main',
    ecMin: 1.0, ecMax: 1.2,
    // v2.14: flowering — H2PO4 1.25 for flower/fruit initiation
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

// ── 육묘장 노지 (Field Nursery) — v4.3 NPK→PK 4-stage ────────
// Source: build_v43.py — 김대영 2013 (+71% runner yield), Bradford 1986 (N block), Bot 1983
export const STAGES_NURSERY_FIELD: Stage[] = [
  {
    id: 'S1', label: 'stage.nursery.s1', mode: 'nursery_field',
    ecMin: 0.7, ecMax: 0.9, dates: '6/1~6/21', days: '21',
    // v4.3: NPK 활착+초기 — Mg 1.5 for antagonism correction
    target: { NO3: 8.0, NH4: 0.5, K: 4.0, Ca: 3.0, Mg: 1.5, H2PO4: 1.0, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S2', label: 'stage.nursery.s2', mode: 'nursery_field',
    ecMin: 0.8, ecMax: 1.0, dates: '6/22~7/22', days: '31',
    // v4.3: NPK 모주+러너
    target: { NO3: 9.0, NH4: 0.6, K: 4.5, Ca: 3.0, Mg: 1.5, H2PO4: 1.0, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S3', label: 'stage.nursery.s3', mode: 'nursery_field',
    ecMin: 0.8, ecMax: 1.0, dates: '7/23~8/14', days: '23',
    // v4.3: PK 자묘+화아분화 — N 55% reduction, P 1.5 raise (김대영 2013); Ca 3.5 per G1 safety
    target: { NO3: 4.0, NH4: 0.3, K: 5.0, Ca: 3.5, Mg: 1.5, H2PO4: 1.5, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S4', label: 'stage.nursery.s4', mode: 'nursery_field',
    ecMin: 0.7, ecMax: 0.9, dates: '8/15~8/30', days: '16',
    // v4.3: PK 경화+출하 — N 67% reduction (Bradford 1986)
    target: { NO3: 3.0, NH4: 0.2, K: 4.5, Ca: 3.0, Mg: 1.5, H2PO4: 1.2, SO4: 1.2, ...STD_MICRO },
  },
];

// ── 육묘장 실내 (Indoor Nursery) — v4.3 저광량 보정 ───────────
// Indoor (greenhouse) corrections vs field:
//   EC −0.1 (low light → reduce osmotic stress)
//   Ca +0.3 (low light → compensate Ca deficiency, Bot 1983)
//   NH4 −0.1 (indoor low temp → prevent NH4 toxicity)
//   dates same as field (parallel operation)
export const STAGES_NURSERY_INDOOR: Stage[] = [
  {
    id: 'S1', label: 'stage.nursery.s1', mode: 'nursery_indoor',
    ecMin: 0.6, ecMax: 0.8, dates: '6/1~6/21', days: '21',
    target: { NO3: 8.0, NH4: 0.4, K: 4.0, Ca: 3.3, Mg: 1.5, H2PO4: 1.0, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S2', label: 'stage.nursery.s2', mode: 'nursery_indoor',
    ecMin: 0.7, ecMax: 0.9, dates: '6/22~7/22', days: '31',
    target: { NO3: 9.0, NH4: 0.5, K: 4.5, Ca: 3.3, Mg: 1.5, H2PO4: 1.0, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S3', label: 'stage.nursery.s3', mode: 'nursery_indoor',
    ecMin: 0.7, ecMax: 0.9, dates: '7/23~8/14', days: '23',
    // Ca 3.8 (3.5 + 0.3 indoor correction); NH4 0.2 (0.3 − 0.1)
    target: { NO3: 4.0, NH4: 0.2, K: 5.0, Ca: 3.8, Mg: 1.5, H2PO4: 1.5, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S4', label: 'stage.nursery.s4', mode: 'nursery_indoor',
    ecMin: 0.6, ecMax: 0.8, dates: '8/15~8/30', days: '16',
    // Ca 3.3 (3.0 + 0.3); NH4 0.1 (0.2 − 0.1)
    target: { NO3: 3.0, NH4: 0.1, K: 4.5, Ca: 3.3, Mg: 1.5, H2PO4: 1.2, SO4: 1.2, ...STD_MICRO },
  },
];

// Legacy alias — keeps old nursery imports working
export const STAGES_NURSERY = STAGES_NURSERY_FIELD;

export const ALL_STAGES = [...STAGES_MAIN, ...STAGES_NURSERY_FIELD, ...STAGES_NURSERY_INDOOR];

export function findStage(
  mode: 'main' | 'nursery_field' | 'nursery_indoor' | 'nursery',
  id: string,
): Stage | undefined {
  if (mode === 'main')           return STAGES_MAIN.find(s => s.id === id);
  if (mode === 'nursery_indoor') return STAGES_NURSERY_INDOOR.find(s => s.id === id);
  return STAGES_NURSERY_FIELD.find(s => s.id === id); // field or legacy 'nursery'
}

import type { Stage } from './types.js';

// Standard micro targets (µmol/L) — Sonneveld & Voogt 2009
const STD_MICRO = { Fe_umol: 15, B_umol: 20, Mn_umol: 5, Zn_umol: 3, Cu_umol: 0.5, Mo_umol: 0.5 };
const LOW_MICRO = { Fe_umol: 10, B_umol: 15, Mn_umol: 3, Zn_umol: 2, Cu_umol: 0.3, Mo_umol: 0.3 };

// ── 본격재배 (Main Crop) — S1~S4 ─────────────────────────────
export const STAGES_MAIN: Stage[] = [
  {
    id: 'S1', label: 'stage.main.s1', mode: 'main',
    ecMin: 0.8, ecMax: 1.0,
    target: { NO3: 11.5, NH4: 0.5, K: 4.0, Ca: 3.5, Mg: 1.0, H2PO4: 1.0, SO4: 1.0, ...STD_MICRO },
  },
  {
    id: 'S2', label: 'stage.main.s2', mode: 'main',
    ecMin: 1.0, ecMax: 1.2,
    target: { NO3: 11.5, NH4: 0.5, K: 5.5, Ca: 4.0, Mg: 1.5, H2PO4: 1.0, SO4: 1.5, ...STD_MICRO },
  },
  {
    id: 'S3', label: 'stage.main.s3', mode: 'main',
    ecMin: 1.2, ecMax: 1.4,
    // S3·S4 targets are identical — RDA 2018 Korea standard (strawberry fruiting/harvest)
    target: { NO3: 12.0, NH4: 0.5, K: 6.0, Ca: 4.0, Mg: 1.5, H2PO4: 1.0, SO4: 1.5, ...STD_MICRO },
  },
  {
    id: 'S4', label: 'stage.main.s4', mode: 'main',
    ecMin: 1.3, ecMax: 1.6,
    // S3·S4 targets are identical — RDA 2018 Korea standard (strawberry fruiting/harvest)
    target: { NO3: 12.0, NH4: 0.5, K: 6.0, Ca: 4.0, Mg: 1.5, H2PO4: 1.0, SO4: 1.5, ...STD_MICRO },
  },
];

// ── 육묘장 (Nursery) — S0~S5-3 ──────────────────────────────
export const STAGES_NURSERY: Stage[] = [
  {
    id: 'S0', label: 'stage.nursery.s0', mode: 'nursery',
    ecMin: 0.4, ecMax: 0.6, dates: '6/1~6/3', days: '3일',
    target: { NO3: 4.5, NH4: 0.3, K: 1.5, Ca: 1.5, Mg: 0.5, H2PO4: 0.5, SO4: 0.5, ...LOW_MICRO },
  },
  {
    id: 'S1', label: 'stage.nursery.s1', mode: 'nursery',
    ecMin: 0.7, ecMax: 1.0, dates: '6/4~6/21', days: '18일',
    target: { NO3: 7.0, NH4: 0.5, K: 3.0, Ca: 2.0, Mg: 0.7, H2PO4: 0.8, SO4: 0.8, ...LOW_MICRO },
  },
  {
    id: 'S2', label: 'stage.nursery.s2', mode: 'nursery',
    ecMin: 1.0, ecMax: 1.3, dates: '6/22~7/15', days: '24일',
    target: { NO3: 9.0, NH4: 0.5, K: 4.0, Ca: 3.0, Mg: 1.0, H2PO4: 1.0, SO4: 1.0, ...LOW_MICRO },
  },
  {
    id: 'S3', label: 'stage.nursery.s3', mode: 'nursery',
    ecMin: 0.8, ecMax: 1.1, dates: '7/16~7/31', days: '16일',
    target: { NO3: 8.0, NH4: 0.5, K: 3.5, Ca: 2.5, Mg: 0.8, H2PO4: 0.8, SO4: 0.8, ...LOW_MICRO },
  },
  {
    id: 'S4', label: 'stage.nursery.s4', mode: 'nursery',
    ecMin: 1.2, ecMax: 1.5, dates: '8/1~8/15', days: '15일',
    target: { NO3: 10.0, NH4: 0.5, K: 5.0, Ca: 3.5, Mg: 1.2, H2PO4: 1.0, SO4: 1.2, ...STD_MICRO },
  },
  {
    id: 'S5-1', label: 'stage.nursery.s5_1', mode: 'nursery',
    ecMin: 1.4, ecMax: 1.7, dates: '8/16~8/22', days: '7일',
    // S5-1·S5-2 targets identical — gradual hardening per FIRMMIT protocol v2.14
    target: { NO3: 11.0, NH4: 0.5, K: 5.5, Ca: 3.8, Mg: 1.3, H2PO4: 1.0, SO4: 1.3, ...STD_MICRO },
  },
  {
    id: 'S5-2', label: 'stage.nursery.s5_2', mode: 'nursery',
    ecMin: 1.4, ecMax: 1.7, dates: '8/23~8/27', days: '5일',
    // S5-1·S5-2 targets identical — gradual hardening per FIRMMIT protocol v2.14
    target: { NO3: 11.0, NH4: 0.5, K: 5.5, Ca: 3.8, Mg: 1.3, H2PO4: 1.0, SO4: 1.3, ...STD_MICRO },
  },
  {
    id: 'S5-3', label: 'stage.nursery.s5_3', mode: 'nursery',
    ecMin: 1.2, ecMax: 1.5, dates: '8/28~8/31', days: '4일',
    target: { NO3: 10.5, NH4: 0.5, K: 5.0, Ca: 3.5, Mg: 1.2, H2PO4: 1.0, SO4: 1.2, ...STD_MICRO },
  },
];

export const ALL_STAGES = [...STAGES_MAIN, ...STAGES_NURSERY];

export function findStage(mode: 'main' | 'nursery', id: string): Stage | undefined {
  const list = mode === 'main' ? STAGES_MAIN : STAGES_NURSERY;
  return list.find(s => s.id === id);
}

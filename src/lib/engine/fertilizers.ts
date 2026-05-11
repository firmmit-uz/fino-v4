import type { Fertilizer, FertId } from './types.js';

// Nutrient content: mmol per gram (solids) or mmol per mL (liquids)
// Sources: Sonneveld & Voogt 2009, manufacturer specs

export const FERTILIZERS: Record<FertId, Fertilizer> = {

  // ── Ca GROUP (Tank A) ─────────────────────────────────────────
  agrogold155: {
    // CAN15.5: Ca(NO3)2·NH4NO3 blend — 18.5% Ca, 11.7% NO3-N, 3.8% NH4-N
    id: 'agrogold155', tank: 'A', isLiquid: false,
    Ca: 4.616, NO3: 8.357, NH4: 2.714,
    K: 0, Mg: 0, H2PO4: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  calcinit_yara: {
    // Ca(NO3)2·4H2O — MW 236.15 g/mol
    id: 'calcinit_yara', tank: 'A', isLiquid: false,
    Ca: 4.235, NO3: 8.470,
    NH4: 0, K: 0, Mg: 0, H2PO4: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },

  // ── N / K GROUP (Tank B) ──────────────────────────────────────
  kno3: {
    // KNO3 — MW 101.10 g/mol
    id: 'kno3', tank: 'B', isLiquid: false,
    K: 9.891, NO3: 9.891,
    NH4: 0, Ca: 0, Mg: 0, H2PO4: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  nh4no3: {
    // NH4NO3 — MW 80.04 g/mol
    id: 'nh4no3', tank: 'A', isLiquid: false,
    NH4: 12.494, NO3: 12.494,
    K: 0, Ca: 0, Mg: 0, H2PO4: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },

  // ── Mg GROUP (Tank B) ─────────────────────────────────────────
  mgso4: {
    // MgSO4·7H2O — MW 246.47 g/mol
    id: 'mgso4', tank: 'B', isLiquid: false,
    Mg: 4.057, SO4: 4.057,
    NO3: 0, NH4: 0, K: 0, Ca: 0, H2PO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  mg_no3_2: {
    // Mg(NO3)2·6H2O — MW 256.41 g/mol
    id: 'mg_no3_2', tank: 'B', isLiquid: false,
    Mg: 3.900, NO3: 7.800,
    NH4: 0, K: 0, Ca: 0, H2PO4: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },

  // ── P / K (Tank B) ───────────────────────────────────────────
  kh2po4: {
    // KH2PO4 — MW 136.09 g/mol
    id: 'kh2po4', tank: 'B', isLiquid: false,
    K: 7.348, H2PO4: 7.348,
    NO3: 0, NH4: 0, Ca: 0, Mg: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  k2so4: {
    // K2SO4 — MW 174.26 g/mol
    id: 'k2so4', tank: 'B', isLiquid: false,
    K: 11.475, SO4: 5.738,
    NO3: 0, NH4: 0, Ca: 0, Mg: 0, H2PO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },

  // ── Fe CHELATES (Tank A) ─────────────────────────────────────
  feEdta: {
    // Fe-EDTA 13% Fe
    id: 'feEdta', tank: 'A', isLiquid: false,
    Fe: 2.328,
    NO3: 0, NH4: 0, K: 0, Ca: 0, Mg: 0, H2PO4: 0, SO4: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  feDtpa: {
    // Fe-DTPA 11% Fe
    id: 'feDtpa', tank: 'A', isLiquid: false,
    Fe: 1.970,
    NO3: 0, NH4: 0, K: 0, Ca: 0, Mg: 0, H2PO4: 0, SO4: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  feEddha: {
    // Fe-EDDHA 6% Fe — stable at high pH (Lucena 2003)
    id: 'feEddha', tank: 'A', isLiquid: false,
    Fe: 1.075,
    NO3: 0, NH4: 0, K: 0, Ca: 0, Mg: 0, H2PO4: 0, SO4: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },

  // ── ACIDS (Tank C) ────────────────────────────────────────────
  hno3: {
    // HNO3 68%, density 1.39 g/mL → 14.999 mmol/mL
    id: 'hno3', tank: 'C', isLiquid: true,
    NO3: 14.999,
    NH4: 0, K: 0, Ca: 0, Mg: 0, H2PO4: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  h3po4: {
    // H3PO4 85%, density 1.685 g/mL → 14.614 mmol/mL
    id: 'h3po4', tank: 'C', isLiquid: true,
    H2PO4: 14.614, NO3: 0,
    NH4: 0, K: 0, Ca: 0, Mg: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  h3po3: {
    // H3PO3 phosphite — MW 82.00 g/mol, solid
    id: 'h3po3', tank: 'B', isLiquid: false,
    H2PO4: 12.195,  // treated as phosphite P source
    NO3: 0, NH4: 0, K: 0, Ca: 0, Mg: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },

  // ── MICRONUTRIENTS (Tank B) ───────────────────────────────────
  h3bo3: {
    // H3BO3 — MW 61.83 g/mol; B = 17.48%
    id: 'h3bo3', tank: 'B', isLiquid: false,
    B: 16.173,
    NO3: 0, NH4: 0, K: 0, Ca: 0, Mg: 0, H2PO4: 0, SO4: 0, Fe: 0, Mn: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  znso4: {
    // ZnSO4·7H2O — MW 287.54 g/mol
    id: 'znso4', tank: 'B', isLiquid: false,
    Zn: 3.478, SO4: 3.478,
    NO3: 0, NH4: 0, K: 0, Ca: 0, Mg: 0, H2PO4: 0, Fe: 0, B: 0, Mn: 0, Cu: 0, Mo: 0,
  },
  mnso4: {
    // MnSO4·H2O — MW 169.01 g/mol
    id: 'mnso4', tank: 'B', isLiquid: false,
    Mn: 5.917, SO4: 5.917,
    NO3: 0, NH4: 0, K: 0, Ca: 0, Mg: 0, H2PO4: 0, Fe: 0, B: 0, Zn: 0, Cu: 0, Mo: 0,
  },
  cuso4: {
    // CuSO4·5H2O — MW 249.69 g/mol
    id: 'cuso4', tank: 'B', isLiquid: false,
    Cu: 4.005, SO4: 4.005,
    NO3: 0, NH4: 0, K: 0, Ca: 0, Mg: 0, H2PO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Mo: 0,
  },
  na2moo4: {
    // Na2MoO4·2H2O — MW 241.95 g/mol
    id: 'na2moo4', tank: 'B', isLiquid: false,
    Mo: 4.133,
    NO3: 0, NH4: 0, K: 0, Ca: 0, Mg: 0, H2PO4: 0, SO4: 0, Fe: 0, B: 0, Mn: 0, Zn: 0, Cu: 0,
  },
};

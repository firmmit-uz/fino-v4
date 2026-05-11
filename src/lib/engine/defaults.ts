import type { RawWater, CalcOptions } from './types.js';

// Tashkent raw water — AKIS 28-sample average (Mar–May 2026)
export const DEFAULT_RAW: RawWater = {
  pH: 7.6,
  EC: 0.83,
  NO3: 0.5,
  NH4: 0.0,
  K: 0.2,
  Ca: 2.0,
  Mg: 0.5,
  H2PO4: 0.0,
  SO4: 1.1,
  HCO3: 3.3,
  Na: 0.9,
  Cl: 0.5,
};

// Default options — optimized for Tashkent pH 7.6
export const DEFAULT_OPTS: CalcOptions = {
  calcinit: 'agrogold155',
  feSource: 'feEddha',      // pH 7.6 stable (Lucena 2003)
  mgSource: 'mgso4',
  residualHCO3: 0.5,        // mmol/L residual after neutralization
  tankVol: 600,              // L concentrate
  dilution: 100,             // 100x dilution = 1:100
  addPhosphite: false,
  available: {
    agrogold155: true,
    calcinit_yara: true,
    feEddha: true,
    feDtpa: true,
    feEdta: true,
  },
};

// EC_F coefficients — Sonneveld 2009, Table 5.7 (v2.5 correction)
export const EC_F: Record<string, number> = {
  K: 0.072,
  Ca: 0.120,
  Mg: 0.106,
  NH4: 0.073,
  NO3: 0.071,
  H2PO4: 0.036,
  SO4: 0.107,
  Na: 0.052,
  Cl: 0.076,
};

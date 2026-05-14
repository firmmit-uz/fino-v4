// FINO v4 — Hydroponic nutrient solution types

export interface RawWater {
  pH: number;
  EC: number;      // mS/cm
  NO3: number;     // mmol/L
  NH4: number;
  K: number;
  Ca: number;
  Mg: number;
  H2PO4: number;
  SO4: number;
  HCO3: number;
  Na: number;
  Cl: number;
}

export interface TargetIons {
  NO3: number;
  NH4: number;
  K: number;
  Ca: number;
  Mg: number;
  H2PO4: number;
  SO4: number;
  // Micros in µmol/L
  Fe_umol: number;
  B_umol: number;
  Mn_umol: number;
  Zn_umol: number;
  Cu_umol: number;
  Mo_umol: number;
}

export interface Stage {
  id: string;
  label: string;       // translation key
  ecMin: number;
  ecMax: number;
  target: TargetIons;
  dates?: string;
  days?: string;
  mode: 'main' | 'nursery_field' | 'nursery_indoor';
}

export type CalcinitSource = 'agrogold155' | 'calcinit_yara';
export type FeSource = 'feEddha' | 'feDtpa' | 'feEdta';
export type MgSource = 'mgso4' | 'mg_no3_2';

export interface CalcOptions {
  calcinit: CalcinitSource;
  feSource: FeSource;
  mgSource: MgSource;
  residualHCO3: number;   // mmol/L target residual bicarbonate
  tankVol: number;         // L
  dilution: number;        // concentrate ratio (e.g. 100 for 100x)
  addPhosphite: boolean;   // optional H3PO3
  available: Partial<Record<string, boolean>>; // fertilizer availability flags
}

export type FertId =
  | 'agrogold155' | 'calcinit_yara'
  | 'kno3' | 'nh4no3'
  | 'mgso4' | 'mg_no3_2'
  | 'kh2po4' | 'k2so4'
  | 'feEdta' | 'feDtpa' | 'feEddha'
  | 'hno3' | 'h3po4' | 'h3po3'
  | 'h3bo3' | 'znso4' | 'mnso4' | 'cuso4' | 'na2moo4';

export interface Fertilizer {
  id: FertId;
  tank: 'A' | 'B' | 'C';
  isLiquid: boolean;
  unit: 'kg' | 'mL';   // output unit for display
  formula: string;       // chemical formula for display (e.g. "KNO₃")
  // mmol per gram (solids) or mmol per mL (liquids)
  NO3: number;
  NH4: number;
  K: number;
  Ca: number;
  Mg: number;
  H2PO4: number;
  SO4: number;
  Fe: number;
  B: number;
  Mn: number;
  Zn: number;
  Cu: number;
  Mo: number;
}

// FertAmounts: stores kg for solids, mL for liquids (see Fertilizer.unit)
export type FertAmounts = Partial<Record<FertId, number>>;

// TankItem: enriched fert row for display
export interface TankItem {
  id: FertId;
  amount: number;
  unit: 'kg' | 'mL';
  formula: string;
}

export interface PrescriptionResult {
  ferts: FertAmounts;
  ions: RawWater;        // final ion concentrations (mmol/L)
  ec: number;            // estimated EC (mS/cm)
  warnings: Warning[];
}

export interface Warning {
  level: 'P0' | 'P1' | 'P2' | 'P3';
  code: string;
  params?: Record<string, string>; // i18n interpolation params
}

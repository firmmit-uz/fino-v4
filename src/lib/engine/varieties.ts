// FIRMMIT v4.3 — Strawberry variety definitions
// K/Ca safety thresholds per G1 Decision 2026-05-D-18
// RDA-registered Korean commercial varieties (국립원예특작과학원 품종목록)

export interface Variety {
  id: string;
  labelKey: string;        // i18n key under variety.*
  kcaSafe: number;         // max K/Ca ratio before warning
  kMod: number;            // K multiplier vs base
  caMod: number;           // Ca multiplier vs base
  no3Mod: number;          // NO3 multiplier
}

export const VARIETIES: Variety[] = [
  { id: 'seolhyang', labelKey: 'variety.seolhyang', kcaSafe: 1.65,  kMod: 1.00, caMod: 1.10, no3Mod: 1.00 },
  { id: 'maehyang',  labelKey: 'variety.maehyang',  kcaSafe: 1.655, kMod: 1.05, caMod: 1.00, no3Mod: 1.02 },
  { id: 'geumsil',   labelKey: 'variety.geumsil',   kcaSafe: 1.55,  kMod: 0.95, caMod: 1.05, no3Mod: 0.98 },
  { id: 'jukhyang',  labelKey: 'variety.jukhyang',  kcaSafe: 1.70,  kMod: 1.02, caMod: 1.00, no3Mod: 1.00 },
  { id: 'other',     labelKey: 'variety.other',     kcaSafe: 1.60,  kMod: 1.00, caMod: 1.00, no3Mod: 1.00 },
];

export const DEFAULT_VARIETY = VARIETIES[0]!; // seolhyang

export function findVariety(id: string): Variety {
  return VARIETIES.find(v => v.id === id) ?? DEFAULT_VARIETY;
}

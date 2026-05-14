// FIRMMIT v4.3 — Growing focus (재배 목적) modifier matrix

export interface Focus {
  id: string;
  labelKey: string;
  kMod: number;
  caMod: number;
  h2po4Mod: number;
  no3Mod: number;
}

export const FOCUSES: Focus[] = [
  { id: 'balanced',   labelKey: 'focus.balanced',   kMod: 1.00, caMod: 1.00, h2po4Mod: 1.00, no3Mod: 1.00 },
  { id: 'high_yield', labelKey: 'focus.high_yield', kMod: 1.10, caMod: 1.05, h2po4Mod: 1.00, no3Mod: 1.05 },
  { id: 'quality',    labelKey: 'focus.quality',    kMod: 1.05, caMod: 1.10, h2po4Mod: 1.10, no3Mod: 0.95 },
  { id: 'rooting',    labelKey: 'focus.rooting',    kMod: 0.90, caMod: 1.05, h2po4Mod: 1.20, no3Mod: 0.90 },
];

export const DEFAULT_FOCUS = FOCUSES[0]!; // balanced

export function findFocus(id: string): Focus {
  return FOCUSES.find(f => f.id === id) ?? DEFAULT_FOCUS;
}

// Winter EC correction factor (Sonneveld seasonal)
export const WINTER_FACTOR = { summer: 1.00, winter: 0.85 };
export type Season = keyof typeof WINTER_FACTOR;

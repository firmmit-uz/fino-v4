// FIRMMIT 견적 기본값 — 강석문 .xlsm 검증 시나리오 + 누쿠스 프리셋
// 출처: HANDOFF_TO_CLAUDE_CODE.md §3.3, §5.2, §5.3

import type { QuoteInput } from './types.js';

// 강석문 검증 베이스라인 (3,360㎡)
export const KSM_BASELINE: QuoteInput = {
  width: 35,
  length: 96,
  spanWidth: 7,
  height: 4,
  columnPitch: 3,
  columnThickness: 2.3,
  rValue: 0.15,

  enable2ndCover: true,
  enableShade: true,
  enableThermal: true,
  enableSideCurtain: true,
  enableEndCurtain: true,
  enableBoiler: false,
  boilerSets: 0,
  superVisorMonths: 0,
  containerCount: 0,

  marginRate: 0,
  generalAdminRate: 0.03,
  profitRate: 0.10,
  vatRate: 0.10,
  fxKrwPerUsd: 1450,
  fxKrwPerUzs: 0.114,
  currency: 'KRW',
};

// 누쿠스 2헥타르 프리셋
export const NUKUS_PRESET: QuoteInput = {
  width: 192,           // 8m × 24동
  length: 100,
  spanWidth: 8,
  height: 4,
  columnPitch: 3,
  columnThickness: 2.3,
  rValue: 0.15,         // 서까래 8 + 15% = 9.2m

  enable2ndCover: false, // 1중만
  enableShade: true,
  enableThermal: false,
  enableSideCurtain: false,
  enableEndCurtain: false,
  enableBoiler: true,
  boilerSets: 2,
  superVisorMonths: 3,
  containerCount: 12,

  marginRate: 0.30,
  generalAdminRate: 0.03,
  profitRate: 0.10,
  vatRate: 0.12,        // 우즈벡 VAT
  fxKrwPerUsd: 1450,
  fxKrwPerUzs: 0.114,
  currency: 'USD',
};

export const DEFAULT_INPUT: QuoteInput = KSM_BASELINE;

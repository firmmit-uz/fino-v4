import { writable, derived } from 'svelte/store';
import type { QuoteInput } from './types.js';
import { KSM_BASELINE, NUKUS_PRESET } from './defaults.js';
import { calcQuote } from './calc.js';

const STORAGE_KEY = 'firmmit_quote_input';

function loadInitial(): QuoteInput {
  if (typeof localStorage === 'undefined') return KSM_BASELINE;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return KSM_BASELINE;
  try {
    return { ...KSM_BASELINE, ...JSON.parse(raw) };
  } catch {
    return KSM_BASELINE;
  }
}

export const quoteInput = writable<QuoteInput>(loadInitial());

quoteInput.subscribe((v) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  }
});

export const quoteResult = derived(quoteInput, ($i) => calcQuote($i));

export function applyPreset(name: 'ksm' | 'nukus'): void {
  quoteInput.set(name === 'ksm' ? KSM_BASELINE : NUKUS_PRESET);
}

export function resetQuote(): void {
  quoteInput.set(KSM_BASELINE);
}

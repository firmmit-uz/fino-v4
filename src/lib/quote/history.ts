// 견적 이력 저장 — localStorage 기반
// 발행번호 FM-YYYY-NNNN, 입력값 스냅샷 + 최종 금액

import { writable } from 'svelte/store';
import type { QuoteInput } from './types.js';
import { calcQuote } from './calc.js';

const STORAGE_KEY = 'firmmit_quote_history';

export interface SavedQuote {
  id: string;            // FM-YYYY-NNNN
  createdAt: string;     // ISO 8601
  clientName: string;
  projectName: string;
  notes: string;
  input: QuoteInput;
  finalKrw: number;
  finalDisplay: number;
  displayCurrency: string;
}

function load(): SavedQuote[] {
  if (typeof localStorage === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedQuote[];
  } catch {
    return [];
  }
}

function persist(list: SavedQuote[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const history = writable<SavedQuote[]>(load());

// ── 채번 ─────────────────────────────────────────────────
export function generateQuoteNumber(list: SavedQuote[] = load()): string {
  const year = new Date().getFullYear();
  const prefix = `FM-${year}-`;
  const seqs = list
    .filter(q => q.id.startsWith(prefix))
    .map(q => parseInt(q.id.slice(prefix.length), 10))
    .filter(n => Number.isFinite(n));
  const next = (seqs.length === 0 ? 0 : Math.max(...seqs)) + 1;
  return prefix + String(next).padStart(4, '0');
}

// ── 저장 ─────────────────────────────────────────────────
export function saveQuote(
  input: QuoteInput,
  meta: { clientName: string; projectName: string; notes?: string },
): SavedQuote {
  const result = calcQuote(input);
  const list = load();
  const saved: SavedQuote = {
    id: generateQuoteNumber(list),
    createdAt: new Date().toISOString(),
    clientName: meta.clientName,
    projectName: meta.projectName,
    notes: meta.notes ?? '',
    input,
    finalKrw: result.finalKrw,
    finalDisplay: result.finalDisplay,
    displayCurrency: result.displayCurrency,
  };
  const updated = [saved, ...list];
  persist(updated);
  history.set(updated);
  return saved;
}

// ── 삭제 ─────────────────────────────────────────────────
export function deleteQuote(id: string): void {
  const list = load().filter(q => q.id !== id);
  persist(list);
  history.set(list);
}

// ── 단건 조회 ─────────────────────────────────────────────
export function getQuote(id: string): SavedQuote | undefined {
  return load().find(q => q.id === id);
}

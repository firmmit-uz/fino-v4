<script lang="ts">
  import { goto } from '$app/navigation';
  import { history, deleteQuote } from '$lib/quote/history.js';
  import { quoteInput } from '$lib/quote/store.js';
  import { formatCurrency } from '$lib/quote/calc.js';
  import type { Currency } from '$lib/quote/types.js';
  import SectionLabel from '$lib/components/SectionLabel.svelte';

  function loadQuoteToWorkspace(id: string): void {
    const saved = $history.find(q => q.id === id);
    if (!saved) return;
    quoteInput.set(saved.input);
    goto('/quote');
  }

  function confirmDelete(id: string): void {
    if (confirm(`견적 ${id} 삭제하시겠습니까?`)) {
      deleteQuote(id);
    }
  }

  function dateOnly(iso: string): string {
    return iso.slice(0, 10);
  }
</script>

<div class="flex items-center gap-3 mb-3">
  <button onclick={() => goto('/quote')} aria-label="뒤로"
    class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-hairline">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.5"><path d="M15 6l-6 6 6 6"/></svg>
  </button>
  <div class="text-lg font-black">견적 이력</div>
</div>

<SectionLabel text="발행 견적" count={$history.length} />

{#if $history.length === 0}
  <div class="rounded-2xl bg-white border border-hairline p-6 text-center text-ink3 text-sm">
    아직 저장된 견적이 없습니다.
    <br />
    <span class="text-xs">/quote 에서 입력 후 "💾 견적 저장" 버튼을 누르세요.</span>
  </div>
{:else}
  <div class="space-y-2">
    {#each $history as q (q.id)}
      <div class="rounded-2xl bg-white border border-hairline p-4">
        <div class="flex items-start justify-between mb-1">
          <div>
            <div class="font-mono text-xs text-ink3">{q.id}</div>
            <div class="font-bold text-ink mt-0.5">{q.projectName || '(프로젝트 명 없음)'}</div>
            <div class="text-sm text-ink2">{q.clientName || '(고객명 없음)'}</div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-ink3">{dateOnly(q.createdAt)}</div>
            <div class="font-mono font-bold text-brand mt-1">
              {formatCurrency(q.finalDisplay, q.displayCurrency as Currency)}
            </div>
            {#if q.displayCurrency !== 'KRW'}
              <div class="text-[10px] text-ink3 font-mono">
                ≈ {formatCurrency(q.finalKrw, 'KRW')}
              </div>
            {/if}
          </div>
        </div>
        {#if q.notes}
          <div class="text-xs text-ink2 mt-2 p-2 rounded-lg bg-hairline">{q.notes}</div>
        {/if}
        <div class="grid grid-cols-2 gap-2 mt-3">
          <button onclick={() => loadQuoteToWorkspace(q.id)}
            class="py-1.5 rounded-lg border border-brand text-brand text-xs font-bold hover:bg-brand-surface">
            ↻ 불러오기
          </button>
          <button onclick={() => confirmDelete(q.id)}
            class="py-1.5 rounded-lg border border-hairline text-danger text-xs font-bold hover:bg-danger-light">
            🗑 삭제
          </button>
        </div>
      </div>
    {/each}
  </div>
{/if}

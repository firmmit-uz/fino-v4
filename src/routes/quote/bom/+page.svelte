<script lang="ts">
  import { goto } from '$app/navigation';
  import { quoteResult } from '$lib/quote/store.js';
  import { formatNumber, formatCurrency } from '$lib/quote/calc.js';
  import { categoryLabel } from '$lib/quote/labels.js';
  import { langStore } from '$lib/i18n/index.js';
  import SectionLabel from '$lib/components/SectionLabel.svelte';
</script>

<div class="flex items-center gap-3 mb-3">
  <button onclick={() => goto('/quote')} aria-label="뒤로"
    class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-hairline">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.5"><path d="M15 6l-6 6 6 6"/></svg>
  </button>
  <div class="text-lg font-black">자재명세서 (BOM)</div>
</div>

<div class="text-sm text-ink3 mb-3">
  총 {$quoteResult.bom.length}개 항목 · {$quoteResult.displayCurrency}
</div>

<SectionLabel text="전체 자재" />
<div class="rounded-2xl bg-white border border-hairline overflow-hidden">
  <table class="w-full text-xs">
    <thead class="bg-hairline">
      <tr class="text-left text-ink3">
        <th class="px-2 py-2 font-semibold">품번</th>
        <th class="px-2 py-2 font-semibold">품명·규격</th>
        <th class="px-2 py-2 font-semibold text-right">수량</th>
        <th class="px-2 py-2 font-semibold text-right">단가</th>
        <th class="px-2 py-2 font-semibold text-right">소계</th>
      </tr>
    </thead>
    <tbody>
      {#each $quoteResult.bom as line}
        <tr class="border-t border-hairline">
          <td class="px-2 py-2 font-mono text-ink3">{line.itemId}</td>
          <td class="px-2 py-2">
            <div class="font-semibold">{line.name}</div>
            <div class="text-ink3">{line.spec}</div>
            <div class="text-[10px] text-ink3 mt-0.5">{categoryLabel(line.category, $langStore)}</div>
          </td>
          <td class="px-2 py-2 text-right font-mono">{formatNumber(line.quantity, line.quantity < 100 ? 1 : 0)} {line.unit}</td>
          <td class="px-2 py-2 text-right font-mono text-ink2">{formatNumber(line.unitPrice)}</td>
          <td class="px-2 py-2 text-right font-mono font-semibold">{formatNumber(line.total)}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="bg-hairline">
      <tr>
        <td colspan="4" class="px-2 py-2 font-bold text-right">자재 합계</td>
        <td class="px-2 py-2 text-right font-mono font-bold">
          {formatNumber($quoteResult.bom.reduce((s, l) => s + l.total, 0))}
        </td>
      </tr>
    </tfoot>
  </table>
</div>

<div class="mt-4 text-xs text-ink3 leading-relaxed p-3 rounded-xl bg-hairline">
  ※ 단가는 한국 매입 기준 (FM-NNN 코드 = FIRMMIT 자재 카탈로그). 우즈벡 현지 매입가는 추후 임포트 예정.
  자재 수량은 강석문 .xlsm §3.7 공식 기준 — 일부 항목(셋기둥·중방 등)은 검증 진행 중.
</div>

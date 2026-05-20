<script lang="ts">
  import { goto } from '$app/navigation';
  import { quoteInput, quoteResult, applyPreset, resetQuote } from '$lib/quote/store.js';
  import { formatCurrency, formatNumber } from '$lib/quote/calc.js';
  import { categoryLabel, groupLabel } from '$lib/quote/labels.js';
  import { langStore } from '$lib/i18n/index.js';
  import { saveQuote, generateQuoteNumber } from '$lib/quote/history.js';
  import type { Currency } from '$lib/quote/types.js';
  import SectionLabel from '$lib/components/SectionLabel.svelte';

  // 입력 핸들러: deep-cloned 변경
  function updateInput<K extends keyof typeof $quoteInput>(key: K, value: typeof $quoteInput[K]): void {
    quoteInput.update(prev => ({ ...prev, [key]: value }));
  }

  function num(e: Event): number {
    const v = (e.target as HTMLInputElement).valueAsNumber;
    return Number.isFinite(v) ? v : 0;
  }

  // 견적 저장 다이얼로그
  let showSaveDialog = $state(false);
  let saveClient = $state('');
  let saveProject = $state('');
  let saveNotes = $state('');
  const nextId = $derived(generateQuoteNumber());

  function commitSave(): void {
    if (!saveClient.trim() && !saveProject.trim()) {
      alert('고객명 또는 프로젝트명을 입력하세요.');
      return;
    }
    const saved = saveQuote($quoteInput, {
      clientName: saveClient.trim(),
      projectName: saveProject.trim(),
      notes: saveNotes.trim(),
    });
    showSaveDialog = false;
    saveClient = ''; saveProject = ''; saveNotes = '';
    alert(`✅ ${saved.id} 저장 완료`);
  }
</script>

<!-- Hero -->
<div class="rounded-2xl overflow-hidden mb-3"
     style="background:linear-gradient(135deg,#1E40AF 0%,#3365FF 100%)">
  <div class="p-5 relative">
    <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full text-[13px] font-semibold text-white"
         style="background:rgba(255,255,255,0.2)">
      🏗️ 온실 견적
    </div>
    <div class="text-[24px] font-black text-white leading-tight mb-1">
      {formatCurrency($quoteResult.finalDisplay, $quoteResult.displayCurrency)}
    </div>
    <div class="text-[13px] text-white/80 font-medium">
      {formatNumber($quoteResult.quantities.area)} ㎡
      · {formatNumber($quoteResult.quantities.pyeong, 0)} 평
      · 동수 {$quoteResult.quantities.spanCount}
    </div>
    {#if $quoteResult.displayCurrency !== 'KRW'}
      <div class="text-[12px] text-white/70 mt-1">
        ≈ {formatCurrency($quoteResult.finalKrw, 'KRW')}
      </div>
    {/if}
  </div>
</div>

<!-- Preset buttons -->
<div class="grid grid-cols-3 gap-2 mb-2">
  <button onclick={() => applyPreset('ksm')}
    class="py-2 px-3 rounded-xl border border-hairline bg-white text-sm font-semibold hover:bg-brand-surface">
    강석문 베이스
  </button>
  <button onclick={() => applyPreset('nukus')}
    class="py-2 px-3 rounded-xl text-sm font-semibold text-white"
    style="background:var(--color-brand)">
    누쿠스 2ha
  </button>
  <button onclick={resetQuote}
    class="py-2 px-3 rounded-xl border border-hairline bg-white text-sm font-semibold text-ink3 hover:bg-hairline">
    초기화
  </button>
</div>

<!-- ── 1. INPUT — 기본 사양 ────────────────────────── -->
<SectionLabel text="1. 기본 사양" />
<div class="rounded-2xl bg-white border border-hairline p-4 grid grid-cols-2 gap-3">
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">하우스 폭 (m)</div>
    <input type="number" step="0.1" value={$quoteInput.width}
      oninput={(e) => updateInput('width', num(e))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
  </label>
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">길이 (m)</div>
    <input type="number" step="0.1" value={$quoteInput.length}
      oninput={(e) => updateInput('length', num(e))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
  </label>
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">동폭 (m)</div>
    <input type="number" step="0.1" value={$quoteInput.spanWidth}
      oninput={(e) => updateInput('spanWidth', num(e))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
  </label>
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">측고 (m)</div>
    <input type="number" step="0.1" value={$quoteInput.height}
      oninput={(e) => updateInput('height', num(e))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
  </label>
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">기둥 간격 (m)</div>
    <input type="number" step="0.1" value={$quoteInput.columnPitch}
      oninput={(e) => updateInput('columnPitch', num(e))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
  </label>
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">기둥 두께</div>
    <select value={$quoteInput.columnThickness}
      onchange={(e) => updateInput('columnThickness', Number((e.target as HTMLSelectElement).value) as 2.1 | 2.3)}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono">
      <option value={2.1}>2.1t</option>
      <option value={2.3}>2.3t (강도)</option>
    </select>
  </label>
</div>

<!-- ── 2. 옵션 ────────────────────────── -->
<SectionLabel text="2. 옵션 (ON/OFF)" />
<div class="rounded-2xl bg-white border border-hairline p-3 grid grid-cols-2 gap-2">
  {#each [
    { key: 'enable2ndCover', label: '2중 비닐' },
    { key: 'enableShade', label: '차광망' },
    { key: 'enableThermal', label: '보온커튼' },
    { key: 'enableSideCurtain', label: '측면 수직커튼' },
    { key: 'enableEndCurtain', label: '전후면 수직커튼' },
    { key: 'enableBoiler', label: '가스 보일러' },
    { key: 'enableIrrigation', label: '양액시설' },
    { key: 'enableEnvControl', label: '환경제어시설' },
  ] as opt}
    <label class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-hairline cursor-pointer">
      <input type="checkbox"
        checked={$quoteInput[opt.key as keyof typeof $quoteInput] as boolean}
        onchange={(e) => updateInput(opt.key as 'enable2ndCover', (e.target as HTMLInputElement).checked)}
        class="w-4 h-4" />
      <span class="text-sm font-medium">{opt.label}</span>
    </label>
  {/each}
</div>

{#if $quoteInput.enableBoiler || $quoteInput.enableEnvControl}
  <div class="rounded-2xl bg-white border border-hairline p-4 mt-2 grid grid-cols-2 gap-3">
    {#if $quoteInput.enableBoiler}
      <label class="block">
        <div class="text-xs font-semibold text-ink2 mb-1">보일러 세트 수</div>
        <input type="number" min="1" max="10" value={$quoteInput.boilerSets}
          oninput={(e) => updateInput('boilerSets', num(e))}
          class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
      </label>
    {/if}
    {#if $quoteInput.enableEnvControl}
      <label class="block">
        <div class="text-xs font-semibold text-ink2 mb-1">제어 채널 수</div>
        <input type="number" min="0" max="64" value={$quoteInput.envControlChannels}
          oninput={(e) => updateInput('envControlChannels', num(e))}
          class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
      </label>
    {/if}
  </div>
{/if}

<!-- ── 3. 부대비용 (마진 외) ────────────────────────── -->
<SectionLabel text="3. 부대비용" />
<div class="rounded-2xl bg-white border border-hairline p-4 grid grid-cols-2 gap-3">
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">슈퍼바이저 (개월)</div>
    <input type="number" min="0" value={$quoteInput.superVisorMonths}
      oninput={(e) => updateInput('superVisorMonths', num(e))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
  </label>
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">컨테이너 (대)</div>
    <input type="number" min="0" value={$quoteInput.containerCount}
      oninput={(e) => updateInput('containerCount', num(e))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
  </label>
</div>

<!-- ── 4. 마진·환율·통화 ────────────────────────── -->
<SectionLabel text="4. 마진·환율·통화" />
<div class="rounded-2xl bg-white border border-hairline p-4 grid grid-cols-2 gap-3">
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">FIRMMIT 마진율</div>
    <input type="number" step="0.01" min="0" max="1" value={$quoteInput.marginRate}
      oninput={(e) => updateInput('marginRate', num(e))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
  </label>
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">VAT</div>
    <select value={$quoteInput.vatRate}
      onchange={(e) => updateInput('vatRate', Number((e.target as HTMLSelectElement).value))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono">
      <option value={0.10}>한국 10%</option>
      <option value={0.12}>우즈벡 12%</option>
      <option value={0}>면세 0%</option>
    </select>
  </label>
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">KRW / USD</div>
    <input type="number" step="1" value={$quoteInput.fxKrwPerUsd}
      oninput={(e) => updateInput('fxKrwPerUsd', num(e))}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono" />
  </label>
  <label class="block">
    <div class="text-xs font-semibold text-ink2 mb-1">통화</div>
    <select value={$quoteInput.currency}
      onchange={(e) => updateInput('currency', (e.target as HTMLSelectElement).value as Currency)}
      class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink font-mono">
      <option value="KRW">KRW (원)</option>
      <option value="USD">USD ($)</option>
      <option value="UZS">UZS (sum)</option>
    </select>
  </label>
</div>

<!-- ── 결과 — 시설 그룹 합계 (3대 분류 §3.4) ────────────────── -->
<SectionLabel text="시설별 합계" count={$quoteResult.groups.length} />
<div class="space-y-2">
  {#each $quoteResult.groups as g}
    <div class="rounded-2xl bg-white border border-hairline overflow-hidden">
      <div class="px-4 py-2 flex justify-between items-baseline"
           style="background:var(--color-brand-surface)">
        <span class="font-bold text-ink">{groupLabel(g.group, $langStore)}</span>
        <span class="font-mono font-bold text-brand">{formatNumber(g.cost.grandTotal)}</span>
      </div>
      <table class="w-full text-xs">
        <tbody>
          {#each g.categories as cat}
            <tr class="border-t border-hairline">
              <td class="px-3 py-1.5 text-ink2">{categoryLabel(cat.category, $langStore)}</td>
              <td class="px-3 py-1.5 text-right font-mono">{formatNumber(cat.subtotal)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/each}
</div>

<!-- ── 결과 — 원가계산서 요약 ────────────────────────── -->
<SectionLabel text="원가계산 (하우스 공사)" />
<div class="rounded-2xl bg-white border border-hairline p-4 space-y-2 text-sm">
  {#each [
    ['재료비 (직접)',  $quoteResult.cost.materialDirect],
    ['노무비 (직접)',  $quoteResult.cost.laborDirect],
    ['간접노무비 +3%', $quoteResult.cost.indirectLabor],
    ['산재보험 3.7%',  $quoteResult.cost.workersInsurance],
    ['고용보험 1.01%', $quoteResult.cost.employmentInsurance],
    ['기타경비 3%',    $quoteResult.cost.otherExpense],
    ['순공사비',       $quoteResult.cost.pureConstruction],
    ['일반관리비 3%',  $quoteResult.cost.generalAdmin],
    ['이윤 10%',       $quoteResult.cost.profit],
    ['공급가액',       $quoteResult.cost.supplyAmount],
    ['부가세',         $quoteResult.cost.vat],
  ] as [label, value]}
    <div class="flex justify-between items-baseline">
      <span class="text-ink3">{label}</span>
      <span class="font-mono font-semibold">{formatNumber(value as number)}</span>
    </div>
  {/each}
  <div class="flex justify-between items-baseline pt-2 border-t border-hairline">
    <span class="text-ink font-bold">하우스 총액</span>
    <span class="font-mono font-bold text-brand text-base">{formatNumber($quoteResult.cost.grandTotal)}</span>
  </div>
</div>

<!-- ── 결과 — 부대비용·마진 ────────────────────────── -->
<SectionLabel text="부대비용·마진" />
<div class="rounded-2xl bg-white border border-hairline p-4 space-y-2 text-sm">
  <div class="flex justify-between"><span class="text-ink3">시설 합계 (VAT 포함)</span><span class="font-mono">{formatNumber($quoteResult.facilitiesTotal)}</span></div>
  {#if $quoteResult.extras.boiler > 0}
    <div class="flex justify-between"><span class="text-ink3">+ 보일러</span><span class="font-mono">{formatNumber($quoteResult.extras.boiler)}</span></div>
  {/if}
  {#if $quoteResult.extras.margin > 0}
    <div class="flex justify-between"><span class="text-ink3">+ FIRMMIT 마진 ({Math.round($quoteInput.marginRate * 100)}%)</span><span class="font-mono">{formatNumber($quoteResult.extras.margin)}</span></div>
  {/if}
  {#if $quoteResult.extras.supervisor > 0}
    <div class="flex justify-between"><span class="text-ink3">+ 슈퍼바이저</span><span class="font-mono">{formatNumber($quoteResult.extras.supervisor)}</span></div>
  {/if}
  {#if $quoteResult.extras.container > 0}
    <div class="flex justify-between"><span class="text-ink3">+ 컨테이너</span><span class="font-mono">{formatNumber($quoteResult.extras.container)}</span></div>
  {/if}
  <div class="flex justify-between items-baseline pt-2 border-t border-hairline">
    <span class="text-ink font-bold">최종 견적</span>
    <span class="font-mono font-bold text-base" style="color:var(--color-brand)">
      {formatCurrency($quoteResult.finalDisplay, $quoteResult.displayCurrency)}
    </span>
  </div>
</div>

<!-- Actions -->
<div class="grid grid-cols-2 gap-2 mt-4">
  <button onclick={() => goto('/quote/bom')}
    class="py-3 rounded-xl bg-white border border-brand text-brand font-bold hover:bg-brand-surface">
    📋 자재명세서
  </button>
  <button onclick={() => goto('/quote/print')}
    class="py-3 rounded-xl text-white font-bold"
    style="background:var(--color-brand)">
    🖨 견적서 출력
  </button>
  <button onclick={() => (showSaveDialog = true)}
    class="py-3 rounded-xl bg-white border border-hairline text-ink font-bold hover:bg-hairline">
    💾 견적 저장
  </button>
  <button onclick={() => goto('/quote/history')}
    class="py-3 rounded-xl bg-white border border-hairline text-ink font-bold hover:bg-hairline">
    📚 견적 이력
  </button>
</div>

<div class="mt-2">
  <button onclick={() => goto('/quote/verify')}
    class="w-full py-2 rounded-xl bg-white border border-hairline text-ink3 text-xs font-semibold hover:bg-hairline">
    🔬 §5.2 강석문 베이스라인 검증
  </button>
</div>

<!-- 저장 다이얼로그 -->
{#if showSaveDialog}
  <div role="dialog" aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background:rgba(15,23,42,0.5)">
    <div class="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl">
      <div class="flex items-baseline justify-between mb-3">
        <div class="font-black text-lg">견적 저장</div>
        <div class="font-mono text-xs text-ink3">{nextId}</div>
      </div>
      <div class="space-y-3">
        <label class="block">
          <div class="text-xs font-semibold text-ink2 mb-1">고객명 / Client</div>
          <input type="text" bind:value={saveClient}
            placeholder="예: 누쿠스 농업 회사"
            class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink" />
        </label>
        <label class="block">
          <div class="text-xs font-semibold text-ink2 mb-1">프로젝트명 / Project</div>
          <input type="text" bind:value={saveProject}
            placeholder="예: Nukus 2ha Greenhouse"
            class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink" />
        </label>
        <label class="block">
          <div class="text-xs font-semibold text-ink2 mb-1">비고 / Notes</div>
          <textarea bind:value={saveNotes} rows={3}
            placeholder="회의 결정사항·특이사항 등"
            class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-ink"></textarea>
        </label>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-4">
        <button onclick={() => (showSaveDialog = false)}
          class="py-2 rounded-lg border border-hairline bg-white text-sm font-semibold">
          취소
        </button>
        <button onclick={commitSave}
          class="py-2 rounded-lg text-white text-sm font-bold"
          style="background:var(--color-brand)">
          저장
        </button>
      </div>
    </div>
  </div>
{/if}

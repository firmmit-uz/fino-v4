<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { findStage } from '$lib/engine/stages.js';
  import { calcPrescription, byTank } from '$lib/engine/calc.js';
  import { DEFAULT_RAW, DEFAULT_OPTS } from '$lib/engine/defaults.js';
  import type { RawWater } from '$lib/engine/types.js';

  const stageId = $derived($page.params.stage ?? '');
  const stage = $derived(stageId ? findStage('nursery', stageId) : undefined);
  let raw = $state<RawWater>({ ...DEFAULT_RAW });

  const result = $derived(
    stage ? calcPrescription(stage.target, raw, { ...DEFAULT_OPTS }) : null
  );
  const tanks = $derived(result ? byTank(result.ferts) : null);

  const TANK_COLORS: Record<'A'|'B'|'C', string> = {
    A: 'border-green-500 bg-green-950',
    B: 'border-teal-500 bg-teal-950',
    C: 'border-amber-500 bg-amber-950',
  };
</script>

{#if !stage}
  <div class="min-h-screen bg-slate-900 text-white flex items-center justify-center">
    <div class="text-center">
      <div class="text-2xl mb-4">Stage '{stageId}' not found</div>
      <button onclick={() => goto('/nursery')} class="text-green-400">← Back</button>
    </div>
  </div>
{:else}
<div class="min-h-screen bg-slate-900 text-white">
  <div class="bg-gradient-to-b from-green-900 to-slate-900 px-4 pt-10 pb-6">
    <button onclick={() => goto('/nursery')} class="text-green-300 text-sm mb-3 flex items-center gap-1">← {t('nav.back')}</button>
    <div class="flex items-center justify-between">
      <div>
        <div class="text-2xl font-bold">{t(stage.label, 'stages')}</div>
        {#if stage.dates}
          <div class="text-green-400 text-xs mt-0.5">{stage.dates} · {stage.days}</div>
        {/if}
        <div class="text-green-300 text-sm">EC {stage.ecMin}–{stage.ecMax} mS/cm</div>
      </div>
      <a href="/print/nursery/{stageId}" target="_blank"
        class="px-3 py-1.5 bg-green-800 rounded-lg text-sm font-semibold text-green-200">
        🖨 {t('nav.print')}
      </a>
    </div>
  </div>

  <div class="px-4 py-4 max-w-lg mx-auto flex flex-col gap-4">
    {#if result}
      <div class="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
        <span class="text-slate-300 font-semibold">{t('label.ec_est')}</span>
        <span class="text-2xl font-black text-green-400">{result.ec.toFixed(2)} mS/cm</span>
      </div>

      {#each result.warnings as w}
        <div class="rounded-xl p-3 text-sm font-semibold
          {w.level === 'P0' ? 'bg-red-950 border border-red-700 text-red-300'
          : 'bg-amber-950 border border-amber-700 text-amber-300'}">
          ⚠ [{w.level}] {w.detail ?? w.code}
        </div>
      {/each}

      {#each (['A','B','C'] as const) as tk}
        {#if tanks && Object.keys(tanks[tk]).length > 0}
          <div class="rounded-xl border {TANK_COLORS[tk]} overflow-hidden">
            <div class="px-4 py-3 font-bold text-sm flex items-center gap-2 border-b border-white/10">
              <span class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black">{tk}</span>
              <span>{t(`tank.${tk.toLowerCase()}`)}</span>
              {#if tk === 'C'}<span class="ml-auto text-amber-300 text-xs font-bold">⚠ 산 · 별도 보관</span>{/if}
            </div>
            {#each Object.entries(tanks[tk]) as [id, amount]}
              {#if amount && amount > 0}
                <div class="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span class="text-sm text-slate-200">{t(`fert.${id}`)}</span>
                  <span class="font-bold">
                    {amount < 1 ? (amount * 1000).toFixed(0) + ' g' : amount.toFixed(2) + ' kg'}
                  </span>
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      {/each}
    {/if}
  </div>
</div>
{/if}

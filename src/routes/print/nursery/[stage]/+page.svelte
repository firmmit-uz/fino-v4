<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/i18n/index.js';
  import { findStage } from '$lib/engine/stages.js';
  import { calcPrescription, byTank } from '$lib/engine/calc.js';
  import { DEFAULT_RAW, DEFAULT_OPTS } from '$lib/engine/defaults.js';

  const stageId = $derived($page.params.stage ?? '');
  const stage   = $derived(stageId ? findStage('nursery', stageId) : undefined);
  const result  = $derived(stage ? calcPrescription(stage.target, DEFAULT_RAW, DEFAULT_OPTS) : null);
  const tanks   = $derived(result ? byTank(result.ferts) : null);
</script>

<svelte:head>
  <style>@media print { .no-print { display: none; } }</style>
</svelte:head>

<div class="bg-white text-black min-h-screen p-8 max-w-3xl mx-auto font-sans">
  {#if !stage || !result}
    <p>Stage not found</p>
  {:else}
  <div class="border-b-4 border-green-600 pb-4 mb-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-3xl font-black tracking-wide text-green-700">FINO</div>
        <div class="text-sm text-gray-500">{$t('mode.nursery')} · {stage.id} · {$t(stage.label, 'stages')}</div>
      </div>
      <div class="text-right">
        {#if stage.dates}<div class="text-xs text-gray-500">{stage.dates}</div>{/if}
        <div class="text-sm text-gray-600">EC {stage.ecMin}–{stage.ecMax} mS/cm</div>
        <div class="text-green-700 font-bold">EC est. {result.ec.toFixed(2)}</div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-3 gap-4 mb-8">
    {#each (['A','B','C'] as const) as tk}
      {#if tanks && tanks[tk].length > 0}
        <div class="border-2 {tk==='A'?'border-green-600':tk==='B'?'border-teal-500':'border-amber-500'} rounded-xl p-3">
          <div class="text-center font-black text-xl mb-2
            {tk==='A'?'text-green-700':tk==='B'?'text-teal-700':'text-amber-700'}">
            {$t(`tank.${tk.toLowerCase()}`)}
          </div>
          {#each tanks[tk] as item}
            <div class="flex justify-between items-baseline py-1 border-b border-gray-100">
              <div>
                <div class="text-xs text-gray-700 leading-tight">{$t(`fert.${item.id}`)}</div>
                <div class="text-xs text-gray-400 font-mono leading-tight">{item.formula}</div>
              </div>
              <span class="font-black text-lg ml-2 tabular-nums">
                {item.unit === 'mL'
                  ? item.amount.toFixed(0) + ' mL'
                  : item.amount < 1
                    ? (item.amount * 1000).toFixed(0) + 'g'
                    : item.amount.toFixed(2) + 'kg'}
              </span>
            </div>
          {/each}
          {#if tk === 'C'}
            <div class="mt-2 p-2 bg-amber-50 border border-amber-400 rounded-lg text-xs text-amber-800 font-bold">
              ⚠ {$t('label.acid_dilution')}
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>

  <div class="mb-6">
    <div class="text-lg font-bold mb-3">{$t('proc.title', 'procedure')}</div>
    <div class="space-y-2">
      {#each [1,2,3,4,5,6,7] as n}
        <div class="flex gap-3 items-start {n === 6 ? 'bg-amber-50 border border-amber-300 rounded-lg p-2' : ''}">
          <div class="w-7 h-7 rounded-full {n === 6 ? 'bg-amber-500' : 'bg-green-600'} text-white font-black text-sm flex items-center justify-center flex-shrink-0">{n}</div>
          <div class="flex-1 {n === 6 ? 'font-bold text-amber-800' : 'text-sm'}">
            {$t(`proc.step${n}`, 'procedure')}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="border border-gray-200 rounded-xl overflow-hidden">
    <div class="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600">
      {$t('label.ions')} (mmol/L) — {$t('label.target')} / calc
    </div>
    <div class="grid grid-cols-7 text-center text-xs">
      {#each ([
        ['NO₃', result.ions.NO3, stage.target.NO3],
        ['NH₄', result.ions.NH4, stage.target.NH4],
        ['K',   result.ions.K,   stage.target.K],
        ['Ca',  result.ions.Ca,  stage.target.Ca],
        ['Mg',  result.ions.Mg,  stage.target.Mg],
        ['H₂PO₄', result.ions.H2PO4, stage.target.H2PO4],
        ['SO₄', result.ions.SO4, stage.target.SO4],
      ] as const) as [ion, calc, tgt]}
        <div class="py-2 border-r border-gray-100 last:border-0">
          <div class="text-gray-400">{ion}</div>
          <div class="font-bold">{(calc as number).toFixed(1)}</div>
          <div class="text-gray-400">({tgt})</div>
        </div>
      {/each}
    </div>
  </div>

  <div class="mt-4 text-xs text-gray-400 text-right">
    FINO v4 · {$t('label.raw_water_src')} · {new Date().toLocaleDateString()}
  </div>
  {/if}
</div>

<div class="no-print fixed bottom-4 right-4">
  <button onclick={() => window.print()} class="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
    🖨 {$t('nav.print')}
  </button>
</div>

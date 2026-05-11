<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { findStage } from '$lib/engine/stages.js';
  import { calcPrescription, byTank } from '$lib/engine/calc.js';
  import { DEFAULT_RAW, DEFAULT_OPTS } from '$lib/engine/defaults.js';
  import type { RawWater } from '$lib/engine/types.js';

  const stageId = $derived($page.params.stage ?? '');
  const stage = $derived(stageId ? findStage('main', stageId) : undefined);

  let raw = $state<RawWater>({ ...DEFAULT_RAW });
  let showRawEdit = $state(false);

  const result = $derived(
    stage ? calcPrescription(stage.target, raw, DEFAULT_OPTS) : null
  );
  const tanks = $derived(result ? byTank(result.ferts) : null);

  const TANK_COLORS: Record<'A'|'B'|'C', string> = {
    A: 'border-blue-500 bg-blue-950',
    B: 'border-green-500 bg-green-950',
    C: 'border-amber-500 bg-amber-950',
  };
  const TANK_LABEL: Record<'A'|'B'|'C', string> = { A: 'A', B: 'B', C: 'C' };
</script>

{#if !stage}
  <div class="min-h-screen bg-slate-900 text-white flex items-center justify-center">
    <div class="text-center">
      <div class="text-2xl mb-4">Stage '{stageId}' not found</div>
      <button onclick={() => goto('/main')} class="text-blue-400">← Back</button>
    </div>
  </div>
{:else}
<div class="min-h-screen bg-slate-900 text-white">
  <!-- Header -->
  <div class="bg-gradient-to-b from-blue-900 to-slate-900 px-4 pt-10 pb-6">
    <button onclick={() => goto('/main')} class="text-blue-300 text-sm mb-3 flex items-center gap-1">← {t('nav.back')}</button>
    <div class="flex items-center justify-between">
      <div>
        <div class="text-2xl font-bold">{t(stage.label, 'stages')}</div>
        <div class="text-blue-300 text-sm">EC {stage.ecMin}–{stage.ecMax} mS/cm</div>
      </div>
      <a href="/print/main/{stageId}" target="_blank"
        class="px-3 py-1.5 bg-blue-800 rounded-lg text-sm font-semibold text-blue-200">
        🖨 {t('nav.print')}
      </a>
    </div>
  </div>

  <div class="px-4 py-4 max-w-lg mx-auto flex flex-col gap-4">
    <!-- EC estimate -->
    {#if result}
      <div class="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
        <span class="text-slate-300 font-semibold">{t('label.ec_est')}</span>
        <span class="text-2xl font-black text-blue-400">{result.ec.toFixed(2)} mS/cm</span>
      </div>

      <!-- Warnings -->
      {#each result.warnings as w}
        <div class="rounded-xl p-3 text-sm font-semibold
          {w.level === 'P0' ? 'bg-red-950 border border-red-700 text-red-300'
          : w.level === 'P1' ? 'bg-amber-950 border border-amber-700 text-amber-300'
          : 'bg-slate-800 border border-slate-600 text-slate-300'}">
          ⚠ [{w.level}] {w.detail ?? w.code}
        </div>
      {/each}

      <!-- Tank cards -->
      {#each (['A','B','C'] as const) as tk}
        {#if tanks && Object.keys(tanks[tk]).length > 0}
          <div class="rounded-xl border {TANK_COLORS[tk]} overflow-hidden">
            <div class="px-4 py-3 font-bold text-sm flex items-center gap-2 border-b border-white/10">
              <span class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black">{TANK_LABEL[tk]}</span>
              <span>{t(`tank.${tk.toLowerCase()}`)}</span>
              {#if tk === 'C'}<span class="ml-auto text-amber-300 text-xs font-bold">⚠ {t('label.acid_dilution')}</span>{/if}
            </div>
            {#each Object.entries(tanks[tk]) as [id, amount]}
              {#if amount && amount > 0}
                <div class="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span class="text-sm text-slate-200">{t(`fert.${id}`)}</span>
                  <span class="font-bold text-white">
                    {amount < 1 ? (amount * 1000).toFixed(0) + ' g' : amount.toFixed(2) + ' kg'}
                    {#if id === 'hno3' || id === 'h3po4'} mL{/if}
                  </span>
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      {/each}

      <!-- Ion table -->
      <details class="bg-slate-800 rounded-xl overflow-hidden">
        <summary class="px-4 py-3 text-sm font-semibold text-slate-300 cursor-pointer">{t('label.ions')} ({t('unit.mmol_l')})</summary>
        <div class="px-4 pb-4 grid grid-cols-3 gap-2 text-xs">
          {#each ([['NO₃', result.ions.NO3, stage.target.NO3], ['NH₄', result.ions.NH4, stage.target.NH4], ['K', result.ions.K, stage.target.K], ['Ca', result.ions.Ca, stage.target.Ca], ['Mg', result.ions.Mg, stage.target.Mg], ['H₂PO₄', result.ions.H2PO4, stage.target.H2PO4], ['SO₄', result.ions.SO4, stage.target.SO4]] as const) as [ion, val, tgt]}
            <div class="bg-slate-700 rounded-lg p-2 text-center">
              <div class="text-slate-400">{ion}</div>
              <div class="font-bold text-white">{(val as number).toFixed(2)}</div>
              <div class="text-slate-500">{t('label.target')}: {tgt}</div>
            </div>
          {/each}
        </div>
      </details>
    {/if}

    <!-- Raw water edit -->
    <details bind:open={showRawEdit} class="bg-slate-800 rounded-xl overflow-hidden">
      <summary class="px-4 py-3 text-sm font-semibold text-slate-300 cursor-pointer">{t('label.edit_raw')}</summary>
      <div class="px-4 pb-4 grid grid-cols-2 gap-3">
        {#each (['pH','EC','NO3','NH4','K','Ca','Mg','H2PO4','SO4','HCO3','Na','Cl'] as const) as key}
          <label class="flex flex-col gap-1">
            <span class="text-xs text-slate-400">{key}</span>
            <input type="number" step="0.1" min="0"
              bind:value={raw[key]}
              class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white w-full" />
          </label>
        {/each}
        <button onclick={() => { raw = { ...DEFAULT_RAW }; }}
          class="col-span-2 mt-1 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm font-semibold">
          {t('label.reset_raw')}
        </button>
      </div>
    </details>
  </div>
</div>
{/if}

<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { STAGES_MAIN, STAGES_NURSERY } from '$lib/engine/stages.js';
  import { calcPrescription } from '$lib/engine/calc.js';
  import { DEFAULT_RAW, DEFAULT_OPTS } from '$lib/engine/defaults.js';
  import TopBar from '$lib/components/TopBar.svelte';

  // v4 baseline: no modifiers, default opts
  const mainResults = STAGES_MAIN.map(s => ({
    stage: s,
    result: calcPrescription(s.target, DEFAULT_RAW, DEFAULT_OPTS),
  }));
  const nurseryResults = STAGES_NURSERY.map(s => ({
    stage: s,
    result: calcPrescription(s.target, DEFAULT_RAW, DEFAULT_OPTS),
  }));
</script>

<div class="min-h-screen bg-bg pb-8">
  <TopBar onBack={() => goto('/')} />

  <div class="px-4 py-4">
    <div class="text-xl font-bold text-ink mb-1">Debug — v4 Baseline</div>
    <div class="text-xs text-ink3 mb-4">No modifiers · DEFAULT_RAW · DEFAULT_OPTS</div>

    <div class="text-xs font-bold text-ink3 uppercase mb-2">{$t('mode.main')}</div>
    {#each mainResults as { stage, result }}
      <div class="bg-card rounded-xl border border-hairline p-3 mb-2">
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-sm text-ink">{stage.id}</span>
          <span class="text-xs font-mono text-brand">EC {result.ec.toFixed(2)}</span>
        </div>
        <div class="text-xs font-mono text-ink3">
          NO₃ {result.ions.NO3.toFixed(2)} · K {result.ions.K.toFixed(2)} · Ca {result.ions.Ca.toFixed(2)} · K/Ca {(result.ions.K/result.ions.Ca).toFixed(3)}
        </div>
        {#if result.warnings.length > 0}
          <div class="text-xs text-danger mt-1">{result.warnings.map(w => w.code).join(', ')}</div>
        {/if}
      </div>
    {/each}

    <div class="text-xs font-bold text-ink3 uppercase mb-2 mt-4">{$t('mode.nursery')}</div>
    {#each nurseryResults as { stage, result }}
      <div class="bg-card rounded-xl border border-hairline p-3 mb-2">
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-sm text-ink">{stage.id}</span>
          <span class="text-xs font-mono text-nursery">EC {result.ec.toFixed(2)}</span>
        </div>
        <div class="text-xs font-mono text-ink3">
          NO₃ {result.ions.NO3.toFixed(2)} · K {result.ions.K.toFixed(2)} · Ca {result.ions.Ca.toFixed(2)}
        </div>
        {#if result.warnings.length > 0}
          <div class="text-xs text-danger mt-1">{result.warnings.map(w => w.code).join(', ')}</div>
        {/if}
      </div>
    {/each}
  </div>
</div>

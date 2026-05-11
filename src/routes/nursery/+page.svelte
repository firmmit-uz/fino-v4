<script lang="ts">
  import { t } from '$lib/i18n/index.js';
  import { STAGES_NURSERY } from '$lib/engine/stages.js';
  import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-slate-900 text-white">
  <div class="bg-gradient-to-b from-green-900 to-slate-900 px-4 pt-10 pb-6">
    <button onclick={() => goto('/')} class="text-green-300 text-sm mb-4 flex items-center gap-1">← {$t('nav.back')}</button>
    <div class="text-2xl font-bold">🌱 {$t('mode.nursery')}</div>
    <div class="text-green-300 text-sm mt-1">{$t('mode.nursery_desc')}</div>
  </div>

  <div class="px-4 py-4 flex flex-col gap-3 max-w-lg mx-auto">
    {#each STAGES_NURSERY as stage}
      <button
        onclick={() => goto(`/nursery/${stage.id}`)}
        class="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-left hover:border-green-500 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-bold">{$t(stage.label, 'stages')}</div>
            {#if stage.dates}
              <div class="text-slate-500 text-xs mt-0.5">{stage.dates} · {stage.days}</div>
            {/if}
            <div class="text-slate-400 text-sm mt-1">EC {stage.ecMin}–{stage.ecMax} {$t('unit.ms_cm')}</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-500">K {stage.target.K} · Ca {stage.target.Ca}</div>
            <div class="text-green-400 text-lg mt-2">→</div>
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>

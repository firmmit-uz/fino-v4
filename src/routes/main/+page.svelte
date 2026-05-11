<script lang="ts">
  import { t } from '$lib/i18n/index.js';
  import { STAGES_MAIN } from '$lib/engine/stages.js';
  import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-slate-900 text-white">
  <div class="bg-gradient-to-b from-blue-900 to-slate-900 px-4 pt-10 pb-6">
    <button onclick={() => goto('/')} class="text-blue-300 text-sm mb-4 flex items-center gap-1">← {$t('nav.back')}</button>
    <div class="text-2xl font-bold">🍓 {$t('mode.main')}</div>
    <div class="text-blue-300 text-sm mt-1">{$t('mode.main_desc')}</div>
  </div>

  <div class="px-4 py-4 flex flex-col gap-3 max-w-lg mx-auto">
    {#each STAGES_MAIN as stage}
      <button
        onclick={() => goto(`/main/${stage.id}`)}
        class="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-left hover:border-blue-500 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-bold">{$t(stage.label, 'stages')}</div>
            <div class="text-slate-400 text-sm mt-1">EC {stage.ecMin}–{stage.ecMax} {$t('unit.ms_cm')}</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-500">NO₃ {stage.target.NO3} · K {stage.target.K}</div>
            <div class="text-xs text-slate-500">Ca {stage.target.Ca} · Mg {stage.target.Mg}</div>
            <div class="text-blue-400 text-lg mt-1">→</div>
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>

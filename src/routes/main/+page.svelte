<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { STAGES_MAIN } from '$lib/engine/stages.js';
  import TopBar from '$lib/components/TopBar.svelte';
  import StagePill from '$lib/components/StagePill.svelte';
</script>

<div class="min-h-screen bg-bg pb-8">
  <TopBar mode="main" onBack={() => goto('/')} />

  <div class="px-4 py-4">
    <div class="text-xl font-bold text-ink mb-1">🍓 {$t('mode.main')}</div>
    <div class="text-sm text-ink3 mb-4">{$t('mode.main_desc')}</div>

    <div class="flex flex-col gap-3">
      {#each STAGES_MAIN as stage}
        <button onclick={() => goto(`/main/${stage.id}`)}
          class="bg-card rounded-2xl border border-hairline p-4 text-left
                 hover:border-brand/40 active:scale-98 transition-all">
          <div class="flex items-center justify-between mb-2">
            <StagePill id={stage.id} active color="var(--color-brand)" bgColor="var(--color-brand-surface)" />
            <span class="text-xs text-ink3">EC {stage.ecMin}–{stage.ecMax} {$t('unit.ms_cm')}</span>
          </div>
          <div class="text-base font-bold text-ink">{$t(stage.label, 'stages')}</div>
          <div class="text-xs text-ink3 mt-1">
            NO₃ {stage.target.NO3} · K {stage.target.K} · Ca {stage.target.Ca} · H₂PO₄ {stage.target.H2PO4}
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { STAGES_NURSERY_INDOOR } from '$lib/engine/stages.js';
  import TopBar from '$lib/components/TopBar.svelte';
  import StagePill from '$lib/components/StagePill.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
</script>

<div class="flex flex-col flex-1 overflow-hidden">
  <TopBar mode="nursery_indoor" onBack={() => goto('/')} />
  <div class="flex-1 overflow-y-auto">
    <div class="px-4 py-4">
      <div class="text-xl font-bold text-ink mb-1">🏠 {$t('mode.nursery_indoor')}</div>
      <div class="text-sm text-ink3 mb-1">{$t('mode.nursery_indoor_desc')} · v4.3</div>
      <div class="text-xs text-ink3 mb-4 bg-brand-surface rounded-xl px-3 py-2">
        💡 Ca +0.3 · NH4 −0.1 · EC −0.1 vs 노지 (Bot 1983)
      </div>
      <div class="flex flex-col gap-3">
        {#each STAGES_NURSERY_INDOOR as stage}
          <button onclick={() => goto(`/nursery/indoor/${stage.id}`)}
            class="bg-card rounded-2xl border border-hairline p-4 text-left hover:border-nursery/40 active:scale-98 transition-all">
            <div class="flex items-center justify-between mb-2">
              <StagePill id={stage.id} active color="#10B981" bgColor="#D1FAE5" />
              {#if stage.dates}
                <span class="text-xs text-ink3">{stage.dates} · {stage.days} {$t('unit.days_short')}</span>
              {/if}
            </div>
            <div class="text-base font-bold text-ink">{$t(stage.label, 'stages')}</div>
            <div class="text-xs text-ink3 mt-1">
              EC {stage.ecMin}–{stage.ecMax} · Ca {stage.target.Ca} · NH4 {stage.target.NH4}
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
  <BottomNav active="stages" mode="nursery_indoor" />
</div>

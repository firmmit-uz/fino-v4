<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { STAGES_NURSERY_FIELD } from '$lib/engine/stages.js';
  import TopBar from '$lib/components/TopBar.svelte';
  import StagePill from '$lib/components/StagePill.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
</script>

<div class="flex flex-col flex-1 overflow-hidden">
  <TopBar mode="nursery_field" onBack={() => goto('/')} />
  <div class="flex-1 overflow-y-auto">
    <div class="px-4 py-4">
      <div class="text-xl font-bold text-ink mb-1">🌿 {$t('mode.nursery_field')}</div>
      <div class="text-sm text-ink3 mb-4">{$t('mode.nursery_field_desc')} · v4.3</div>
      <div class="flex flex-col gap-3">
        {#each STAGES_NURSERY_FIELD as stage}
          <button onclick={() => goto(`/nursery/field/${stage.id}`)}
            class="bg-card rounded-2xl border border-hairline p-4 text-left hover:border-nursery/40 active:scale-98 transition-all">
            <div class="flex items-center justify-between mb-2">
              <StagePill id={stage.id} active color="var(--color-nursery)" bgColor="var(--color-nursery-surface)" />
              {#if stage.dates}
                <span class="text-xs text-ink3">{stage.dates} · {stage.days} {$t('unit.days_short')}</span>
              {/if}
            </div>
            <div class="text-base font-bold text-ink">{$t(stage.label, 'stages')}</div>
            <div class="text-xs text-ink3 mt-1">
              EC {stage.ecMin}–{stage.ecMax} · NO₃ {stage.target.NO3} · K {stage.target.K} · P {stage.target.H2PO4}
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
  <BottomNav active="stages" mode="nursery_field" />
</div>

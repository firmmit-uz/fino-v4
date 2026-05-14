<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { settings } from '$lib/stores/settings.js';
  import { VARIETIES } from '$lib/engine/varieties.js';
  import { FOCUSES } from '$lib/engine/focus.js';
  import TopBar from '$lib/components/TopBar.svelte';
  import SectionLabel from '$lib/components/SectionLabel.svelte';

  function set<K extends keyof typeof $settings>(key: K, val: (typeof $settings)[K]) {
    settings.update(s => ({ ...s, [key]: val }));
  }
</script>

<div class="min-h-screen bg-bg pb-8">
  <TopBar onBack={() => goto('/')} />

  <div class="px-4 py-4">
    <div class="text-xl font-bold text-ink mb-4">{$t('settings.title')}</div>

    <!-- Variety -->
    <div class="mb-5">
      <SectionLabel label={$t('variety.title')} />
      <div class="flex flex-col gap-2">
        {#each VARIETIES as v}
          <button onclick={() => set('variety', v)}
            class="flex items-center gap-3 p-3 rounded-xl border transition-colors
              {$settings.variety.id === v.id
                ? 'border-brand bg-brand-surface'
                : 'border-hairline bg-card'}">
            <div class="flex-1 text-sm font-semibold text-left text-ink">{$t(v.labelKey)}</div>
            <div class="text-xs text-ink3">K/Ca ≤ {v.kcaSafe}</div>
            {#if $settings.variety.id === v.id}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-brand)">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12l3 3 5-6" stroke="#fff" stroke-width="2.5" fill="none"/>
              </svg>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <!-- Focus -->
    <div class="mb-5">
      <SectionLabel label={$t('focus.title')} />
      <div class="grid grid-cols-2 gap-2">
        {#each FOCUSES as f}
          <button onclick={() => set('focus', f)}
            class="p-3 rounded-xl border text-sm font-semibold text-left transition-colors
              {$settings.focus.id === f.id
                ? 'border-nursery bg-nursery-surface text-nursery'
                : 'border-hairline bg-card text-ink'}">
            {$t(f.labelKey)}
          </button>
        {/each}
      </div>
    </div>

    <!-- Season -->
    <div class="mb-5">
      <SectionLabel label={$t('winter.title')} />
      <div class="grid grid-cols-2 gap-2">
        {#each ['summer', 'winter'] as s}
          <button onclick={() => set('season', s as 'summer'|'winter')}
            class="p-3 rounded-xl border text-sm font-semibold transition-colors
              {$settings.season === s
                ? 'border-brand bg-brand-surface text-brand'
                : 'border-hairline bg-card text-ink'}">
            {s === 'summer' ? '☀ ' + $t('winter.summer_mode') : '❄ ' + $t('winter.winter_mode')}
          </button>
        {/each}
      </div>
    </div>

    <!-- Fertilizer sources -->
    <div class="mb-5">
      <SectionLabel label={$t('label.prescription')} />
      <div class="bg-card rounded-2xl border border-hairline divide-y divide-hairline">
        <!-- Ca source -->
        <div class="p-3 flex items-center justify-between">
          <span class="text-sm text-ink2">Ca</span>
          <div class="flex gap-1">
            {#each ['agrogold155', 'calcinit_yara'] as src}
              <button onclick={() => set('calcinit', src as 'agrogold155'|'calcinit_yara')}
                class="px-2 py-1 rounded-lg text-xs font-bold transition-colors
                  {$settings.calcinit === src ? 'bg-brand text-white' : 'bg-hairline text-ink3'}">
                {src === 'agrogold155' ? 'CAN' : 'CaN'}
              </button>
            {/each}
          </div>
        </div>
        <!-- Fe source -->
        <div class="p-3 flex items-center justify-between">
          <span class="text-sm text-ink2">Fe</span>
          <div class="flex gap-1">
            {#each [['feEddha','EDDHA'],['feDtpa','DTPA'],['feEdta','EDTA']] as [src, lbl]}
              <button onclick={() => set('feSource', src as 'feEddha'|'feDtpa'|'feEdta')}
                class="px-2 py-1 rounded-lg text-xs font-bold transition-colors
                  {$settings.feSource === src ? 'bg-brand text-white' : 'bg-hairline text-ink3'}">
                {lbl}
              </button>
            {/each}
          </div>
        </div>
        <!-- Mg source -->
        <div class="p-3 flex items-center justify-between">
          <span class="text-sm text-ink2">Mg</span>
          <div class="flex gap-1">
            {#each [['mgso4','SO₄'],['mg_no3_2','NO₃']] as [src, lbl]}
              <button onclick={() => set('mgSource', src as 'mgso4'|'mg_no3_2')}
                class="px-2 py-1 rounded-lg text-xs font-bold transition-colors
                  {$settings.mgSource === src ? 'bg-brand text-white' : 'bg-hairline text-ink3'}">
                {lbl}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

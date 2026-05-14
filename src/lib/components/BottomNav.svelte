<script lang="ts">
  import { t } from '$lib/i18n/index.js';

  let {
    active = 'home',
    mode = 'main',
    onclick,
  }: { active?: string; mode?: 'main'|'nursery'; onclick?: (id: string) => void } = $props();

  const ac = $derived(mode === 'nursery' ? 'var(--color-nursery)' : 'var(--color-brand)');
  const asBg = $derived(mode === 'nursery' ? 'bg-nursery-surface' : 'bg-brand-surface');

  const ITEMS = [
    { id: 'home',     labelKey: 'nav.home' },
    { id: 'rx',       labelKey: 'nav.rx' },
    { id: 'guide',    labelKey: 'nav.guide' },
    { id: 'log',      labelKey: 'nav.log' },
    { id: 'settings', labelKey: 'nav.settings' },
  ];
</script>

<nav class="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-hairline
            grid grid-cols-5 safe-area-pb">
  {#each ITEMS as item}
    {@const on = item.id === active}
    <button
      onclick={() => onclick?.(item.id)}
      class="flex flex-col items-center gap-0.5 pt-2 pb-3 relative"
    >
      {#if on}
        <span class="absolute top-1.5 inset-x-3 h-0.5 rounded-full"
              style="background:{ac}"></span>
      {/if}
      <span class="text-[11px] font-semibold mt-1"
            style="color:{on ? ac : 'var(--color-ink3)'}">
        {$t(item.labelKey)}
      </span>
    </button>
  {/each}
</nav>

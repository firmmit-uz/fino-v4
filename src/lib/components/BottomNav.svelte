<script lang="ts">
  import { t } from '$lib/i18n/index.js';
  import { goto } from '$app/navigation';

  let {
    active = 'home',
    mode = 'main',
  }: { active?: string; mode?: string } = $props();

  const isNursery = $derived(mode !== 'main');
  const ac = $derived(isNursery ? 'var(--color-nursery)' : 'var(--color-brand)');

  const TABS = [
    { id: 'home',     icon: '⌂',  labelKey: 'nav.home',     path: '/' },
    { id: 'stages',   icon: '☰',  labelKey: 'nav.stages',   path: mode !== 'main' ? `/nursery/${mode.replace('nursery_','')  }` : '/main' },
    { id: 'rx',       icon: '⚗',  labelKey: 'nav.rx',       path: '/' },
    { id: 'workcard', icon: '🖨',  labelKey: 'nav.print',    path: '/' },
    { id: 'settings', icon: '⚙',  labelKey: 'nav.settings', path: '/settings' },
  ];
</script>

<nav class="flex-shrink-0 grid grid-cols-5 bg-card border-t border-hairline"
     style="padding-bottom:env(safe-area-inset-bottom,8px)">
  {#each TABS as tab}
    {@const on = tab.id === active}
    <button
      onclick={() => goto(tab.path)}
      class="flex flex-col items-center gap-0.5 pt-2 pb-2 relative transition-colors"
      style="color:{on ? ac : 'var(--color-ink4)'}"
    >
      {#if on}
        <span class="absolute top-0 left-3 right-3 h-[2px] rounded-full"
              style="background:{ac}"></span>
      {/if}
      <span class="text-base leading-none">{tab.icon}</span>
      <span class="text-[10px] font-semibold">{$t(tab.labelKey)}</span>
    </button>
  {/each}
</nav>

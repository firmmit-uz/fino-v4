<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';

  let {
    active = 'home',
    mode = 'main',
  }: { active?: string; mode?: string } = $props();

  const isNursery = $derived(mode !== 'main');
  const ac = $derived(isNursery ? 'var(--color-nursery)' : 'var(--color-brand)');

  const TABS = [
    { id: 'home',     labelKey: 'nav.home',     path: '/',        icon: '⌂' },
    { id: 'stages',   labelKey: 'nav.stages',   path: isNursery ? `/nursery/${mode.replace('nursery_','')}` : '/main', icon: '☰' },
    { id: 'rx',       labelKey: 'nav.rx',       path: '/',        icon: '⚗' },
    { id: 'print',    labelKey: 'nav.print',    path: '/',        icon: '🖨' },
    { id: 'settings', labelKey: 'nav.settings', path: '/settings', icon: '⚙' },
  ];
</script>

<!-- Mobile-only fixed bottom nav -->
<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-hairline
            grid grid-cols-5 safe-pb"
     style="padding-bottom:env(safe-area-inset-bottom,8px)">
  {#each TABS as tab}
    {@const on = tab.id === active}
    <button
      onclick={() => goto(tab.path)}
      class="flex flex-col items-center gap-0.5 pt-2 pb-1.5 relative"
      style="color:{on ? ac : 'var(--color-ink4)'}"
    >
      {#if on}
        <span class="absolute top-0 left-4 right-4 h-[2px] rounded-full"
              style="background:{ac}"></span>
      {/if}
      <span class="text-base leading-none">{tab.icon}</span>
      <span class="text-[10px] font-semibold">{$t(tab.labelKey)}</span>
    </button>
  {/each}
</nav>

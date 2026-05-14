<script lang="ts">
  import './layout.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { initI18n } from '$lib/i18n/index.js';
  import TopBar from '$lib/components/TopBar.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
  let ready = $state(false);

  // Derive active tab from current path
  const activeTab = $derived(() => {
    const p = $page.url.pathname;
    if (p === '/') return 'home';
    if (p.startsWith('/nursery') || p.startsWith('/main')) return 'stages';
    if (p.includes('/settings')) return 'settings';
    if (p.includes('/print')) return 'print';
    return 'home';
  });

  // Derive mode from current path
  const navMode = $derived(() => {
    const p = $page.url.pathname;
    if (p.startsWith('/nursery/indoor')) return 'nursery_indoor';
    if (p.startsWith('/nursery')) return 'nursery_field';
    return 'main';
  });

  onMount(async () => {
    await initI18n();
    ready = true;
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta name="theme-color" content="#FFFFFF" />
</svelte:head>

{#if ready}
  <div class="min-h-screen bg-bg text-ink">
    <TopBar />
    <main class="max-w-[640px] mx-auto px-5 pt-4 pb-28">
      {@render children()}
    </main>
    <!-- BottomNav: mobile only -->
    <div class="md:hidden">
      <BottomNav active={activeTab()} mode={navMode()} />
    </div>
  </div>
{:else}
  <!-- Minimal loading splash -->
  <div class="min-h-screen bg-bg flex items-center justify-center">
    <div class="text-center">
      <div class="text-4xl font-black text-brand tracking-widest mb-2">FIRMMIT.</div>
      <div class="text-sm text-ink3">Loading…</div>
    </div>
  </div>
{/if}

<style>
  @media print { :global(.no-print) { display: none !important; } }
</style>

<script lang="ts">
  import './layout.css';
  import { onMount } from 'svelte';
  import { initI18n, langStore, SUPPORTED_LANGS, setLang, type Lang } from '$lib/i18n/index.js';
  import AppShell from '$lib/components/AppShell.svelte';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
  let ready = $state(false);

  const LANG_LABELS: Record<Lang, string> = {
    'uz-Cyrl': 'Ўзбек', 'uz-Latn': "O'zbek", ko: '한국어', ru: 'Русский', en: 'English',
  };

  onMount(async () => {
    await initI18n();
    ready = true;
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta name="theme-color" content="#3365FF" />
</svelte:head>

{#if ready}
  <AppShell>
    {@render children()}
  </AppShell>
{:else}
  <!-- Splash while i18n loads -->
  <div class="min-h-screen flex items-center justify-center"
       style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%)">
    <div class="text-center">
      <div class="text-5xl font-black text-white tracking-widest mb-3">FINO</div>
      <div class="text-slate-400 text-sm">Loading…</div>
    </div>
  </div>
{/if}

<style>
  @media print { :global(.no-print) { display: none; } }
</style>

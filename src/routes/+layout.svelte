<script lang="ts">
  import './layout.css';
  import { onMount } from 'svelte';
  import { initI18n, setLang, langStore, SUPPORTED_LANGS, type Lang } from '$lib/i18n/index.js';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
  let ready = $state(false);

  const LANG_LABELS: Record<Lang, string> = {
    'uz-Cyrl': 'Ўзбек',
    'uz-Latn': "O'zbek",
    'ko':      '한국어',
    'ru':      'Русский',
    'en':      'English',
  };

  onMount(async () => {
    await initI18n();
    ready = true;
  });

  function onLangChange(e: Event) {
    setLang((e.target as HTMLSelectElement).value as Lang);
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta name="theme-color" content="#16A34A" />
</svelte:head>

{#if ready}
  <!-- Global language switcher — sticky, visible on every screen -->
  <div class="fixed top-0 right-0 z-50 p-2 no-print">
    <select
      value={$langStore}
      onchange={onLangChange}
      class="bg-slate-800/90 backdrop-blur border border-slate-600 text-slate-200 text-xs font-semibold
             rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:border-green-500"
    >
      {#each SUPPORTED_LANGS as code}
        <option value={code}>{LANG_LABELS[code]}</option>
      {/each}
    </select>
  </div>
  {@render children()}
{:else}
  <div class="flex h-screen items-center justify-center bg-slate-900">
    <div class="text-center">
      <div class="text-4xl font-black text-white tracking-widest mb-3">FINO</div>
      <div class="text-slate-400 text-sm">Loading…</div>
    </div>
  </div>
{/if}

<style>
  @media print { .no-print { display: none; } }
</style>

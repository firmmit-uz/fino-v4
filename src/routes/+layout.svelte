<script lang="ts">
  import './layout.css';
  import { onMount } from 'svelte';
  import { initI18n } from '$lib/i18n/index.js';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
  let ready = $state(false);

  onMount(async () => {
    await initI18n();
    ready = true;
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta name="theme-color" content="#16A34A" />
</svelte:head>

{#if ready}
  {@render children()}
{:else}
  <div class="flex h-screen items-center justify-center bg-slate-900">
    <div class="text-center">
      <div class="text-4xl font-black text-white tracking-widest mb-3">FINO</div>
      <div class="text-slate-400 text-sm">Loading…</div>
    </div>
  </div>
{/if}

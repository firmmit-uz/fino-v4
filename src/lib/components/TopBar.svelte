<script lang="ts">
  import FirmmitLogo from './FirmmitLogo.svelte';
  import { setLang, langStore, SUPPORTED_LANGS, type Lang } from '$lib/i18n/index.js';

  let { mode = 'main', onBack }: { mode?: 'main'|'nursery'|'root'; onBack?: () => void } = $props();

  const accentClass = $derived(mode === 'nursery'
    ? 'bg-nursery-surface border-nursery-light'
    : 'bg-brand-surface border-brand-light');

  const LANG_LABELS: Record<Lang, string> = {
    'uz-Cyrl': 'УЗ', 'uz-Latn': 'UZ', ko: '한', ru: 'RU', en: 'EN',
  };
</script>

<header class="sticky top-0 z-40 bg-card border-b border-hairline">
  <div class="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
    {#if onBack}
      <button onclick={onBack} class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-hairline">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 6l-6 6 6 6"/>
        </svg>
      </button>
    {:else}
      <FirmmitLogo fill="var(--color-brand)" height={18} />
    {/if}

    <div class="flex-1" />

    <!-- Lang pills -->
    <div class="flex gap-1">
      {#each SUPPORTED_LANGS as code}
        <button
          onclick={() => setLang(code)}
          class="w-8 h-7 rounded-full text-xs font-bold transition-colors
            {$langStore === code
              ? 'bg-brand text-white'
              : 'text-ink3 hover:bg-hairline'}"
        >{LANG_LABELS[code]}</button>
      {/each}
    </div>
  </div>
</header>

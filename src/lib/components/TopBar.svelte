<script lang="ts">
  import { goto } from '$app/navigation';
  import { setLang, langStore, SUPPORTED_LANGS, type Lang } from '$lib/i18n/index.js';

  let { onBack }: { onBack?: () => void } = $props();

  const LANG_LABELS: Record<Lang, string> = {
    'uz-Cyrl': 'УЗ', 'uz-Latn': 'UZ', ko: '한', ru: 'RU', en: 'EN',
  };
</script>

<header class="sticky top-0 z-50 bg-white border-b border-hairline h-16 flex items-center">
  <div class="max-w-[640px] mx-auto px-5 w-full flex items-center gap-3">

    {#if onBack}
      <button onclick={onBack}
        class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-hairline mr-1">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
    {/if}

    <!-- Brand wordmark -->
    <button onclick={() => goto('/')} class="flex items-center gap-2 flex-shrink-0">
      <span class="text-[17px] font-black tracking-tight text-brand">FIRMMIT.</span>
      <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-hairline text-ink3 tracking-wide">
        FINO
      </span>
    </button>

    <div class="flex-1" />

    <!-- Language pills -->
    <div class="flex gap-1">
      {#each SUPPORTED_LANGS as code}
        <button
          onclick={() => setLang(code)}
          class="w-8 h-7 rounded-full text-[11px] font-bold transition-all"
          style={$langStore === code
            ? 'background:var(--color-brand); color:#fff'
            : 'color:var(--color-ink3)'}
        >{LANG_LABELS[code]}</button>
      {/each}
    </div>

    <!-- Avatar / settings link -->
    <button onclick={() => goto('/settings')}
      class="w-8 h-8 rounded-full flex items-center justify-center
             text-white text-xs font-bold flex-shrink-0 ml-1"
      style="background:linear-gradient(135deg,#F97316,#EF4444)">
      A
    </button>
  </div>
</header>

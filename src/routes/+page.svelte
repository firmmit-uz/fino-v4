<script lang="ts">
  import { t, setLang, langStore, type Lang } from '$lib/i18n/index.js';
  import { goto } from '$app/navigation';

  const LANGS: { code: Lang; label: string }[] = [
    { code: 'uz-Cyrl', label: 'Ўзбек'   },
    { code: 'uz-Latn', label: "O'zbek"  },
    { code: 'ko',      label: '한국어'   },
    { code: 'ru',      label: 'Русский' },
    { code: 'en',      label: 'English' },
  ];
</script>

<div class="min-h-screen bg-slate-900 text-white flex flex-col">
  <div class="px-6 pt-12 pb-6 text-center">
    <div class="text-5xl font-black tracking-widest mb-2">FINO</div>
    <div class="text-slate-400 text-sm">{$t('app.subtitle')}</div>
  </div>

  <!-- Language bar — shortcuts (layout dropdown is always available too) -->
  <div class="px-4 mb-6">
    <div class="flex gap-2 overflow-x-auto pb-1">
      {#each LANGS as lg}
        <button
          onclick={() => setLang(lg.code)}
          class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors
            {$langStore === lg.code ? 'bg-green-600 border-green-500 text-white' : 'border-slate-600 text-slate-300 hover:border-slate-400'}"
        >{lg.label}</button>
      {/each}
    </div>
  </div>

  <!-- Mode cards -->
  <div class="px-4 flex flex-col gap-4 flex-1 pb-8 max-w-lg mx-auto w-full">
    <button onclick={() => goto('/nursery')} class="w-full rounded-2xl overflow-hidden text-left">
      <div class="bg-gradient-to-br from-green-900 to-green-600 p-6">
        <div class="flex items-center gap-4 mb-3">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">🌱</div>
          <div>
            <div class="text-xl font-bold">{$t('mode.nursery')}</div>
            <div class="text-green-200 text-sm">{$t('mode.nursery_desc')}</div>
          </div>
        </div>
        <div class="flex gap-2 flex-wrap">
          {#each ['S0','S1','S2','S3','S4','S5-1','S5-2','S5-3'] as s}
            <span class="text-xs font-bold bg-green-900/60 text-green-100 px-2 py-0.5 rounded-full">{s}</span>
          {/each}
        </div>
      </div>
      <div class="bg-green-950 px-6 py-3 flex items-center justify-between">
        <span class="text-green-300 text-sm font-semibold">EC 0.4–1.7 {$t('unit.ms_cm')}</span>
        <span class="text-green-400">→</span>
      </div>
    </button>

    <button onclick={() => goto('/main')} class="w-full rounded-2xl overflow-hidden text-left">
      <div class="bg-gradient-to-br from-blue-900 to-blue-600 p-6">
        <div class="flex items-center gap-4 mb-3">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">🍓</div>
          <div>
            <div class="text-xl font-bold">{$t('mode.main')}</div>
            <div class="text-blue-200 text-sm">{$t('mode.main_desc')}</div>
          </div>
        </div>
        <div class="flex gap-2">
          {#each ['S1','S2','S3','S4'] as s}
            <span class="text-xs font-bold bg-blue-900/60 text-blue-100 px-2 py-0.5 rounded-full">{s}</span>
          {/each}
        </div>
      </div>
      <div class="bg-blue-950 px-6 py-3 flex items-center justify-between">
        <span class="text-blue-300 text-sm font-semibold">EC 0.8–1.6 {$t('unit.ms_cm')}</span>
        <span class="text-blue-400">→</span>
      </div>
    </button>

    <div class="rounded-xl bg-slate-800 border border-slate-700 p-4 text-xs text-slate-400">
      <div class="font-bold text-slate-300 mb-1">{$t('label.raw_water_ref')} · {$t('label.raw_water_src')}</div>
      <div>pH 7.6 · EC 0.83 · HCO₃ 3.3 · Ca 2.0 · Mg 0.5 {$t('unit.mmol_l')}</div>
    </div>
  </div>
</div>

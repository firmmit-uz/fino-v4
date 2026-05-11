<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/i18n/index.js';
  import { findStage } from '$lib/engine/stages.js';
  import { calcPrescription, byTank } from '$lib/engine/calc.js';
  import { DEFAULT_RAW, DEFAULT_OPTS } from '$lib/engine/defaults.js';

  const stageId = $derived($page.params.stage ?? '');
  const stage   = $derived(stageId ? findStage('main', stageId) : undefined);
  const result  = $derived(stage ? calcPrescription(stage.target, DEFAULT_RAW, DEFAULT_OPTS) : null);
  const tanks   = $derived(result ? byTank(result.ferts) : null);

  // Procedure steps — shown trilingual on printed worker card (intentional design)
  const STEPS = [
    { ko: '탱크에 깨끗한 물 60–70% 채우기',          uz: 'Idishga toza suv 60–70% quying',                ru: 'Заполнить бак водой 60–70%' },
    { ko: 'B탱크 비료 순서대로 투입',                  uz: "B idishi o'g'itlarini soling",                  ru: 'Внести удобрения бака B' },
    { ko: '교반 5분 — 완전 용해 확인',                 uz: '5 daqiqa aralashtiring',                         ru: 'Перемешивать 5 мин' },
    { ko: 'A탱크 비료 순서대로 투입',                  uz: "A idishi o'g'itlarini soling",                  ru: 'Внести удобрения бака A' },
    { ko: '교반 5분 추가',                             uz: 'Yana 5 daqiqa aralashtiring',                    ru: 'Ещё 5 мин перемешивания' },
    { ko: 'C탱크 산을 별도 희석 후 천천히 첨가 ⚠',    uz: 'C kislotasini alohida suyultirib quying ⚠',     ru: 'Кислоту бака C разбавить, добавить медленно ⚠' },
    { ko: 'EC·pH 측정 — 목표값 확인',                  uz: "EO va rH o'lchang",                              ru: 'Измерить ЭП и pH' },
  ];
</script>

<svelte:head>
  <style>
    @media print { body { margin: 0; } .no-print { display: none; } }
  </style>
</svelte:head>

<div class="bg-white text-black min-h-screen p-8 max-w-3xl mx-auto font-sans">
  {#if !stage || !result}
    <p>Stage not found</p>
  {:else}
  <!-- Header -->
  <div class="border-b-4 border-green-600 pb-4 mb-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-3xl font-black tracking-wide text-green-700">FINO</div>
        <div class="text-sm text-gray-500">{$t('mode.main')} · Main Crop · Asosiy ekin</div>
      </div>
      <div class="text-right">
        <div class="text-xl font-bold">{stageId}</div>
        <div class="text-sm text-gray-600">EC {stage.ecMin}–{stage.ecMax} mS/cm</div>
        <div class="text-green-700 font-bold">EC est. {result.ec.toFixed(2)} mS/cm</div>
      </div>
    </div>
  </div>

  <!-- Tank prescriptions — big text for field workers -->
  <div class="grid grid-cols-3 gap-4 mb-8">
    {#each (['A','B','C'] as const) as tk}
      {#if tanks && Object.keys(tanks[tk]).length > 0}
        <div class="border-2 {tk==='A'?'border-blue-500':tk==='B'?'border-green-500':'border-amber-500'} rounded-xl p-3">
          <div class="text-center font-black text-2xl mb-2
            {tk==='A'?'text-blue-700':tk==='B'?'text-green-700':'text-amber-700'}">
            {$t(`tank.${tk.toLowerCase()}`)}
          </div>
          {#each Object.entries(tanks[tk]) as [id, amt]}
            {#if amt && amt > 0}
              <div class="flex justify-between items-baseline py-1 border-b border-gray-100">
                <span class="text-xs text-gray-600 truncate">{$t(`fert.${id}`)}</span>
                <span class="font-black text-lg ml-2">
                  {#if id === 'hno3' || id === 'h3po4'}
                    {amt.toFixed(0)} mL
                  {:else}
                    {amt < 1 ? (amt * 1000).toFixed(0) + 'g' : amt.toFixed(2) + 'kg'}
                  {/if}
                </span>
              </div>
            {/if}
          {/each}
          {#if tk === 'C'}
            <div class="mt-2 text-xs text-amber-700 font-bold">⚠ {$t('label.acid_dilution')}</div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>

  <!-- 7-step procedure — trilingual for field workers -->
  <div class="mb-6">
    <div class="text-lg font-bold mb-3 text-gray-800">{$t('proc.title', 'procedure')}</div>
    <div class="space-y-3">
      {#each STEPS as step, i}
        <div class="flex gap-3 items-start">
          <div class="w-8 h-8 rounded-full bg-green-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0">{i+1}</div>
          <div class="flex-1">
            <div class="font-semibold text-sm">{step.ko}</div>
            <div class="text-xs text-gray-500">{step.uz}</div>
            <div class="text-xs text-gray-500">{step.ru}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Ion concentrations -->
  <div class="border border-gray-200 rounded-xl overflow-hidden">
    <div class="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600">
      {$t('label.ions')} (mmol/L)
    </div>
    <div class="grid grid-cols-7 text-center">
      {#each [['NO₃', result.ions.NO3], ['NH₄', result.ions.NH4], ['K', result.ions.K], ['Ca', result.ions.Ca], ['Mg', result.ions.Mg], ['H₂PO₄', result.ions.H2PO4], ['SO₄', result.ions.SO4]] as [ion, val]}
        <div class="py-2 border-r border-gray-100 last:border-0">
          <div class="text-xs text-gray-400">{ion}</div>
          <div class="font-bold">{(val as number).toFixed(1)}</div>
        </div>
      {/each}
    </div>
  </div>

  <div class="mt-4 text-xs text-gray-400 text-right">
    FINO v4 · {$t('label.raw_water_src')} · {new Date().toLocaleDateString()}
  </div>
  {/if}
</div>

<div class="no-print fixed bottom-4 right-4">
  <button onclick={() => window.print()} class="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
    🖨 {$t('nav.print')}
  </button>
</div>

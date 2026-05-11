<script lang="ts">
  import { page } from '$app/stores';
  import { findStage } from '$lib/engine/stages.js';
  import { calcPrescription, byTank } from '$lib/engine/calc.js';
  import { DEFAULT_RAW, DEFAULT_OPTS } from '$lib/engine/defaults.js';

  const stageId = $derived($page.params.stage ?? '');
  const stage = $derived(stageId ? findStage('nursery', stageId) : undefined);
  const result = $derived(stage ? calcPrescription(stage.target, DEFAULT_RAW, DEFAULT_OPTS) : null);
  const tanks = $derived(result ? byTank(result.ferts) : null);

  const STEPS = [
    { ko: '탱크에 깨끗한 물 60–70% 채우기',       uz: 'Idishga toza suv 60–70% quying',             ru: 'Заполнить бак водой 60–70%' },
    { ko: 'B탱크 비료 순서대로 투입',                uz: 'B idishi o\'g\'itlarini soling',            ru: 'Внести удобрения бака B' },
    { ko: '교반 5분 — 완전 용해 확인',               uz: '5 daqiqa aralashtiring',                     ru: 'Перемешивать 5 мин' },
    { ko: 'A탱크 비료 순서대로 투입',                uz: 'A idishi o\'g\'itlarini soling',            ru: 'Внести удобрения бака A' },
    { ko: '교반 5분 추가',                           uz: 'Yana 5 daqiqa aralashtiring',                ru: 'Ещё 5 мин перемешивания' },
    { ko: 'C탱크 산 별도 희석 후 천천히 첨가 ⚠',    uz: 'C kislotasini alohida suyultirib quying ⚠',  ru: 'Кислоту C разбавить, добавить медленно ⚠' },
    { ko: 'EC·pH 측정 — 육묘장 목표값 확인',         uz: 'EO va rH o\'lchang — ko\'chat me\'yori',    ru: 'Измерить ЭП и pH — проверить норму питомника' },
  ];
</script>

<svelte:head>
  <style>@media print { .no-print { display: none; } }</style>
</svelte:head>

<div class="bg-white text-black min-h-screen p-8 max-w-3xl mx-auto font-sans">
  {#if !stage || !result}
    <p>Stage not found</p>
  {:else}
  <div class="border-b-4 border-green-600 pb-4 mb-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-3xl font-black tracking-wide text-green-700">FINO</div>
        <div class="text-sm text-gray-500">육묘장 · Nursery · Ko'chat xonasi</div>
      </div>
      <div class="text-right">
        <div class="text-xl font-bold">{stageId}</div>
        {#if stage.dates}<div class="text-xs text-gray-500">{stage.dates}</div>{/if}
        <div class="text-sm text-gray-600">EC {stage.ecMin}–{stage.ecMax} mS/cm</div>
        <div class="text-green-700 font-bold">EC est. {result.ec.toFixed(2)}</div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-3 gap-4 mb-8">
    {#each (['A','B','C'] as const) as tk}
      {#if tanks && Object.keys(tanks[tk]).length > 0}
        <div class="border-2 {tk==='A'?'border-green-600':tk==='B'?'border-teal-500':'border-amber-500'} rounded-xl p-3">
          <div class="text-center font-black text-2xl mb-2
            {tk==='A'?'text-green-700':tk==='B'?'text-teal-700':'text-amber-700'}">{tk}탱크</div>
          {#each Object.entries(tanks[tk]) as [id, amt]}
            {#if amt && amt > 0}
              <div class="flex justify-between items-baseline py-1 border-b border-gray-100">
                <span class="text-xs text-gray-600 truncate">{id}</span>
                <span class="font-black text-lg ml-2">
                  {amt < 1 ? (amt * 1000).toFixed(0) + 'g' : amt.toFixed(2) + 'kg'}
                </span>
              </div>
            {/if}
          {/each}
          {#if tk === 'C'}<div class="mt-2 text-xs text-amber-700 font-bold">⚠ 원액 1:100 희석</div>{/if}
        </div>
      {/if}
    {/each}
  </div>

  <div class="mb-6">
    <div class="text-lg font-bold mb-3">조제 절차 · Procedure</div>
    <div class="space-y-3">
      {#each STEPS as step, i}
        <div class="flex gap-3 items-start">
          <div class="w-8 h-8 rounded-full bg-green-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0">{i+1}</div>
          <div>
            <div class="font-semibold text-sm">{step.ko}</div>
            <div class="text-xs text-gray-500">{step.uz} / {step.ru}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="mt-4 text-xs text-gray-400 text-right">FINO v4 · {new Date().toLocaleDateString()}</div>
  {/if}
</div>

<div class="no-print fixed bottom-4 right-4">
  <button onclick={() => window.print()} class="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">🖨 Print</button>
</div>

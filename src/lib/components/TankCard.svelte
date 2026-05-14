<script lang="ts">
  import type { TankItem } from '$lib/engine/types.js';
  import ChemChip from './ChemChip.svelte';
  import { t } from '$lib/i18n/index.js';

  let {
    tank = 'A' as 'A'|'B'|'C',
    items = [] as TankItem[],
    mode = 'main' as 'main'|'nursery',
  } = $props();

  const COLORS: Record<'A'|'B'|'C', { bg: string; text: string; border: string }> = {
    A: { bg: 'var(--color-tank-a-bg)', text: 'var(--color-tank-a)', border: 'var(--color-tank-a)' },
    B: { bg: 'var(--color-tank-b-bg)', text: 'var(--color-tank-b)', border: 'var(--color-tank-b)' },
    C: { bg: 'var(--color-tank-c-bg)', text: 'var(--color-tank-c)', border: 'var(--color-tank-c)' },
  };
  const cl = $derived(COLORS[tank]);
</script>

<div class="rounded-2xl overflow-hidden border"
     style="border-color:{cl.border}30">
  <!-- Header -->
  <div class="flex items-center gap-3 px-4 py-3"
       style="background:{cl.bg}">
    <div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base"
         style="background:{cl.text}">{tank}</div>
    <div class="flex-1">
      <div class="font-bold text-sm" style="color:{cl.text}">{$t(`tank.${tank.toLowerCase()}`)}</div>
      <div class="text-xs text-ink3">{$t(`tank.${tank.toLowerCase()}_desc`)}</div>
    </div>
    {#if tank === 'C'}
      <span class="text-xs font-bold px-2 py-0.5 rounded-full"
            style="background:var(--color-amber-light); color:var(--color-amber-deep)">
        ⚠ {$t('label.acid_dilution')}
      </span>
    {/if}
  </div>

  <!-- Items -->
  {#each items as item, i}
    <div class="flex items-center gap-3 px-4 py-3 bg-card
                {i < items.length - 1 ? 'border-b border-hairline' : ''}">
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold text-ink truncate">{$t(`fert.${item.id}`)}</div>
        <ChemChip formula={item.formula} />
      </div>
      <div class="text-right tabular-nums">
        <span class="text-lg font-black text-ink">
          {item.unit === 'mL' ? item.amount.toFixed(0) : item.amount < 1 ? (item.amount * 1000).toFixed(0) : item.amount.toFixed(2)}
        </span>
        <span class="text-xs text-ink3 ml-1">
          {item.unit === 'mL' ? $t('unit.ml') : item.amount < 1 ? 'g' : $t('unit.kg')}
        </span>
      </div>
    </div>
  {/each}
</div>

<script lang="ts">
  import type { TankItem } from '$lib/engine/types.js';
  import ChemChip from './ChemChip.svelte';
  import { t } from '$lib/i18n/index.js';

  let {
    tank = 'A' as 'A'|'B'|'C',
    items = [] as TankItem[],
  } = $props();

  // AMIM spec: A=red, B=blue, C=amber
  const GRADIENT: Record<'A'|'B'|'C', string> = {
    A: 'linear-gradient(135deg,#C1121F 0%,#E63946 100%)',
    B: 'linear-gradient(135deg,#1E3FA8 0%,#3365FF 100%)',
    C: 'linear-gradient(135deg,#9A5000 0%,#E6A817 100%)',
  };
  const BG: Record<'A'|'B'|'C', string> = {
    A: 'var(--color-danger-light)',
    B: 'var(--color-brand-surface)',
    C: 'var(--color-amber-light)',
  };
  const ACCENT: Record<'A'|'B'|'C', string> = {
    A: 'var(--color-danger-deep)',
    B: 'var(--color-brand)',
    C: 'var(--color-amber-deep)',
  };
</script>

<div class="rounded-2xl overflow-hidden shadow-sm">
  <!-- Gradient header -->
  <div class="flex items-center gap-3 px-4 py-3"
       style="background:{GRADIENT[tank]}">
    <div class="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center font-black text-white text-lg">
      {tank}
    </div>
    <div class="flex-1">
      <div class="font-bold text-white text-sm">{$t(`tank.${tank.toLowerCase()}`)}</div>
      <div class="text-white/70 text-xs">{$t(`tank.${tank.toLowerCase()}_desc`)}</div>
    </div>
    {#if tank === 'C'}
      <span class="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
        ⚠ 1:100
      </span>
    {/if}
  </div>

  <!-- Items -->
  <div style="background:{BG[tank]}">
    {#each items as item, i}
      <div class="flex items-center gap-3 px-4 py-3 bg-white/60
                  {i < items.length - 1 ? 'border-b border-hairline' : ''}">
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold" style="color:var(--color-ink)">{$t(`fert.${item.id}`)}</div>
          <ChemChip formula={item.formula} />
        </div>
        <div class="text-right tabular-nums">
          <span class="text-lg font-black" style="color:{ACCENT[tank]}">
            {item.unit === 'mL' ? item.amount.toFixed(0) : item.amount < 1 ? (item.amount * 1000).toFixed(0) : item.amount.toFixed(2)}
          </span>
          <span class="text-xs ml-1" style="color:var(--color-ink3)">
            {item.unit === 'mL' ? $t('unit.ml') : item.amount < 1 ? 'g' : $t('unit.kg')}
          </span>
        </div>
      </div>
    {/each}
  </div>
</div>

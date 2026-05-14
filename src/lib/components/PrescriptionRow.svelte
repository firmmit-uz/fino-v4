<script lang="ts">
  import { t } from '$lib/i18n/index.js';

  let {
    tank = 'A' as 'A'|'B'|'C',
    name = '',
    formula = '',
    amount = 0,
    unit = 'kg' as 'kg'|'mL',
  } = $props();

  const TANK_COLOR: Record<'A'|'B'|'C', string> = {
    A: 'var(--color-tank-a)',
    B: 'var(--color-tank-b)',
    C: 'var(--color-tank-c)',
  };

  const displayAmount = $derived(
    unit === 'mL' ? amount.toFixed(0) + ' mL'
    : amount < 1 ? (amount * 1000).toFixed(0) + ' g'
    : amount.toFixed(2) + ' kg'
  );
</script>

<div class="flex items-center gap-3 py-3 border-b border-hairline last:border-0">
  <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
       style="background:{TANK_COLOR[tank]}">{tank}</div>
  <div class="flex-1 min-w-0">
    <div class="text-sm font-semibold text-ink">{name}</div>
    {#if formula}
      <span class="text-xs font-mono text-ink3">{formula}</span>
    {/if}
  </div>
  <span class="text-sm font-black text-ink tabular-nums">{displayAmount}</span>
</div>

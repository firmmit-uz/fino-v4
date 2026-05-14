<script lang="ts">
  import type { RawWater, TargetIons } from '$lib/engine/types.js';
  import { t } from '$lib/i18n/index.js';

  let {
    ions = {} as Partial<RawWater>,
    target = undefined as TargetIons | undefined,
  } = $props();

  const ROWS = [
    { key: 'NO3' as keyof RawWater,   label: 'NO₃', tKey: 'NO3' as keyof TargetIons },
    { key: 'NH4' as keyof RawWater,   label: 'NH₄', tKey: 'NH4' as keyof TargetIons },
    { key: 'K' as keyof RawWater,     label: 'K',   tKey: 'K' as keyof TargetIons },
    { key: 'Ca' as keyof RawWater,    label: 'Ca',  tKey: 'Ca' as keyof TargetIons },
    { key: 'Mg' as keyof RawWater,    label: 'Mg',  tKey: 'Mg' as keyof TargetIons },
    { key: 'H2PO4' as keyof RawWater, label: 'H₂PO₄', tKey: 'H2PO4' as keyof TargetIons },
    { key: 'SO4' as keyof RawWater,   label: 'SO₄', tKey: 'SO4' as keyof TargetIons },
  ];
</script>

<div class="bg-card rounded-2xl border border-hairline overflow-hidden">
  <div class="px-4 py-2.5 bg-hairline text-xs font-bold text-ink3 uppercase tracking-wide">
    {$t('label.ions')} ({$t('unit.mmol_l')})
  </div>
  <div class="grid grid-cols-7">
    {#each ROWS as row}
      {@const val = ions[row.key] as number | undefined}
      {@const tgt = target ? target[row.tKey] as number : undefined}
      <div class="py-3 text-center border-r border-hairline last:border-0">
        <div class="text-[10px] text-ink3 mb-0.5">{row.label}</div>
        <div class="text-sm font-bold text-ink">{val?.toFixed(1) ?? '–'}</div>
        {#if tgt !== undefined}
          <div class="text-[10px] text-ink4">({tgt})</div>
        {/if}
      </div>
    {/each}
  </div>
</div>

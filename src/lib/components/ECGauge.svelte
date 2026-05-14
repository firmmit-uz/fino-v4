<script lang="ts">
  let {
    value = 0,
    min = 0,
    max = 3.5,
    color = 'var(--color-brand)',
    label = 'EC est.',
    unit = 'mS/cm',
  }: { value?: number; min?: number; max?: number; color?: string; label?: string; unit?: string } = $props();

  const pct = $derived(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)));
  const display = $derived(value.toFixed(2));
</script>

<div class="bg-card rounded-2xl p-4 border border-hairline">
  <div class="flex items-end justify-between mb-3">
    <span class="text-xs font-semibold text-ink3 uppercase tracking-wide">{label}</span>
    <div class="text-right">
      <span class="text-2xl font-black" style="color:{color}">{display}</span>
      <span class="text-xs text-ink3 ml-1">{unit}</span>
    </div>
  </div>
  <!-- Track -->
  <div class="h-2 bg-hairline rounded-full overflow-hidden">
    <div class="h-full rounded-full transition-all duration-500"
         style="width:{pct}%; background:{color}"></div>
  </div>
  <div class="flex justify-between mt-1">
    <span class="text-[10px] text-ink4">{min}</span>
    <span class="text-[10px] text-ink4">{max}</span>
  </div>
</div>

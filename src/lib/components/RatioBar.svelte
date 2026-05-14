<script lang="ts">
  let {
    label = '',
    value = 0,
    max = 2,
    safeMax = 1.65,
    color = 'var(--color-brand)',
  }: { label?: string; value?: number; max?: number; safeMax?: number; color?: string } = $props();

  const pct     = $derived(Math.min(100, (value / max) * 100));
  const safePct = $derived(Math.min(100, (safeMax / max) * 100));
  const over    = $derived(value > safeMax);
</script>

<div>
  <div class="flex items-center justify-between mb-1">
    <span class="text-xs text-ink3 font-semibold">{label}</span>
    <span class="text-sm font-bold" style="color:{over ? 'var(--color-danger)' : color}">
      {value.toFixed(2)}
    </span>
  </div>
  <div class="relative h-2 bg-hairline rounded-full overflow-visible">
    <!-- Fill -->
    <div class="absolute inset-y-0 left-0 rounded-full"
         style="width:{pct}%; background:{over ? 'var(--color-danger)' : color}"></div>
    <!-- Safe marker -->
    <div class="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-amber-deep/60"
         style="left:{safePct}%"></div>
  </div>
</div>

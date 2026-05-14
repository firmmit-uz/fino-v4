<script lang="ts">
  let {
    icon = '',
    label = '',
    sub = '',
    color = 'var(--color-brand)',
    bgColor = 'var(--color-brand-surface)',
    onclick,
  }: {
    icon?: string; label?: string; sub?: string;
    color?: string; bgColor?: string; onclick?: () => void;
  } = $props();
</script>

<button {onclick}
  class="flex flex-col items-start p-4 rounded-2xl border border-hairline bg-card
         active:scale-95 transition-transform text-left w-full">
  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
       style="background:{bgColor}; color:{color}">{icon}</div>
  <div class="text-sm font-bold text-ink leading-tight">{label}</div>
  {#if sub}
    <div class="text-xs text-ink3 mt-0.5">{sub}</div>
  {/if}
</button>

<script lang="ts">
  let {
    id = '',
    active = false,
    color = 'var(--color-brand)',
    bgColor = 'var(--color-brand-surface)',
    onclick,
  }: { id?: string; active?: boolean; color?: string; bgColor?: string; onclick?: () => void } = $props();
</script>

<button {onclick}
  class="px-3 py-1 rounded-full text-xs font-bold transition-colors"
  style={active
    ? `background:${color}; color:#fff`
    : `background:${bgColor}; color:${color}`}>
  {id}
</button>

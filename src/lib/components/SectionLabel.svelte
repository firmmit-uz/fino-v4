<script lang="ts">
  let {
    label = '',
    text = '',   // alias for label
    count,
    action = '',
    onaction,
  }: { label?: string; text?: string; count?: number; action?: string; onaction?: () => void } = $props();

  const display = $derived(label || text);
</script>

<div class="flex items-center justify-between mt-6 mb-2">
  <div class="flex items-center gap-2">
    <span class="text-xs font-bold uppercase tracking-wider text-ink3">{display}</span>
    {#if count !== undefined}
      <span class="text-xs font-bold text-brand bg-brand-surface px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    {/if}
  </div>
  {#if action}
    <button onclick={onaction} class="text-xs font-semibold text-brand hover:underline">
      {action}
    </button>
  {/if}
</div>

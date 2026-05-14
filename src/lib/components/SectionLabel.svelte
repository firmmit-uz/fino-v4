<script lang="ts">
  let { label = '', action = '', onaction }: {
    label?: string; action?: string; onaction?: () => void;
  } = $props();
</script>

<div class="flex items-center justify-between mb-2">
  <span class="text-xs font-bold text-ink3 uppercase tracking-wider">{label}</span>
  {#if action}
    <button onclick={onaction} class="text-xs font-semibold text-brand">{action}</button>
  {/if}
</div>

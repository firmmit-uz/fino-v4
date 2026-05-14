<script lang="ts">
  let { formula = '' }: { formula?: string } = $props();
</script>

{#if formula}
  <span class="text-xs font-mono text-ink3 bg-hairline px-1.5 py-0.5 rounded">{formula}</span>
{/if}

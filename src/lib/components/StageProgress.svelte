<script lang="ts">
  let {
    stages = [] as { id: string; c: string }[],
    currentIdx = 0,
    showLabels = true,
  }: { stages?: { id: string; c: string }[]; currentIdx?: number; showLabels?: boolean } = $props();
</script>

<div>
  <!-- Track -->
  <div class="grid gap-1" style="grid-template-columns:repeat({stages.length},1fr)">
    {#each stages as s, i}
      <div class="rounded-full transition-all"
           style="height:{i === currentIdx ? '8px' : '4px'};
                  background:{i <= currentIdx ? s.c : 'var(--color-hairline)'}"></div>
    {/each}
  </div>

  {#if showLabels}
    <div class="grid mt-1.5 gap-1" style="grid-template-columns:repeat({stages.length},1fr)">
      {#each stages as s, i}
        <div class="text-center text-[9px] font-bold leading-tight overflow-hidden"
             style="color:{i === currentIdx ? s.c : 'var(--color-ink4)'}">
          {#if s.id.includes('-')}
            {s.id.split('-')[0]}-<br/>{s.id.split('-')[1]}
          {:else}
            {s.id}
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<script lang="ts">
  let {
    gradient = 'linear-gradient(135deg,#1E3FA8 0%,#3365FF 100%)',
    title = '',
    subtitle = '',
    badge = '',
    children,
  }: {
    gradient?: string; title?: string; subtitle?: string; badge?: string;
    children?: import('svelte').Snippet;
  } = $props();
</script>

<div class="rounded-2xl overflow-hidden shadow-sm" style="background:{gradient}">
  <div class="p-5 text-white">
    {#if badge}
      <span class="inline-block mb-3 px-2.5 py-0.5 rounded-full bg-white/20
                   text-xs font-bold tracking-wide">{badge}</span>
    {/if}
    {#if title}
      <div class="text-xl font-bold leading-tight mb-1">{title}</div>
    {/if}
    {#if subtitle}
      <div class="text-sm opacity-80">{subtitle}</div>
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<script lang="ts">
  import { goto } from '$app/navigation';

  let {
    variant = 'blue' as 'green-dark' | 'green-light' | 'blue',
    badge = '',
    title = '',
    sub = '',
    href = '',
    gradient = '',
  }: {
    variant?: 'green-dark' | 'green-light' | 'blue';
    badge?: string; title?: string; sub?: string;
    href?: string; gradient?: string;
  } = $props();

  const GRADIENTS = {
    'green-dark':  'linear-gradient(135deg, #14532D 0%, #16A34A 100%)',
    'green-light': 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
    'blue':        'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
  };

  const bg = $derived(gradient || GRADIENTS[variant]);
</script>

<button
  onclick={() => href && goto(href)}
  class="w-full text-left rounded-2xl overflow-hidden
         hover:scale-[1.01] active:scale-[0.99] transition-transform duration-150 cursor-pointer"
  style="background:{bg}"
>
  <div class="p-5 relative">
    <!-- Arrow icon top-right -->
    <div class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
         style="background:rgba(255,255,255,0.18)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="white" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
    </div>

    <!-- Badge pill -->
    {#if badge}
      <div class="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full text-[13px] font-semibold text-white"
           style="background:rgba(255,255,255,0.2)">
        {badge}
      </div>
    {/if}

    <!-- Title -->
    <div class="text-[26px] font-black text-white leading-tight mb-1.5 pr-10">
      {title}
    </div>

    <!-- Sub -->
    <div class="text-[14px] text-white/80 font-medium">{sub}</div>
  </div>
</button>

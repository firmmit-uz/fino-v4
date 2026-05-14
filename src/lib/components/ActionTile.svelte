<script lang="ts">
  import { goto } from '$app/navigation';

  let {
    icon = '',
    label = '',
    sub = '',
    href = '',
    color = 'var(--color-brand)',
    bgColor = 'var(--color-brand-light)',
    onclick: handleClick,
  }: {
    icon?: string; label?: string; sub?: string; href?: string;
    color?: string; bgColor?: string; onclick?: () => void;
  } = $props();

  function click() {
    if (handleClick) handleClick();
    else if (href) goto(href);
  }
</script>

<button onclick={click}
  class="bg-white rounded-2xl border border-hairline p-4 text-left w-full
         hover:border-brand/30 hover:shadow-sm active:scale-[0.98] transition-all">
  <!-- Icon box -->
  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
       style="background:{bgColor}; color:{color}">{icon}</div>
  <!-- Labels -->
  <div class="text-sm font-bold text-ink leading-tight">{label}</div>
  {#if sub}
    <div class="text-xs text-ink3 mt-0.5">{sub}</div>
  {/if}
</button>

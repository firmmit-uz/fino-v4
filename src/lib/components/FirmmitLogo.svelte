<script lang="ts">
  /**
   * FIRMMIT brand wordmark — uses official PNG (5982×1031 aspect ratio).
   * variant: 'blue' (default, on white bg) | 'white' (on dark/color bg) | 'black' (print)
   * height: rendered height in px (width scales automatically by aspect ratio)
   * pill: optional label pill shown to the right (e.g. "FINO")
   */
  type Variant = 'blue' | 'white' | 'black';
  let { variant = 'blue' as Variant, height = 28, pill = '' } = $props<{
    variant?: Variant; height?: number; pill?: string;
  }>();

  const src = `/logos/firmmit-${variant}.png`;
  const width = Math.round(height * 5.803); // 5982 / 1031
</script>

<div class="flex items-center gap-2 flex-shrink-0">
  <img
    {src}
    alt="FIRMMIT"
    {height}
    {width}
    class="select-none block"
    draggable="false"
  />
  {#if pill}
    <span class="text-xs font-bold text-ink3 bg-hairline px-2 py-0.5 rounded-full tracking-wider leading-none">
      {pill}
    </span>
  {/if}
</div>

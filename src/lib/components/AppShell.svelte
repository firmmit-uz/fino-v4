<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<!-- Phone-shape container: 390×844 on desktop, full-screen on mobile -->
<div class="min-h-screen flex items-center justify-center"
     style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%)">
  <div class="relative flex flex-col overflow-hidden bg-bg"
       style="width:min(390px,100vw); height:min(844px,100svh);
              border-radius:clamp(0px, calc((100vw - 390px)*9999), 44px);
              box-shadow:0 32px 96px rgba(0,0,0,.6),0 0 0 8px rgba(255,255,255,.06)">
    {@render children()}
  </div>
</div>

<script lang="ts">
  import { t } from '$lib/i18n/index.js';

  let { name = '' }: { name?: string } = $props();

  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const hour = now.getHours();
  const greetKey = hour < 12 ? 'home.greeting' : hour < 17 ? 'home.greeting' : 'home.greeting';
</script>

<div class="px-4 pt-4 pb-2">
  <div class="text-xs text-ink3 font-semibold">{dateStr}</div>
  <div class="text-xl font-bold text-ink mt-0.5">
    {$t(greetKey)}{name ? `, ${name}` : ''}
  </div>
</div>

<script lang="ts">
  import { t } from '$lib/i18n/index.js';

  let { name = 'Амиrhon' }: { name?: string } = $props();

  const now = new Date();
  const dateStr = now.toLocaleDateString($t('app.name') === 'FINO' ? 'ko-KR' : undefined, {
    month: 'long', day: 'numeric', weekday: 'short',
  });
</script>

<div class="pt-2 pb-4">
  <div class="text-[11px] font-semibold text-ink3 uppercase tracking-wider mb-1">
    {dateStr}
  </div>
  <div class="text-[28px] font-black text-ink leading-tight">
    {$t('home.greeting')}
  </div>
  {#if name}
    <div class="text-sm text-ink3 mt-1 font-medium">{name} · Staff</div>
  {/if}
</div>

<script lang="ts">
  import type { Season } from '$lib/engine/focus.js';
  import { t } from '$lib/i18n/index.js';

  let { season = 'summer' as Season }: { season?: Season } = $props();

  const isSummer = $derived(season === 'summer');
  const gradient = $derived(isSummer
    ? 'linear-gradient(135deg,#D97C4A 0%,#E89722 100%)'
    : 'linear-gradient(135deg,#1E3FA8 0%,#3365FF 100%)');
  const icon     = $derived(isSummer ? '☀' : '❄');
  const factor   = $derived(isSummer ? '×1.0' : '×0.85');
</script>

<div class="rounded-xl p-3 flex items-center gap-3"
     style="background:{gradient}">
  <div class="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-xl">{icon}</div>
  <div class="flex-1">
    <div class="text-sm font-bold text-white">
      {isSummer ? $t('winter.summer_mode') : $t('winter.winter_mode')}
    </div>
    <div class="text-xs text-white/80">
      {isSummer ? $t('winter.summer_desc') : $t('winter.winter_desc')}
    </div>
  </div>
  <div class="text-lg font-black text-white/90">{factor}</div>
</div>

<script lang="ts">
  import type { Warning } from '$lib/engine/types.js';
  import { t } from '$lib/i18n/index.js';

  let { warnings = [] as Warning[] }: { warnings?: Warning[] } = $props();

  function warnClass(level: string) {
    if (level === 'P0') return 'bg-danger-light border-danger/40 text-danger-deep';
    if (level === 'P1' || level === 'P2') return 'bg-amber-light border-amber/40 text-amber-deep';
    return 'bg-hairline border-border text-ink3';
  }
</script>

{#each warnings as w}
  <div class="rounded-xl border px-4 py-3 flex items-start gap-2 text-sm font-semibold {warnClass(w.level)}">
    <span class="flex-shrink-0">⚠</span>
    <span>{$t('warning.' + w.code.toLowerCase(), 'common', w.params)}</span>
  </div>
{/each}

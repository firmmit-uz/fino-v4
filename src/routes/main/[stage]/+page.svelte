<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { findStage } from '$lib/engine/stages.js';
  import { calcPrescription, byTank } from '$lib/engine/calc.js';
  import { DEFAULT_RAW, DEFAULT_OPTS } from '$lib/engine/defaults.js';
  import { settings } from '$lib/stores/settings.js';
  import { findVariety } from '$lib/engine/varieties.js';
  import { findFocus, WINTER_FACTOR } from '$lib/engine/focus.js';
  import type { RawWater, TargetIons } from '$lib/engine/types.js';
  import TopBar from '$lib/components/TopBar.svelte';
  import ECGauge from '$lib/components/ECGauge.svelte';
  import RatioBar from '$lib/components/RatioBar.svelte';
  import TankCard from '$lib/components/TankCard.svelte';
  import IonTable from '$lib/components/IonTable.svelte';
  import WarningBubble from '$lib/components/WarningBubble.svelte';
  import SectionLabel from '$lib/components/SectionLabel.svelte';

  const stageId = $derived($page.params.stage ?? '');
  const stage   = $derived(stageId ? findStage('main', stageId) : undefined);

  let raw = $state<RawWater>({ ...DEFAULT_RAW });
  let showRawEdit = $state(false);

  // Apply variety × focus × winter modifiers
  const modifiedTarget = $derived((): TargetIons | undefined => {
    if (!stage) return undefined;
    const s = $settings;
    const vMod = s.variety;
    const fMod = s.focus;
    const ef   = WINTER_FACTOR[s.season];
    const t    = stage.target;
    return {
      ...t,
      NO3:   t.NO3   * vMod.no3Mod * fMod.no3Mod * ef,
      NH4:   t.NH4   * ef,
      K:     t.K     * vMod.kMod   * fMod.kMod,
      Ca:    t.Ca    * vMod.caMod  * fMod.caMod,
      Mg:    t.Mg,
      H2PO4: t.H2PO4 * fMod.h2po4Mod,
      SO4:   t.SO4,
    };
  });

  const result = $derived(modifiedTarget() ? calcPrescription(modifiedTarget()!, raw, { ...DEFAULT_OPTS, calcinit: $settings.calcinit, feSource: $settings.feSource, mgSource: $settings.mgSource }) : null);
  const tanks  = $derived(result ? byTank(result.ferts) : null);
  const kca    = $derived(result ? result.ions.K / result.ions.Ca : 0);
</script>

{#if !stage}
  <div class="min-h-screen bg-bg flex items-center justify-center">
    <p class="text-ink3">{$t('label.stage_not_found')}</p>
  </div>
{:else}
<div class="min-h-screen bg-bg pb-8">
  <TopBar mode="main" onBack={() => goto('/main')} />

  <!-- Hero -->
  <div class="px-4 py-4">
    <div class="flex items-start justify-between mb-1">
      <div>
        <div class="text-xl font-bold text-ink">{$t(stage.label, 'stages')}</div>
        <div class="text-sm text-ink3">EC {stage.ecMin}–{stage.ecMax} {$t('unit.ms_cm')}</div>
      </div>
      <a href="/print/main/{stageId}" target="_blank"
         class="px-3 py-1.5 rounded-xl bg-brand-surface text-brand text-sm font-bold">
        🖨 {$t('nav.print')}
      </a>
    </div>

    {#if $settings.variety.id !== 'other' || $settings.focus.id !== 'balanced' || $settings.season !== 'summer'}
      <div class="flex gap-2 flex-wrap mt-2">
        <span class="px-2 py-0.5 rounded-full bg-brand-surface text-brand text-xs font-bold">
          {$t($settings.variety.labelKey)}
        </span>
        <span class="px-2 py-0.5 rounded-full bg-nursery-surface text-nursery text-xs font-bold">
          {$t($settings.focus.labelKey)}
        </span>
        {#if $settings.season === 'winter'}
          <span class="px-2 py-0.5 rounded-full bg-brand-surface text-brand-deep text-xs font-bold">❄ ×0.85</span>
        {/if}
      </div>
    {/if}
  </div>

  <div class="px-4 flex flex-col gap-4">
    {#if result}
      <!-- EC + K/Ca -->
      <ECGauge value={result.ec} color="var(--color-brand)" label={$t('label.ec_est')} unit={$t('unit.ms_cm')} />
      <div class="bg-card rounded-2xl border border-hairline p-4">
        <RatioBar label="K/Ca" value={kca} max={2} safeMax={$settings.variety.kcaSafe} color="var(--color-brand)" />
      </div>

      <WarningBubble warnings={result.warnings} />

      <!-- Tank cards -->
      <SectionLabel label={$t('label.prescription')} />
      {#each (['A','B','C'] as const) as tk}
        {#if tanks && tanks[tk].length > 0}
          <TankCard tank={tk} items={tanks[tk]} />
        {/if}
      {/each}

      <!-- Ion table -->
      <IonTable ions={result.ions} target={modifiedTarget()} />
    {/if}

    <!-- Raw water edit -->
    <button onclick={() => showRawEdit = !showRawEdit}
            class="text-sm font-semibold text-brand text-left">
      {showRawEdit ? '▲' : '▼'} {$t('label.edit_raw')}
    </button>
    {#if showRawEdit}
      <div class="bg-card rounded-2xl border border-hairline p-4 grid grid-cols-2 gap-3">
        {#each (['pH','EC','NO3','NH4','K','Ca','Mg','H2PO4','SO4','HCO3','Na','Cl'] as const) as key}
          <label class="flex flex-col gap-1">
            <span class="text-xs text-ink3">{key}</span>
            <input type="number" step="0.1" min="0" bind:value={raw[key]}
              class="bg-hairline rounded-lg px-3 py-1.5 text-sm text-ink w-full" />
          </label>
        {/each}
        <button onclick={() => { raw = { ...DEFAULT_RAW }; }}
          class="col-span-2 py-2 rounded-xl bg-hairline text-ink3 text-sm font-semibold">
          {$t('label.reset_raw')}
        </button>
      </div>
    {/if}
  </div>
</div>
{/if}

<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { findStage } from '$lib/engine/stages.js';
  import { calcPrescription, byTank } from '$lib/engine/calc.js';
  import { DEFAULT_RAW, DEFAULT_OPTS } from '$lib/engine/defaults.js';
  import { settings } from '$lib/stores/settings.js';
  import { WINTER_FACTOR } from '$lib/engine/focus.js';
  import type { RawWater, TargetIons } from '$lib/engine/types.js';
  import TopBar from '$lib/components/TopBar.svelte';
  import ECGauge from '$lib/components/ECGauge.svelte';
  import RatioBar from '$lib/components/RatioBar.svelte';
  import TankCard from '$lib/components/TankCard.svelte';
  import IonTable from '$lib/components/IonTable.svelte';
  import WarningBubble from '$lib/components/WarningBubble.svelte';
  import SectionLabel from '$lib/components/SectionLabel.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';

  const stageId = $derived($page.params.stage ?? '');
  const stage   = $derived(stageId ? findStage('nursery_indoor', stageId) : undefined);
  let raw = $state<RawWater>({ ...DEFAULT_RAW });

  const modifiedTarget = $derived((): TargetIons | undefined => {
    if (!stage) return undefined;
    const { variety: v, focus: f, season } = $settings;
    const ef = WINTER_FACTOR[season];
    const tg = stage.target;
    return { ...tg, NO3: tg.NO3*v.no3Mod*f.no3Mod*ef, NH4: tg.NH4*ef,
             K: tg.K*v.kMod*f.kMod, Ca: tg.Ca*v.caMod*f.caMod, H2PO4: tg.H2PO4*f.h2po4Mod, Mg: tg.Mg, SO4: tg.SO4 };
  });

  const result = $derived(modifiedTarget()
    ? calcPrescription(modifiedTarget()!, raw, { ...DEFAULT_OPTS, calcinit: $settings.calcinit, feSource: $settings.feSource, mgSource: $settings.mgSource })
    : null);
  const tanks = $derived(result ? byTank(result.ferts) : null);
  const kca   = $derived(result ? result.ions.K / result.ions.Ca : 0);
</script>

{#if !stage}
  <div class="flex-1 flex items-center justify-center">
    <p class="text-ink3">{$t('label.stage_not_found')}</p>
  </div>
{:else}
<div class="flex flex-col flex-1 overflow-hidden">
  <TopBar mode="nursery_indoor" onBack={() => goto('/nursery/indoor')} />
  <div class="flex-1 overflow-y-auto">
    <div class="px-4 pt-4 pb-2">
      <div class="flex items-start justify-between">
        <div>
          <div class="text-xl font-bold text-ink">{$t(stage.label, 'stages')}</div>
          {#if stage.dates}<div class="text-xs font-semibold" style="color:#10B981">{stage.dates} · 실내</div>{/if}
          <div class="text-sm text-ink3">EC {stage.ecMin}–{stage.ecMax} · Ca {stage.target.Ca}</div>
        </div>
        <a href="/print/nursery/{stageId}" target="_blank"
           class="px-3 py-1.5 rounded-xl text-sm font-bold" style="background:#D1FAE5; color:#065F46">🖨</a>
      </div>
    </div>
    <div class="px-4 flex flex-col gap-4 pb-4">
      {#if result}
        <ECGauge value={result.ec} color="#10B981" label={$t('label.ec_est')} unit={$t('unit.ms_cm')} />
        <div class="bg-card rounded-2xl border border-hairline p-4">
          <RatioBar label="K/Ca" value={kca} max={2} safeMax={$settings.variety.kcaSafe} color="#10B981" />
        </div>
        <WarningBubble warnings={result.warnings} />
        <SectionLabel label={$t('label.prescription')} />
        {#each (['A','B','C'] as const) as tk}
          {#if tanks && tanks[tk].length > 0}<TankCard tank={tk} items={tanks[tk]} />{/if}
        {/each}
        <IonTable ions={result.ions} target={modifiedTarget()} />
      {/if}
    </div>
  </div>
  <BottomNav active="rx" mode="nursery_indoor" />
</div>
{/if}

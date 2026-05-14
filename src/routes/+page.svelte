<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { settings } from '$lib/stores/settings.js';
  import TopBar from '$lib/components/TopBar.svelte';
  import Greeting from '$lib/components/Greeting.svelte';
  import StatementCard from '$lib/components/StatementCard.svelte';
  import ActionTile from '$lib/components/ActionTile.svelte';
  import SectionLabel from '$lib/components/SectionLabel.svelte';
  import SeasonBand from '$lib/components/SeasonBand.svelte';
</script>

<div class="min-h-screen bg-bg pb-6">
  <TopBar />
  <Greeting />

  <!-- Season band -->
  <div class="px-4 mb-4">
    <SeasonBand season={$settings.season} />
  </div>

  <!-- Mode hero cards -->
  <div class="px-4 mb-4 flex flex-col gap-3">
    <button onclick={() => goto('/nursery')} class="text-left active:scale-98 transition-transform">
      <StatementCard
        gradient="linear-gradient(135deg,#14532D 0%,#16A34A 100%)"
        badge="🌱 {$t('mode.nursery')}"
        title={$t('mode.nursery_desc')}
        subtitle="S1 → S4 · v4.3 NPK→PK"
      />
    </button>
    <button onclick={() => goto('/main')} class="text-left active:scale-98 transition-transform">
      <StatementCard
        gradient="linear-gradient(135deg,#1E3FA8 0%,#3365FF 100%)"
        badge="🍓 {$t('mode.main')}"
        title={$t('mode.main_desc')}
        subtitle="S1 → S4 · v2.14 standard"
      />
    </button>
  </div>

  <!-- Quick actions -->
  <div class="px-4 mb-4">
    <SectionLabel label={$t('home.today')} />
    <div class="grid grid-cols-2 gap-3">
      <ActionTile
        icon="🌿"
        label={$t('mode.nursery')}
        sub="S{$t('label.stage')} ·  EC 0.8"
        color="var(--color-nursery)"
        bgColor="var(--color-nursery-surface)"
        onclick={() => goto('/nursery/S2')}
      />
      <ActionTile
        icon="🍓"
        label={$t('mode.main')}
        sub="S2 · EC 1.1"
        color="var(--color-brand)"
        bgColor="var(--color-brand-surface)"
        onclick={() => goto('/main/S2')}
      />
      <ActionTile
        icon="⚙️"
        label={$t('settings.title')}
        sub={$t($settings.variety.labelKey) + ' · ' + $t($settings.focus.labelKey)}
        onclick={() => goto('/settings')}
      />
      <ActionTile
        icon="🔬"
        label="Debug"
        sub="v4 baseline"
        onclick={() => goto('/debug')}
      />
    </div>
  </div>

  <!-- Raw water info -->
  <div class="px-4">
    <SectionLabel label={$t('label.raw_water_ref')} />
    <div class="bg-card rounded-2xl border border-hairline p-4 text-xs text-ink3">
      <span class="font-semibold text-ink2">{$t('label.raw_water_src')}</span>
      <div class="mt-1">pH 7.6 · EC 0.83 {$t('unit.ms_cm')} · HCO₃ 3.3 · Ca 2.0 · Mg 0.5 {$t('unit.mmol_l')}</div>
    </div>
  </div>
</div>

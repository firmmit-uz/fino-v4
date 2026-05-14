<script lang="ts">
  import { t } from '$lib/i18n/index.js';
  import { settings } from '$lib/stores/settings.js';
  import Greeting from '$lib/components/Greeting.svelte';
  import StatementCard from '$lib/components/StatementCard.svelte';
  import ActionTile from '$lib/components/ActionTile.svelte';
  import SectionLabel from '$lib/components/SectionLabel.svelte';
</script>

<!-- Greeting -->
<Greeting />

<!-- 3 Hero StatementCards -->
<div class="flex flex-col gap-3 mb-1">
  <StatementCard
    variant="green-dark"
    badge="🌿 {$t('mode.nursery_field')}"
    title={$t('mode.nursery_field_desc')}
    sub="v4.3 NPK→PK · S1–S4"
    href="/nursery/field"
  />
  <StatementCard
    variant="green-light"
    badge="🏠 {$t('mode.nursery_indoor')}"
    title={$t('mode.nursery_indoor_desc')}
    sub="Bot 1983 · Ca+0.3 NH4−0.1"
    href="/nursery/indoor"
  />
  <StatementCard
    variant="blue"
    badge="🍓 {$t('mode.main')}"
    title={$t('mode.main_desc')}
    sub="v2.14 standard · S1–S4"
    href="/main"
  />
</div>

<!-- Quick actions -->
<SectionLabel text={$t('home.today')} />
<div class="grid grid-cols-2 gap-3">
  <ActionTile
    icon="⚙️"
    label={$t('settings.title')}
    sub={$t($settings.variety.labelKey) + ' · ' + $t($settings.focus.labelKey)}
    href="/settings"
    bgColor="var(--color-brand-light)"
    color="var(--color-brand)"
  />
  <ActionTile
    icon="🔬"
    label="Debug"
    sub="v4 baseline"
    href="/debug"
    bgColor="var(--color-hairline)"
    color="var(--color-ink3)"
  />
</div>

<!-- Raw water reference -->
<SectionLabel text={$t('label.raw_water_ref')} />
<div class="rounded-2xl bg-white border border-hairline p-4">
  <div class="font-bold text-ink text-sm mb-1">{$t('label.raw_water_src')}</div>
  <div class="text-ink3 text-sm">
    pH 7.6 · EC 0.83 {$t('unit.ms_cm')} · HCO₃ 3.3 · Ca 2.0 · Mg 0.5 {$t('unit.mmol_l')}
  </div>
</div>

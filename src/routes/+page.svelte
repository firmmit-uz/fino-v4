<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { settings } from '$lib/stores/settings.js';
  import TopBar from '$lib/components/TopBar.svelte';
  import Greeting from '$lib/components/Greeting.svelte';
  import StatementCard from '$lib/components/StatementCard.svelte';
  import ActionTile from '$lib/components/ActionTile.svelte';
  import SectionLabel from '$lib/components/SectionLabel.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
</script>

<div class="flex flex-col flex-1 overflow-hidden">
  <TopBar />

  <div class="flex-1 overflow-y-auto pb-2">
    <Greeting />

    <!-- 3 Hero Cards -->
    <div class="px-4 flex flex-col gap-3 mb-4">
      <!-- Field nursery -->
      <button onclick={() => goto('/nursery/field')} class="text-left active:scale-98 transition-transform">
        <StatementCard
          gradient="linear-gradient(135deg,#14532D 0%,#16A34A 100%)"
          badge="🌿 {$t('mode.nursery_field')}"
          title={$t('mode.nursery_field_desc')}
          subtitle="v4.3 NPK→PK · S1–S4"
        />
      </button>
      <!-- Indoor nursery -->
      <button onclick={() => goto('/nursery/indoor')} class="text-left active:scale-98 transition-transform">
        <StatementCard
          gradient="linear-gradient(135deg,#065F46 0%,#10B981 100%)"
          badge="🏠 {$t('mode.nursery_indoor')}"
          title={$t('mode.nursery_indoor_desc')}
          subtitle="Bot 1983 · Ca+0.3 NH4−0.1"
        />
      </button>
      <!-- Main crop -->
      <button onclick={() => goto('/main')} class="text-left active:scale-98 transition-transform">
        <StatementCard
          gradient="linear-gradient(135deg,#1E3FA8 0%,#3365FF 100%)"
          badge="🍓 {$t('mode.main')}"
          title={$t('mode.main_desc')}
          subtitle="v2.14 standard · S1–S4"
        />
      </button>
    </div>

    <!-- Quick actions -->
    <div class="px-4 mb-4">
      <SectionLabel label={$t('home.today')} />
      <div class="grid grid-cols-2 gap-3">
        <ActionTile icon="⚙️" label={$t('settings.title')}
          sub={$t($settings.variety.labelKey) + ' · ' + $t($settings.focus.labelKey)}
          onclick={() => goto('/settings')} />
        <ActionTile icon="🔬" label="Debug" sub="v4 baseline"
          onclick={() => goto('/debug')} />
      </div>
    </div>

    <!-- Raw water reference -->
    <div class="px-4">
      <SectionLabel label={$t('label.raw_water_ref')} />
      <div class="bg-card rounded-2xl border border-hairline p-4 text-xs text-ink3">
        <span class="font-semibold text-ink2">{$t('label.raw_water_src')}</span>
        <div class="mt-1">pH 7.6 · EC 0.83 {$t('unit.ms_cm')} · HCO₃ 3.3 · Ca 2.0 · Mg 0.5 {$t('unit.mmol_l')}</div>
      </div>
    </div>
  </div>

  <BottomNav active="home" />
</div>

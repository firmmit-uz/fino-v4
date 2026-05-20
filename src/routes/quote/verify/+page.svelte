<script lang="ts">
  import { goto } from '$app/navigation';
  import { verifyKsmBaseline, verifyCategoryAnchors } from '$lib/quote/verification.js';
  import SectionLabel from '$lib/components/SectionLabel.svelte';

  const rows = verifyKsmBaseline();
  const matched = rows.filter(r => r.match).length;
  const total = rows.length;

  const anchors = verifyCategoryAnchors();
  const anchorTotalExpected = anchors.reduce((s, a) => s + a.matExpected, 0);
  const anchorTotalComputed = anchors.reduce((s, a) => s + a.matComputed, 0);
  const overallCoverage = anchorTotalComputed / anchorTotalExpected;

  function fmt(v: number | string): string {
    if (typeof v === 'number') return v.toLocaleString('ko-KR');
    return v;
  }

  function coverageColor(c: number): string {
    if (c >= 0.85) return '#15803D';   // green
    if (c >= 0.50) return '#B45309';   // amber
    return '#991B1B';                  // red
  }
</script>

<div class="flex items-center gap-3 mb-3">
  <button onclick={() => goto('/quote')} aria-label="뒤로"
    class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-hairline">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.5"><path d="M15 6l-6 6 6 6"/></svg>
  </button>
  <div class="text-lg font-black">§5.2 강석문 베이스라인 검증</div>
</div>

<!-- Summary -->
<div class="rounded-2xl p-4 mb-3"
  style="background:{matched === total ? '#DCFCE7' : '#FEF3C7'}">
  <div class="text-xs font-bold mb-1"
    style="color:{matched === total ? '#15803D' : '#92400E'}">
    {matched === total ? '✅ 전체 일치' : `⚠ ${matched} / ${total} 일치`}
  </div>
  <div class="text-sm" style="color:{matched === total ? '#14532D' : '#92400E'}">
    입력: 35m × 96m, 동폭 7m, 측고 4m, 기둥간격 3m → 면적 3,360㎡
  </div>
</div>

<SectionLabel text="항목별 비교" />
<div class="rounded-2xl bg-white border border-hairline overflow-hidden">
  <table class="w-full text-xs">
    <thead class="bg-hairline">
      <tr class="text-left text-ink3">
        <th class="px-3 py-2 font-semibold">항목</th>
        <th class="px-3 py-2 font-semibold text-right">§5.2 기대</th>
        <th class="px-3 py-2 font-semibold text-right">계산</th>
        <th class="px-3 py-2 font-semibold text-right">차이</th>
        <th class="px-3 py-2 font-semibold text-center">결과</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as r}
        <tr class="border-t border-hairline"
          style="background:{r.match ? 'transparent' : '#FEF3C7'}">
          <td class="px-3 py-2">
            <div class="font-medium">{r.label}</div>
            {#if r.note}
              <div class="text-[10px] text-ink3 mt-0.5">{r.note}</div>
            {/if}
          </td>
          <td class="px-3 py-2 text-right font-mono">{fmt(r.expected)}</td>
          <td class="px-3 py-2 text-right font-mono font-semibold">{fmt(r.computed)}</td>
          <td class="px-3 py-2 text-right font-mono"
            style="color:{r.match ? '#15803D' : '#B45309'}">
            {typeof r.diff === 'number' && r.diff !== 0
              ? (r.diff > 0 ? '+' : '') + fmt(r.diff) : fmt(r.diff)}
          </td>
          <td class="px-3 py-2 text-center">
            {r.match ? '✅' : '⚠'}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<SectionLabel text="§3.5 11개 공정별 자재비 anchor" />
<div class="rounded-2xl bg-white border border-hairline overflow-hidden">
  <table class="w-full text-xs">
    <thead class="bg-hairline">
      <tr class="text-left text-ink3">
        <th class="px-3 py-2 font-semibold">공정</th>
        <th class="px-3 py-2 font-semibold text-right">§3.5 자재비</th>
        <th class="px-3 py-2 font-semibold text-right">계산</th>
        <th class="px-3 py-2 font-semibold text-right">갭</th>
        <th class="px-3 py-2 font-semibold text-right">달성률</th>
      </tr>
    </thead>
    <tbody>
      {#each anchors as a}
        <tr class="border-t border-hairline">
          <td class="px-3 py-2 font-medium">{a.label}</td>
          <td class="px-3 py-2 text-right font-mono">{fmt(a.matExpected)}</td>
          <td class="px-3 py-2 text-right font-mono font-semibold">{fmt(a.matComputed)}</td>
          <td class="px-3 py-2 text-right font-mono"
            style="color:{a.matGap >= 0 ? '#15803D' : '#B45309'}">
            {a.matGap >= 0 ? '+' : ''}{fmt(a.matGap)}
          </td>
          <td class="px-3 py-2 text-right font-mono font-bold"
            style="color:{coverageColor(a.matCoverage)}">
            {(a.matCoverage * 100).toFixed(0)}%
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="bg-hairline">
      <tr>
        <td class="px-3 py-2 font-bold">합계</td>
        <td class="px-3 py-2 text-right font-mono font-bold">{fmt(anchorTotalExpected)}</td>
        <td class="px-3 py-2 text-right font-mono font-bold">{fmt(anchorTotalComputed)}</td>
        <td class="px-3 py-2 text-right font-mono font-bold"
          style="color:{(anchorTotalComputed - anchorTotalExpected) >= 0 ? '#15803D' : '#B45309'}">
          {(anchorTotalComputed - anchorTotalExpected) >= 0 ? '+' : ''}{fmt(anchorTotalComputed - anchorTotalExpected)}
        </td>
        <td class="px-3 py-2 text-right font-mono font-bold"
          style="color:{coverageColor(overallCoverage)}">
          {(overallCoverage * 100).toFixed(0)}%
        </td>
      </tr>
    </tfoot>
  </table>
</div>

<div class="mt-4 text-xs text-ink3 leading-relaxed p-3 rounded-xl bg-hairline">
  <strong class="text-ink2">참고:</strong>
  강석문 .xlsm 원본 sheet1.xml 이 본 컨테이너에 없어 일부 수식(전후면 기둥 +24, 중방 보강 +4/동)은
  §5.2 명시 검증값에서 역산한 가설입니다.
  자재비 달성률 &lt; 100% 는 카탈로그 미수록 부재 누락을 의미합니다 (예: 양액 배관·결로받이 추가 마감재).
  강석문 원본 또는 ItemMaster CSV (227 품목) 임포트 시 달성률 향상 가능.
</div>

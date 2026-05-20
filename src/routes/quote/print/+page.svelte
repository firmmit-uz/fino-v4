<script lang="ts">
  import { onMount } from 'svelte';
  import { quoteInput, quoteResult } from '$lib/quote/store.js';
  import { formatCurrency, formatNumber } from '$lib/quote/calc.js';
  import { categoryLabel } from '$lib/quote/labels.js';
  import { langStore } from '$lib/i18n/index.js';

  const today = new Date().toISOString().slice(0, 10);

  function quoteNumber(): string {
    const d = new Date();
    const seed = d.getFullYear().toString() +
                 ((d.getMonth() + 1) * 100 + d.getDate()).toString().padStart(4, '0');
    return `FM-${d.getFullYear()}-${seed.slice(-4)}`;
  }

  onMount(() => {
    // 인쇄 트리거는 사용자 액션으로 (자동 출력 차단)
  });
</script>

<svelte:head>
  <title>FIRMMIT 견적서 — {quoteNumber()}</title>
</svelte:head>

<!-- 인쇄 전용 액션 (인쇄 시 숨김) -->
<div class="no-print mb-4 flex gap-2">
  <button onclick={() => history.back()}
    class="px-4 py-2 rounded-lg border border-hairline bg-white text-sm font-semibold">
    ← 돌아가기
  </button>
  <button onclick={() => window.print()}
    class="px-4 py-2 rounded-lg text-white text-sm font-bold"
    style="background:var(--color-brand)">
    🖨 인쇄 / PDF
  </button>
</div>

<!-- ── A4 견적서 ─────────────────────────────────────── -->
<div class="quote-doc">
  <!-- 헤더 -->
  <div class="quote-head">
    <div>
      <div class="quote-title">QUOTATION · 견적서</div>
      <div class="quote-sub">No. {quoteNumber()} · {today}</div>
    </div>
    <img src="/logos/firmmit-blue.png" alt="FIRMMIT" class="logo" />
  </div>

  <!-- 공급자 정보 -->
  <table class="info-tbl">
    <tbody>
      <tr>
        <th>공급자 / Supplier</th>
        <td>주식회사 농업법인 퍼밋 (FIRMMIT)</td>
        <th>발행일 / Date</th>
        <td>{today}</td>
      </tr>
      <tr>
        <th>주소 / Address</th>
        <td colspan="3">DT CAMPUS, Maxtumquli ko'chasi 130, Yashnobod, Tashkent, Uzbekistan</td>
      </tr>
      <tr>
        <th>연락처 / Contact</th>
        <td>+998 90-063-23-15</td>
        <th>Email</th>
        <td>global@firmmit.com</td>
      </tr>
    </tbody>
  </table>

  <!-- 사양 요약 -->
  <div class="section-title">1. 시설 사양 / Specifications</div>
  <table class="spec-tbl">
    <tbody>
      <tr>
        <th>면적</th><td>{formatNumber($quoteResult.quantities.area)} ㎡ ({formatNumber($quoteResult.quantities.pyeong, 0)} 평)</td>
        <th>구조</th><td>{$quoteInput.width}m × {$quoteInput.length}m</td>
      </tr>
      <tr>
        <th>동폭 / 동수</th><td>{$quoteInput.spanWidth}m × {$quoteResult.quantities.spanCount}동</td>
        <th>측고</th><td>{$quoteInput.height}m</td>
      </tr>
      <tr>
        <th>기둥</th><td>60×60×{$quoteInput.columnThickness}t · {$quoteInput.columnPitch}m 간격</td>
        <th>서까래</th><td>Ø31.8×1.7t · {$quoteResult.quantities.rafterLength}m</td>
      </tr>
    </tbody>
  </table>

  <!-- 공정별 합계 -->
  <div class="section-title">2. 공정별 견적 / Cost Breakdown</div>
  <table class="cost-tbl">
    <thead>
      <tr>
        <th>공정 / Category</th>
        <th class="r">재료비</th>
        <th class="r">노무비</th>
        <th class="r">소계</th>
      </tr>
    </thead>
    <tbody>
      {#each $quoteResult.categories as cat}
        <tr>
          <td>{categoryLabel(cat.category, $langStore)}</td>
          <td class="r mono">{formatNumber(cat.material)}</td>
          <td class="r mono">{formatNumber(cat.labor)}</td>
          <td class="r mono b">{formatNumber(cat.subtotal)}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- 최종 합계 -->
  <div class="section-title">3. 최종 견적 / Final Quote</div>
  <table class="total-tbl">
    <tbody>
      <tr><th>하우스 공사 (VAT 포함)</th><td class="r mono">{formatNumber($quoteResult.cost.grandTotal)}</td></tr>
      {#if $quoteResult.extras.boiler > 0}
        <tr><th>보일러</th><td class="r mono">{formatNumber($quoteResult.extras.boiler)}</td></tr>
      {/if}
      {#if $quoteResult.extras.margin > 0}
        <tr><th>FIRMMIT 마진 ({Math.round($quoteInput.marginRate * 100)}%)</th><td class="r mono">{formatNumber($quoteResult.extras.margin)}</td></tr>
      {/if}
      {#if $quoteResult.extras.supervisor > 0}
        <tr><th>슈퍼바이저 파견 ({$quoteInput.superVisorMonths} 개월)</th><td class="r mono">{formatNumber($quoteResult.extras.supervisor)}</td></tr>
      {/if}
      {#if $quoteResult.extras.container > 0}
        <tr><th>컨테이너 운송 ({$quoteInput.containerCount} 대)</th><td class="r mono">{formatNumber($quoteResult.extras.container)}</td></tr>
      {/if}
      <tr class="grand">
        <th>총 견적 금액 / Grand Total</th>
        <td class="r mono">{formatCurrency($quoteResult.finalDisplay, $quoteResult.displayCurrency)}</td>
      </tr>
      {#if $quoteResult.displayCurrency !== 'KRW'}
        <tr>
          <th class="ref">≈ KRW 환산</th>
          <td class="r mono ref">{formatCurrency($quoteResult.finalKrw, 'KRW')}</td>
        </tr>
      {/if}
    </tbody>
  </table>

  <!-- 약관 -->
  <div class="section-title">4. 견적 조건 / Terms</div>
  <ul class="terms">
    <li>본 견적서의 유효기간은 발행일로부터 30일입니다.</li>
    <li>운송비·현지 인건비는 별도 협의 (본 견적 미포함, 단 옵션 추가 시 명시).</li>
    <li>환율은 {formatNumber($quoteInput.fxKrwPerUsd)} KRW/USD 기준이며, 결제 시점에 따라 변동 가능.</li>
    <li>자재 사양·수량은 현장 실사 후 조정될 수 있습니다.</li>
  </ul>

  <!-- 푸터 -->
  <div class="footer">
    FIRMMIT GLOBAL LLC · www.firmmit.com · global@firmmit.com · +998 90-063-23-15
  </div>
</div>

<style>
  .quote-doc {
    background: white;
    color: #0F172A;
    padding: 24px 28px;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    max-width: 800px;
    margin: 0 auto;
  }
  .quote-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 3px solid #3365FF;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }
  .quote-title {
    font-size: 22px;
    font-weight: 900;
    color: #1E40AF;
    letter-spacing: -0.02em;
  }
  .quote-sub { font-size: 12px; color: #64748B; margin-top: 4px; }
  .logo { height: 36px; width: auto; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
  th, td { padding: 6px 8px; border: 1px solid #E2E8F0; text-align: left; }
  th { background: #F1F5F9; font-weight: 700; color: #64748B; font-size: 11px; }
  .info-tbl th { width: 100px; }
  .spec-tbl th { width: 80px; }
  .cost-tbl thead th { text-align: center; }
  .r { text-align: right; }
  .mono { font-family: var(--font-mono, monospace); }
  .b { font-weight: 700; }

  .section-title {
    font-size: 13px;
    font-weight: 800;
    color: #1E40AF;
    margin: 14px 0 6px;
    border-left: 4px solid #3365FF;
    padding-left: 8px;
  }

  .total-tbl th { background: white; color: #0F172A; }
  .total-tbl .grand th, .total-tbl .grand td {
    background: #EFF6FF;
    color: #1E40AF;
    font-weight: 900;
    font-size: 14px;
  }
  .total-tbl .ref { color: #94A3B8; font-size: 10px; }

  .terms { font-size: 11px; color: #64748B; line-height: 1.6; padding-left: 18px; margin-bottom: 12px; }
  .terms li { margin-bottom: 2px; }

  .footer {
    border-top: 1px solid #E2E8F0;
    padding-top: 8px;
    margin-top: 20px;
    font-size: 10px;
    color: #94A3B8;
    text-align: center;
  }

  @media print {
    :global(header), :global(nav), :global(footer) { display: none !important; }
    :global(.no-print) { display: none !important; }
    :global(body), :global(html) { background: white !important; }
    .quote-doc { border: none; box-shadow: none; padding: 0; max-width: 100%; }
    @page { size: A4; margin: 12mm; }
  }
</style>

// FIRMMIT 온실견적 v2.0 — Greenhouse quote engine types
// Source: HANDOFF_TO_CLAUDE_CODE.md sections 3.6 - 3.8

export type Currency = 'KRW' | 'USD' | 'UZS';

export type Category =
  // === 하우스 공사 (house) ===
  | 'foundation'   // 1. 기초공사
  | 'steel'        // 2. 철골자재
  | 'parts'        // 3. 부속자재
  | 'cover'        // 4. 피복공사
  | 'shade'        // 5. 차광망
  | 'thermal'      // 6. 보온커튼
  | 'side_curtain' // 7. 측면수직커튼
  | 'end_curtain'  // 8. 전후면수직커튼
  | 'vent'         // 10. 개폐·환기
  | 'control'      // 11. 콘트롤박스
  // === 양액시설 (irrigation) ===
  | 'irrigation'   // 양액 탱크·펌프·베드·점적
  // === 환경제어시설 (env_control) ===
  | 'env_control'  // 컨트롤러·센서·CO2
  // === FIRMMIT 추가 ===
  | 'boiler'       // 보일러
  | 'extra';       // 운송·슈퍼바이저 등

// 시설 그룹 (3대 분류 §3.4)
export type FacilityGroup = 'house' | 'irrigation' | 'env_control';

export const CATEGORY_TO_GROUP: Record<Category, FacilityGroup | 'extras'> = {
  foundation: 'house', steel: 'house', parts: 'house', cover: 'house',
  shade: 'house', thermal: 'house', side_curtain: 'house', end_curtain: 'house',
  vent: 'house', control: 'house',
  irrigation: 'irrigation',
  env_control: 'env_control',
  boiler: 'extras', extra: 'extras',
};

export interface MaterialItem {
  id: string;            // FM-NNN
  category: Category;
  name: string;          // 한글 기본
  spec: string;          // 규격
  unit: string;          // 본/조/m/㎡/식/세트
  priceKrw: number;      // 한국 매입 단가 (부가세 별도)
  priceUzs?: number;     // 우즈벡 현지 매입 단가 (선택)
  laborRate?: number;    // 노무비 비율 (재료비 대비, 0~1)
}

export interface QuoteInput {
  // 기본 사양
  width: number;         // 하우스 폭 (m)
  length: number;        // 1중 길이 (m)
  spanWidth: number;     // 동폭 (m)
  height: number;        // 측고 (m)
  columnPitch: number;   // 기둥 간격 (m)
  columnThickness: 2.1 | 2.3;  // 기둥 두께 (t)
  rValue: number;        // 서까래 R값 (예: 0.15)

  // 옵션 (ON/OFF)
  enable2ndCover: boolean;      // 2중 비닐
  enableShade: boolean;         // 차광망
  enableThermal: boolean;       // 보온커튼
  enableSideCurtain: boolean;   // 측면 수직커튼
  enableEndCurtain: boolean;    // 전후면 수직커튼
  enableBoiler: boolean;        // 가스보일러
  boilerSets: number;           // 보일러 세트 수
  superVisorMonths: number;     // 슈퍼바이저 개월
  containerCount: number;       // 컨테이너 대수

  // 양액·환경제어 (§3.4)
  enableIrrigation: boolean;    // 양액시설 ON/OFF
  irrigationArea?: number;      // 양액 적용 면적 (㎡, 기본 = area)
  enableEnvControl: boolean;    // 환경제어시설 ON/OFF
  envControlChannels: number;   // 채널 수 (천창·측창 등)

  // 마진·환율·세금
  marginRate: number;           // 마진율 (예: 0.30)
  generalAdminRate: number;     // 일반관리비 (예: 0.03)
  profitRate: number;           // 이윤 (예: 0.10)
  vatRate: number;              // 부가세 (KR 0.10 / UZ 0.12)
  fxKrwPerUsd: number;          // KRW/USD
  fxKrwPerUzs: number;          // KRW/UZS

  // 출력
  currency: Currency;
}

// ── Computed quantities (section 3.7) ─────────────────────────
export interface Quantities {
  area: number;          // ㎡
  pyeong: number;        // 평
  spanCount: number;     // 동수
  columnRows: number;    // 기둥줄
  columnsPerRow: number; // 기둥칸
  innerColumns: number;  // 셋기둥수
  rafterLength: number;  // 서까래 길이 (m)
  rafterCount: number;   // 서까래 개수
  tClampCount: number;   // T크램프 개수
  perimeter: number;     // 둘레 (m)
}

// ── BOM (Bill of Materials) ───────────────────────────────────
export interface BomLine {
  itemId: string;
  category: Category;
  name: string;
  spec: string;
  unit: string;
  quantity: number;
  unitPrice: number;        // 통화는 currency 기준
  materialCost: number;     // quantity × unitPrice
  laborCost: number;        // materialCost × laborRate
  total: number;            // material + labor
}

// ── Cost rollup (section 3.6) ─────────────────────────────────
export interface CategorySubtotal {
  category: Category;
  material: number;
  labor: number;
  expense: number;
  subtotal: number;
}

export interface CostBreakdown {
  // 직접비
  materialDirect: number;
  laborDirect: number;
  expenseDirect: number;
  directTotal: number;

  // 간접비 (section 3.6 공식)
  indirectLabor: number;       // 직접노무비 × 0.03
  workersInsurance: number;    // 노무비 × 0.037
  employmentInsurance: number; // 노무비 × 0.0101
  otherExpense: number;        // (재료+노무) × 0.03

  pureConstruction: number;    // 순공사비
  generalAdmin: number;        // 순공사비 × generalAdminRate
  profit: number;              // (노무+경비+관리비) × profitRate
  supplyAmount: number;        // 공급가액
  vat: number;                 // 공급가액 × vatRate
  grandTotal: number;          // 최종
}

// 시설 그룹별 견적 (§3.4 — 하우스 / 양액 / 환경제어)
export interface GroupQuote {
  group: FacilityGroup;
  categories: CategorySubtotal[];
  cost: CostBreakdown;
}

export interface Quote {
  input: QuoteInput;
  quantities: Quantities;
  bom: BomLine[];
  // 하위 호환 (기존 단일 시설 뷰)
  categories: CategorySubtotal[];
  cost: CostBreakdown;
  // 신규 — 3대 분류
  groups: GroupQuote[];
  extras: {
    boiler: number;
    supervisor: number;
    container: number;
    margin: number;
  };
  facilitiesTotal: number; // 3그룹 합계 (마진 적용 전)
  finalKrw: number;
  finalDisplay: number;    // in selected currency
  displayCurrency: Currency;
}

# Greenhouse Quote v2.0 — 핸드오프 노트

본 문서는 사용자(이윤선)가 로컬 Mac 세션에서 작성한 핸드오프 문서를 **이 리포지토리 컨텍스트**에 맞춰 재정리한 사본입니다.
원본 문서 전문은 `HANDOFF_ORIGINAL.md` (다음 커밋에 추가 예정).

## 이 리포에서 완료된 작업 (브랜치: `claude/greenhouse-quote-cloud-sB5dL`)

기존 Fino 작물영양 SvelteKit 앱은 그대로 두고, `/quote` 라우트로 분리하여
**온실 견적 웹앱 MVP**를 구축했습니다.

### 새 모듈

| 경로 | 역할 |
|------|------|
| `src/lib/quote/types.ts` | `QuoteInput`, `Quantities`, `BomLine`, `CostBreakdown`, `Quote` |
| `src/lib/quote/materials.ts` | 자재 카탈로그 (~37품목, FM-NNN 코드) |
| `src/lib/quote/calc.ts` | §3.7 수량 산출 + §3.6 원가계산 파이프라인 |
| `src/lib/quote/defaults.ts` | `KSM_BASELINE` (3,360㎡) + `NUKUS_PRESET` (2ha) |
| `src/lib/quote/calc.spec.ts` | 골든 테스트 19개 (수량·BOM·원가) |
| `src/lib/quote/store.ts` | Svelte 스토어 + localStorage 영속화 |
| `src/lib/quote/history.ts` | 견적 발행번호 (FM-YYYY-NNNN) + 이력 CRUD |
| `src/lib/quote/labels.ts` | 카테고리 다국어 라벨 (ko/en/ru/uz/uzc) |
| `src/routes/quote/+page.svelte` | 입력 폼 + 실시간 결과 + 저장 다이얼로그 |
| `src/routes/quote/bom/+page.svelte` | 자재명세서 (BOM) 테이블 |
| `src/routes/quote/print/+page.svelte` | A4 견적서 출력 (`window.print()`) |
| `src/routes/quote/history/+page.svelte` | 견적 이력 + 불러오기/삭제 |

### 검증된 동작 (§5.2 강석문 베이스라인)

```
입력: 35m × 96m, 동폭 7m, 측고 4m, 기둥간격 3m
→ 면적 3,360㎡  ✓
→ 평수 1,017     ✓
→ 동수 5         ✓
→ 기둥줄 6, 기둥칸 33  ✓
→ 셋기둥 128      ✓ (4 × 32)
→ T크램프 454     ✓
→ 서까래 8.1m    (강석문 8.2m과 0.1m 차이 — ROUNDUP 자리수 검증 필요)
```

### 미완성 / 후속 작업 (TASK-001 ~ TASK-011)

원본 핸드오프 문서의 미완 작업 항목들은 이 리포에서 다음과 같이 매핑됩니다:

- **TASK-001 (우즈벡 매입가)** — `materials.ts` 의 `MaterialItem.priceUzs` 필드.
  현재 미입력 — 박 대표/Anwar/Diliq 거래처 단가 확보 후 추가.
- **TASK-002 (227 품목 확장)** — 현재 24품목. CSV 임포트 기능 추가 필요.
- **TASK-003 (BOM 자동 확장)** — 이미 `calc.ts > buildBom` 에서 동적 생성됨.
- **TASK-004 (강석문 256.74M 일치 검증)** — 현재 BOM 수량은 §3.7 공식 기반.
  정확한 강석문 자재산출 시트(sheet1.xml)가 없어 셋기둥·중방 외 일부는
  근사치. 회의에서 받은 .xlsm 원본 sheet1.xml 추출 후 정확도 향상 가능.
- **TASK-005 (누쿠스 견적 발행)** — `NUKUS_PRESET` 적용 후 `/quote/print`에서 출력.
- **TASK-006 (다국어 품목명)** — 현재 `labels.ts` 는 카테고리만. 품목명까지 확장 필요.
- **TASK-007 (디자인)** — A4 견적서 기본 구조 완료. 로고·풋터 포함.
- **TASK-008 (환율 자동 갱신)** — `fxKrwPerUsd` 수동 입력. Apps Script 의존 제거됨.
- **TASK-009 (양액·환경제어 별도 합계)** — 현재 하우스만. 추가 카테고리 가능.
- **TASK-010 (회로증설 자동 산출)** — `enableBoiler`/`boilerSets` 만 구현.
- **TASK-011 (회의록 통합)** — 본 문서로 대체.

### 사용법

```bash
npm install
npm run dev
# http://localhost:5173/quote
```

- 홈 화면(`/`)에서 "Greenhouse Quote v2.0" 카드 클릭
- 또는 직접 `/quote` 이동
- "강석문 베이스" / "누쿠스 2ha" 프리셋 버튼 사용 가능
- 인쇄: `/quote/print` 에서 `Cmd/Ctrl+P` (A4 자동 적용)

### 테스트

```bash
npx vitest run src/lib/quote/   # 19 tests
npx vitest run                  # 전체 36 tests
```

// FIRMMIT 자재 카탈로그 — 강석문 .xlsm 자재산출/철골/부속/피복 시트 직접 포팅
// 출처: HANDOFF §3.8 + 실제 .xlsm 데이터 (KSM 베이스라인 35×96×7×4)

import type { MaterialItem } from './types.js';

export const MATERIALS: MaterialItem[] = [
  // ═══════════════════════════════════════════════════════
  // 1. 기초공사 (foundation) — §3.5 4.73M 자재비
  // ═══════════════════════════════════════════════════════
  { id: 'FM-101', category: 'foundation', name: '터파기·잔토처리', spec: '', unit: 'EA', priceKrw: 0, laborRate: 0 },
  { id: 'FM-102', category: 'foundation', name: '거푸집',         spec: 'THP Ø400',  unit: 'EA', priceKrw: 42360 },
  { id: 'FM-103', category: 'foundation', name: '레미콘 (버림)',   spec: '25-18-80', unit: '㎥', priceKrw: 118800 },
  { id: 'FM-104', category: 'foundation', name: '레미콘 (본)',     spec: '25-18-80', unit: '㎥', priceKrw: 118800 },

  // ═══════════════════════════════════════════════════════
  // 2. 철골자재 (steel) — §3.5 67.08M 자재비 / 33 items
  // ═══════════════════════════════════════════════════════
  { id: 'FM-201', category: 'steel', name: '기둥',            spec: '60×60×2.3t × 5m',   unit: '본', priceKrw: 35720 },
  { id: 'FM-202', category: 'steel', name: '측면셋기둥',       spec: '60×60×2.3t × 4.8m', unit: '본', priceKrw: 34290 },
  { id: 'FM-216', category: 'steel', name: '전후면 수직커튼보강', spec: '60×60×2.3t × 5m',   unit: '본', priceKrw: 35720 },
  { id: 'FM-203', category: 'steel', name: '중방',            spec: '60×60×2.3t × 7m',   unit: '본', priceKrw: 57710 },
  { id: 'FM-217', category: 'steel', name: '출입문기둥',       spec: '60×60×2.3t × 6m',   unit: '본', priceKrw: 42860 },
  { id: 'FM-218', category: 'steel', name: '출입문보강',       spec: '60×60×2.3t × 6m',   unit: '본', priceKrw: 42860 },
  { id: 'FM-219', category: 'steel', name: '유인줄브래싱',      spec: '60×60×2.3t × 4m',   unit: '본', priceKrw: 28570 },
  { id: 'FM-204', category: 'steel', name: '보',              spec: '60×60×2.3t × 6m',   unit: '본', priceKrw: 49460 },
  { id: 'FM-220', category: 'steel', name: '중방받침대',       spec: '60×60×2.3t × 6m',   unit: '본', priceKrw: 42860 },
  { id: 'FM-205', category: 'steel', name: '방풍벽',           spec: 'Ø33.5×2.3t × 5m',  unit: '본', priceKrw: 18120 },
  { id: 'FM-221', category: 'steel', name: '1중측면 가로대',    spec: 'Ø25.4×1.5t × 10m', unit: '본', priceKrw: 16200 },
  { id: 'FM-222', category: 'steel', name: '방풍벽고정파이프',   spec: 'Ø31.8×1.5t × 10m', unit: '본', priceKrw: 20520 },
  { id: 'FM-223', category: 'steel', name: '측면물받이 받침',    spec: 'Ø31.8×1.5t × 10m', unit: '본', priceKrw: 20520 },
  { id: 'FM-206', category: 'steel', name: '1중 서까래',       spec: 'Ø31.8×1.7t × 8.2m', unit: '본', priceKrw: 17910 },
  { id: 'FM-207', category: 'steel', name: '1중지붕가로대',    spec: 'Ø25.4×1.5t × 10m', unit: '본', priceKrw: 16200 },
  { id: 'FM-224', category: 'steel', name: '1중 지붕브래싱',   spec: 'Ø25.4×1.5t × 10m', unit: '본', priceKrw: 16200 },
  { id: 'FM-225', category: 'steel', name: '1중 전후면 수직 서까래', spec: 'Ø48.1×2.1t × 8m', unit: '본', priceKrw: 33220 },
  { id: 'FM-226', category: 'steel', name: '1중 전후면 가로대', spec: 'Ø31.8×1.5t × 10m', unit: '본', priceKrw: 20520 },
  { id: 'FM-227', category: 'steel', name: '측면 수직커튼 치마 가로대',  spec: 'Ø25.4×1.5t × 10m', unit: '본', priceKrw: 16200 },
  { id: 'FM-228', category: 'steel', name: '전후면 수직커튼 치마 가로대', spec: 'Ø31.8×1.5t × 10m', unit: '본', priceKrw: 20520 },
  { id: 'FM-229', category: 'steel', name: '1중 측면 개폐축',  spec: 'Ø25.4×1.5t × 10m', unit: '본', priceKrw: 16200 },
  { id: 'FM-230', category: 'steel', name: '2중 측면 개폐축',  spec: 'Ø25.4×1.5t × 10m', unit: '본', priceKrw: 16200 },
  { id: 'FM-231', category: 'steel', name: '1중 전후면 개폐축', spec: 'Ø25.4×1.5t × 10m', unit: '본', priceKrw: 16200 },
  { id: 'FM-232', category: 'steel', name: '2중 전후면 개폐축', spec: 'Ø25.4×1.5t × 10m', unit: '본', priceKrw: 16200 },
  { id: 'FM-233', category: 'steel', name: '출입문파이프',     spec: '30×30×1.5t × 6m',  unit: '본', priceKrw: 12600 },
  { id: 'FM-234', category: 'steel', name: '물홈통 고정파이프', spec: 'Ø31.8×1.5t × 10m', unit: '본', priceKrw: 20520 },

  // ═══════════════════════════════════════════════════════
  // 3. 부속자재 (parts) — §3.5 24.39M 자재비 / 25+ items
  // ═══════════════════════════════════════════════════════
  { id: 'FM-301', category: 'parts', name: 'T크램프',        spec: '60×60',           unit: '조', priceKrw: 2489 },
  { id: 'FM-302', category: 'parts', name: '십자판',         spec: '60×60',           unit: '조', priceKrw: 3273 },
  { id: 'FM-303', category: 'parts', name: '1중 쌍꽂이',     spec: '60×32',           unit: 'EA', priceKrw: 3645 },
  { id: 'FM-320', category: 'parts', name: 'U크램프(전후면수직서까래)', spec: '60×48', unit: '조', priceKrw: 1801 },
  { id: 'FM-321', category: 'parts', name: '보강받침판',     spec: '60×60',           unit: 'EA', priceKrw: 1634 },
  { id: 'FM-322', category: 'parts', name: '각관연결핀',     spec: '60×60',           unit: 'EA', priceKrw: 1890 },
  { id: 'FM-323', category: 'parts', name: '연결핀(무링) 32',spec: 'Ø32×1.5t',        unit: 'EA', priceKrw: 446 },
  { id: 'FM-324', category: 'parts', name: '연결핀(무링) 25',spec: 'Ø25×1.5t',        unit: 'EA', priceKrw: 230 },
  { id: 'FM-325', category: 'parts', name: '강판조리개',     spec: '25×32',           unit: 'EA', priceKrw: 608 },
  { id: 'FM-326', category: 'parts', name: '조리개',         spec: '25×32',           unit: 'EA', priceKrw: 130 },
  { id: 'FM-327', category: 'parts', name: '고정구(B/N포함)',spec: '48×32',           unit: '조', priceKrw: 581 },
  { id: 'FM-328', category: 'parts', name: '고정구 Ø25',     spec: 'Ø25',             unit: 'EA', priceKrw: 122 },
  { id: 'FM-329', category: 'parts', name: '고정구 Ø32',     spec: 'Ø32',             unit: 'EA', priceKrw: 162 },
  { id: 'FM-330', category: 'parts', name: 'T고정구 Ø32',    spec: 'Ø32',             unit: 'EA', priceKrw: 176 },
  { id: 'FM-331', category: 'parts', name: '새들고정구 25',  spec: 'Ø25',             unit: 'EA', priceKrw: 95 },
  { id: 'FM-332', category: 'parts', name: '새들고정구 32',  spec: 'Ø32',             unit: 'EA', priceKrw: 102 },
  { id: 'FM-333', category: 'parts', name: '고리 고정구',    spec: 'Ø32',             unit: 'EA', priceKrw: 918 },
  { id: 'FM-334', category: 'parts', name: '1중물받이 (긴)', spec: '600×0.5t × 97m',  unit: 'EA', priceKrw: 518562 },
  { id: 'FM-335', category: 'parts', name: '1중물받이 (짧)', spec: '600×0.5t × 5m',   unit: 'EA', priceKrw: 26730 },
  { id: 'FM-336', category: 'parts', name: 'PE물받이',       spec: '600 × 1.0t × 97m',unit: 'EA', priceKrw: 135796 },
  { id: 'FM-337', category: 'parts', name: '비닐패드',       spec: 'A/L 1.0t × 6m',   unit: 'EA', priceKrw: 8550 },
  { id: 'FM-338', category: 'parts', name: '물받이패드',     spec: 'A/L 1.0t × 6m',   unit: 'EA', priceKrw: 9500 },
  { id: 'FM-339', category: 'parts', name: '패드스프링',     spec: '전착 / 2M',        unit: 'EA', priceKrw: 351 },
  { id: 'FM-340', category: 'parts', name: '패드연결핀',     spec: 'A/L',             unit: 'EA', priceKrw: 254 },
  { id: 'FM-341', category: 'parts', name: '직결피스',       spec: '스텐 #8×16mm',     unit: 'EA', priceKrw: 33 },
  { id: 'FM-342', category: 'parts', name: '육각피스',       spec: '#14×25mm',        unit: 'EA', priceKrw: 46 },
  { id: 'FM-343', category: 'parts', name: 'C형강',          spec: '60×30×2.0t × 6m', unit: 'EA', priceKrw: 20372 },
  { id: 'FM-344', category: 'parts', name: '출입문베어링',   spec: '',                unit: 'EA', priceKrw: 2376 },
  { id: 'FM-345', category: 'parts', name: '출입문손잡이',   spec: '',                unit: 'EA', priceKrw: 486 },
  { id: 'FM-346', category: 'parts', name: '냉각도금제',     spec: '징크',            unit: 'BOX', priceKrw: 121500 },
  { id: 'FM-347', category: 'parts', name: '물받이 작업비',  spec: '',                unit: 'm', priceKrw: 1800 },

  // ═══════════════════════════════════════════════════════
  // 4. 피복공사 (cover) — §3.5 23.35M 자재비
  // ═══════════════════════════════════════════════════════
  // KSM 실제: 1중지붕 0.15×380×97m × 10매 = 942,810/매. 면적당 환산
  { id: 'FM-401', category: 'cover', name: '1중 지붕 PO 비닐',  spec: '0.15×380×97m / 매',  unit: '매', priceKrw: 942810, laborRate: 0.29 },
  { id: 'FM-402', category: 'cover', name: '1중 천창 PO',      spec: '0.15×240×97m / 매',  unit: '매', priceKrw: 595460, laborRate: 0.29 },
  { id: 'FM-403', category: 'cover', name: '측면방풍벽 PO',     spec: '0.15×500×97m / 매',  unit: '매', priceKrw: 1240540, laborRate: 0.29 },
  { id: 'FM-404', category: 'cover', name: '1중 전후면(상) PO', spec: '0.15×260×38m / 매',  unit: '매', priceKrw: 252720, laborRate: 0.29 },
  { id: 'FM-405', category: 'cover', name: '1중 전후면(하) PO', spec: '0.15×450×38m / 매',  unit: '매', priceKrw: 437390, laborRate: 0.29 },
  { id: 'FM-406', category: 'cover', name: '1중 측면치마 PE',   spec: '0.1×120×97m / 매',   unit: '매', priceKrw: 198490, laborRate: 0.29 },
  { id: 'FM-407', category: 'cover', name: '1중 측면치마 PO',   spec: '0.15×120×97m / 매',  unit: '매', priceKrw: 309890, laborRate: 0.29 },
  { id: 'FM-408', category: 'cover', name: '1중 전후면치마 PE', spec: '0.1×120×38m / 매',   unit: '매', priceKrw: 60330, laborRate: 0.29 },
  { id: 'FM-409', category: 'cover', name: '1중 전후면치마 PO', spec: '0.15×120×38m / 매',  unit: '매', priceKrw: 94190, laborRate: 0.29 },
  { id: 'FM-412', category: 'cover', name: '1중 바람막이',     spec: '0.1×160×12m / 매',   unit: '매', priceKrw: 25410 },
  { id: 'FM-413', category: 'cover', name: '2중 측면 비닐',    spec: '0.1×450×95m / 매',   unit: '매', priceKrw: 565590 },
  { id: 'FM-414', category: 'cover', name: '2중 측면 바람막이', spec: '0.1×450×95m / 매',   unit: '매', priceKrw: 565590 },
  { id: 'FM-415', category: 'cover', name: '2중 측면치마',     spec: '0.1×120×95m / 매',   unit: '매', priceKrw: 150830 },
  { id: 'FM-416', category: 'cover', name: '2중 전후면',       spec: '0.1×380×36m / 매',   unit: '매', priceKrw: 180990 },
  { id: 'FM-417', category: 'cover', name: '2중 전후면 바람막이',spec: '0.1×380×14m / 매',  unit: '매', priceKrw: 70390 },
  { id: 'FM-418', category: 'cover', name: '2중 전후면치마',   spec: '0.1×120×36m / 매',   unit: '매', priceKrw: 57160 },
  { id: 'FM-419', category: 'cover', name: '부직포 1중측면치마',spec: '200g × 97m',         unit: '매', priceKrw: 162960 },
  { id: 'FM-420', category: 'cover', name: '부직포 2중측면치마',spec: '200g × 95m',         unit: '매', priceKrw: 159600 },
  { id: 'FM-421', category: 'cover', name: '부직포 전후면치마', spec: '200g × 36m',         unit: '매', priceKrw: 60480 },
  { id: 'FM-422', category: 'cover', name: '보수 테이프',     spec: 'PO용 100×10',         unit: 'EA', priceKrw: 7092 },
  { id: 'FM-423', category: 'cover', name: '패드필름 2 S',    spec: '0.18×10×200m',       unit: 'EA', priceKrw: 10506 },
  { id: 'FM-424', category: 'cover', name: '하우스밴드',      spec: '4Ø × 1500m',         unit: 'EA', priceKrw: 90000 },
  { id: 'FM-425', category: 'cover', name: '고리고정구 48',   spec: 'Ø48',                unit: 'EA', priceKrw: 940 },
  { id: 'FM-426', category: 'cover', name: '하우스크립 25',   spec: 'Ø25',                unit: 'EA', priceKrw: 78 },
  { id: 'FM-427', category: 'cover', name: '하우스크립 32',   spec: 'Ø32',                unit: 'EA', priceKrw: 124 },
  { id: 'FM-428', category: 'cover', name: '방충망 (백색)',   spec: '1.5×100m',           unit: 'EA', priceKrw: 76800 },

  // ═══════════════════════════════════════════════════════
  // 5. 차광망 (shade) — §3.5 6.32M (하드웨어만, 수평커튼은 6.보온커튼 시트로)
  // ═══════════════════════════════════════════════════════
  // FM-501은 thermal 카테고리로 이동됨
  { id: 'FM-510', category: 'shade', name: '포켓 (다겹)',     spec: '1.5 × 36m', unit: '매', priceKrw: 136700 },
  { id: 'FM-511', category: 'shade', name: '드름 48Ø',        spec: 'Ø48',       unit: 'EA', priceKrw: 2301 },
  { id: 'FM-512', category: 'shade', name: '축수 베어링 (60각/48Ø)', spec: '', unit: 'EA', priceKrw: 6305 },
  { id: 'FM-513', category: 'shade', name: '커튼지지 백관',   spec: 'KS25A × 6m',         unit: 'EA', priceKrw: 37710 },
  { id: 'FM-514', category: 'shade', name: '커튼지지 PE',     spec: 'Ø25.4×1.5t × 10m',   unit: 'EA', priceKrw: 17550 },
  { id: 'FM-515', category: 'shade', name: '커튼모타축',      spec: 'Ø48.1×2.1t × 6m',    unit: 'EA', priceKrw: 26990 },
  { id: 'FM-516', category: 'shade', name: 'U크램프 60×32',   spec: '60×32',              unit: 'EA', priceKrw: 1735 },
  { id: 'FM-517', category: 'shade', name: '커튼모타',        spec: '380V/2HP',           unit: 'EA', priceKrw: 650000 },
  { id: 'FM-518', category: 'shade', name: '예인로프 (코팅)', spec: '2.8Ø×2500m',          unit: 'ROL', priceKrw: 350350 },
  { id: 'FM-519', category: 'shade', name: '예인로프 (낙하산줄)', spec: '4Ø×1500m',         unit: 'BOX', priceKrw: 97500 },
  { id: 'FM-520', category: 'shade', name: '받침선 (폴리)',   spec: '2.05Ø×1800m',         unit: 'ROL', priceKrw: 86400 },
  { id: 'FM-521', category: 'shade', name: '받침선 (낙하산줄)',spec: '3.5Ø×2000m',          unit: 'BOX', priceKrw: 103400 },
  { id: 'FM-522', category: 'shade', name: '사이드와이어',    spec: '3.2/4.2Ø×500m',       unit: 'ROL', priceKrw: 149500 },
  { id: 'FM-523', category: 'shade', name: '예인로라 (싱걸)', spec: '',                    unit: 'EA', priceKrw: 624 },
  { id: 'FM-524', category: 'shade', name: '예인로라 (더블)', spec: '',                    unit: 'EA', priceKrw: 1183 },
  { id: 'FM-525', category: 'shade', name: '로라고리',        spec: 'Ø32',                 unit: 'EA', priceKrw: 273 },
  { id: 'FM-526', category: 'shade', name: '예인크립 P/L',    spec: '',                    unit: 'EA', priceKrw: 156 },

  // ═══════════════════════════════════════════════════════
  // 6. 보온커튼 (thermal) — §3.5 5.54M
  // KSM은 차광스크린35% (커튼) + 하드웨어 일식. 하드웨어는 차광망 시트와 가격 다름
  // ═══════════════════════════════════════════════════════
  { id: 'FM-501', category: 'thermal', name: '수평커튼 (차광스크린 35%)', spec: '4 × 96m / 매', unit: '매', priceKrw: 422400, laborRate: 0.91 },
  { id: 'FM-601', category: 'thermal', name: '보온커튼 하드웨어 일식',  spec: '드름·베어링·로라·로프 등', unit: '식', priceKrw: 1150000 },

  // ═══════════════════════════════════════════════════════
  // 7. 측면수직커튼 — §3.5 5.59M
  // ═══════════════════════════════════════════════════════
  { id: 'FM-701', category: 'side_curtain', name: '측면 수직커튼 (다겹)', spec: '5 × 95m / 매', unit: '매', priceKrw: 1781250, laborRate: 0.30 },
  { id: 'FM-710', category: 'side_curtain', name: '코너 바람막이 (다겹)', spec: '4.5 × 4m',     unit: 'EA', priceKrw: 63000 },
  { id: 'FM-711', category: 'side_curtain', name: '축수베어링 (60각/32Ø)', spec: '',           unit: 'EA', priceKrw: 5250 },
  { id: 'FM-712', category: 'side_curtain', name: '개폐축파이프',       spec: 'Ø33.5×2.3t × 6m', unit: 'EA', priceKrw: 22650 },

  // ═══════════════════════════════════════════════════════
  // 8. 전후면수직커튼 — §3.5 1.81M
  // ═══════════════════════════════════════════════════════
  { id: 'FM-801', category: 'end_curtain', name: '전후면 수직커튼 (다겹)', spec: '4 × 36m / 매', unit: '매', priceKrw: 496800, laborRate: 0.19 },
  { id: 'FM-810', category: 'end_curtain', name: '출입문 (다겹)',     spec: '3.5 × 3m / 매', unit: 'EA', priceKrw: 33810 },
  { id: 'FM-811', category: 'end_curtain', name: '개폐축파이프 (백관)', spec: 'KS25A × 6m',  unit: 'EA', priceKrw: 30750 },

  // ═══════════════════════════════════════════════════════
  // 10. 개폐·환기 (vent) — §3.5 5.89M / 7 motors + wires + supports
  // ═══════════════════════════════════════════════════════
  { id: 'FM-A01', category: 'vent', name: '개폐기 (1중천창)',   spec: 'CODM-81024',      unit: 'EA', priceKrw: 70400, laborRate: 0.57 },
  { id: 'FM-A02', category: 'vent', name: '개폐기 (1중측창)',   spec: 'CODM-81024',      unit: 'EA', priceKrw: 70400, laborRate: 0.57 },
  { id: 'FM-A05', category: 'vent', name: '개폐기 (1중전후면)', spec: 'CODM-81024',      unit: 'EA', priceKrw: 70400, laborRate: 0.57 },
  { id: 'FM-A06', category: 'vent', name: '개폐기 (2중측창)',   spec: 'CODM-81024',      unit: 'EA', priceKrw: 70400 },
  { id: 'FM-A07', category: 'vent', name: '개폐기 (2중전후면)', spec: 'CODM-81024',      unit: 'EA', priceKrw: 70400 },
  { id: 'FM-A08', category: 'vent', name: '개폐기 (측면수직커튼)', spec: 'CODM-81068D 양축', unit: 'EA', priceKrw: 281600 },
  { id: 'FM-A09', category: 'vent', name: '개폐기 (전후면수직커튼)', spec: 'CODM-81068',  unit: 'EA', priceKrw: 281600 },
  { id: 'FM-A10', category: 'vent', name: '전선 VCTF 2P/1.5',   spec: '2P/1.5mm',        unit: 'M', priceKrw: 628 },
  { id: 'FM-A11', category: 'vent', name: '전선 VCTF 3P/2.5',   spec: '3P/2.5mm',        unit: 'M', priceKrw: 1402 },
  { id: 'FM-A12', category: 'vent', name: '전선 TFR-CV 4P/6.0', spec: '4P/6.0mm',        unit: 'M', priceKrw: 4214 },
  { id: 'FM-A13', category: 'vent', name: '케이블 타이',        spec: '7.9×360mm',       unit: 'EA', priceKrw: 512 },

  // ═══════════════════════════════════════════════════════
  // 11. 콘트롤박스 (control) — §3.5 5.15M
  // ═══════════════════════════════════════════════════════
  { id: 'FM-B01', category: 'control', name: '함',               spec: '콘트롤 박스',                unit: 'EA', priceKrw: 1350000 },
  { id: 'FM-B10', category: 'control', name: '1중천창 컨트롤(좌)', spec: '5단/DC24V/200W',            unit: 'EA', priceKrw: 29700 },
  { id: 'FM-B11', category: 'control', name: '1중천창 컨트롤(우)', spec: '5단/DC24V/200W',            unit: 'EA', priceKrw: 29700 },
  { id: 'FM-B12', category: 'control', name: '1중측창',           spec: '5단/DC24V/48W',              unit: 'EA', priceKrw: 29700 },
  { id: 'FM-B13', category: 'control', name: '1중 전후면',        spec: '5단/DC24V/48W',              unit: 'EA', priceKrw: 29700 },
  { id: 'FM-B14', category: 'control', name: '2중측창',           spec: '시간2/DC24V/48W',            unit: 'EA', priceKrw: 29700 },
  { id: 'FM-B15', category: 'control', name: '2중 전후면',        spec: '시간2/DC24V/48W',            unit: 'EA', priceKrw: 29700 },
  { id: 'FM-B16', category: 'control', name: '측면수직커튼',      spec: '시간3/DC24V/200W',           unit: 'EA', priceKrw: 54000 },
  { id: 'FM-B17', category: 'control', name: '전후면수직커튼',    spec: '시간3/DC24V/200W',           unit: 'EA', priceKrw: 54000 },
  { id: 'FM-B18', category: 'control', name: '예비',              spec: 'DC24V/48W',                  unit: 'EA', priceKrw: 29700 },
  { id: 'FM-B19', category: 'control', name: '1중수평커튼',       spec: '시간4/AC380V/2HP',           unit: 'EA', priceKrw: 81000 },
  { id: 'FM-B20', category: 'control', name: '2중수평커튼',       spec: '시간5/AC380V/2HP',           unit: 'EA', priceKrw: 81000 },
  { id: 'FM-B21', category: 'control', name: '콘센트',            spec: '',                           unit: 'EA', priceKrw: 13500 },
  { id: 'FM-B22', category: 'control', name: '복합조절장치',      spec: '',                           unit: 'EA', priceKrw: 540000 },
  { id: 'FM-B23', category: 'control', name: '온도 조절',         spec: '',                           unit: 'EA', priceKrw: 135000 },
  { id: 'FM-B24', category: 'control', name: '타이머',            spec: '',                           unit: 'EA', priceKrw: 67500 },
  { id: 'FM-B25', category: 'control', name: '회로 증설',         spec: '수평커튼제외(총채널-4)',      unit: '회로', priceKrw: 40500 },
  { id: 'FM-B26', category: 'control', name: '환경제어',          spec: '1채널당 2회로',              unit: '회로', priceKrw: 20250 },

  // ═══════════════════════════════════════════════════════
  // 양액시설 (irrigation) — §3.4 25%
  // ═══════════════════════════════════════════════════════
  { id: 'FM-IR01', category: 'irrigation', name: '양액 원수탱크',  spec: 'PE 5,000L',         unit: '개', priceKrw: 950000,  laborRate: 0.15 },
  { id: 'FM-IR02', category: 'irrigation', name: '양액 A탱크',    spec: 'PE 1,000L',         unit: '개', priceKrw: 320000,  laborRate: 0.15 },
  { id: 'FM-IR03', category: 'irrigation', name: '양액 B탱크',    spec: 'PE 1,000L',         unit: '개', priceKrw: 320000,  laborRate: 0.15 },
  { id: 'FM-IR04', category: 'irrigation', name: '양액 공급펌프',  spec: '2HP 인버터',         unit: '대', priceKrw: 1850000, laborRate: 0.25 },
  { id: 'FM-IR05', category: 'irrigation', name: '양액 컨트롤러',  spec: 'EC/pH 자동',         unit: '식', priceKrw: 4800000, laborRate: 0.15 },
  { id: 'FM-IR06', category: 'irrigation', name: '점적 호스',     spec: 'PE 16mm 30cm',      unit: 'm',  priceKrw: 850,     laborRate: 0.50 },
  { id: 'FM-IR07', category: 'irrigation', name: '재배 베드',     spec: '스티로폼 + 부직포',    unit: '㎡', priceKrw: 18000,   laborRate: 0.40 },
  { id: 'FM-IR08', category: 'irrigation', name: '회수 배관',     spec: 'PVC 50A',           unit: 'm',  priceKrw: 3200,    laborRate: 0.60 },
  { id: 'FM-IR09', category: 'irrigation', name: '주배관·분기',   spec: 'PVC 75A + 솔레노이드', unit: '식', priceKrw: 8500000, laborRate: 0.40 },
  { id: 'FM-IR10', category: 'irrigation', name: '여과기',        spec: '디스크 200메쉬',     unit: '대', priceKrw: 450000,  laborRate: 0.20 },

  // ═══════════════════════════════════════════════════════
  // 환경제어시설 (env_control) — §3.4 11%
  // ═══════════════════════════════════════════════════════
  { id: 'FM-EC01', category: 'env_control', name: '복합환경 컨트롤러', spec: 'TS-2500 16ch',  unit: '식', priceKrw: 15000000, laborRate: 0.10 },
  { id: 'FM-EC02', category: 'env_control', name: '센서 박스',        spec: '온/습/CO₂/일사',  unit: '식', priceKrw: 2800000,  laborRate: 0.15 },
  { id: 'FM-EC03', category: 'env_control', name: '광량 센서',         spec: '쿼텀 PAR',       unit: '개', priceKrw: 850000,   laborRate: 0.10 },
  { id: 'FM-EC04', category: 'env_control', name: '풍향·풍속계',       spec: '회전식 + 풍향계', unit: '식', priceKrw: 1200000,  laborRate: 0.20 },
  { id: 'FM-EC05', category: 'env_control', name: 'CO₂ 공급기',       spec: '액화 CO₂ 자동',  unit: '식', priceKrw: 5800000,  laborRate: 0.20 },
  { id: 'FM-EC06', category: 'env_control', name: '제어 채널',         spec: '모터·릴레이',    unit: '채널', priceKrw: 320000, laborRate: 0.30 },
  { id: 'FM-EC07', category: 'env_control', name: '제어반 케이블',     spec: '5.5sq + 트레이', unit: 'm',   priceKrw: 8500,    laborRate: 0.60 },

  // ═══════════════════════════════════════════════════════
  // 보일러 (boiler) — FIRMMIT 추가
  // ═══════════════════════════════════════════════════════
  { id: 'FM-E02', category: 'boiler', name: '가스 보일러',     spec: '180만 kcal / 세트', unit: '세트', priceKrw: 95000000 },
  { id: 'FM-E03', category: 'boiler', name: '보일러 부속자재', spec: '배관·연결구',       unit: '식',   priceKrw: 15000000 },

  // ═══════════════════════════════════════════════════════
  // 부대비용 (extra) — 운송·인건비
  // ═══════════════════════════════════════════════════════
  { id: 'FM-X01', category: 'extra', name: '슈퍼바이저 파견', spec: '한국 1명 / 월', unit: '개월', priceKrw: 45000000 },
  { id: 'FM-X02', category: 'extra', name: '컨테이너 운송',   spec: '40ft / 대',     unit: '대',   priceKrw: 13000000 },
];

export const MATERIAL_BY_ID: Record<string, MaterialItem> = Object.fromEntries(
  MATERIALS.map(m => [m.id, m])
);

export function getMaterial(id: string): MaterialItem {
  const m = MATERIAL_BY_ID[id];
  if (!m) throw new Error(`Unknown material: ${id}`);
  return m;
}

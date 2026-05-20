// 카테고리 라벨 (다국어 — i18n 시스템 정착 전 임시 매핑)
import type { Category } from './types.js';

type LangCode = 'ko' | 'en' | 'ru' | 'uz' | 'uzc';

const CATEGORY_LABELS: Record<Category, Record<LangCode, string>> = {
  foundation:   { ko: '1. 기초공사',       en: '1. Foundation',      ru: '1. Фундамент',     uz: '1. Poydevor',       uzc: '1. Пойдевор' },
  steel:        { ko: '2. 철골자재',       en: '2. Steel frame',     ru: '2. Стальной каркас', uz: '2. Polad karkas',  uzc: '2. Полад каркас' },
  parts:        { ko: '3. 부속자재',       en: '3. Fittings',         ru: '3. Фурнитура',     uz: '3. Aksessuarlar',   uzc: '3. Аксессуарлар' },
  cover:        { ko: '4. 피복공사',       en: '4. Cover film',       ru: '4. Покрытие',       uz: '4. Plyonka',        uzc: '4. Плёнка' },
  shade:        { ko: '5. 차광망',         en: '5. Shade net',        ru: '5. Затеняющая сетка', uz: '5. Soyabon to\'r', uzc: '5. Сояабон тўр' },
  thermal:      { ko: '6. 보온커튼',       en: '6. Thermal curtain',  ru: '6. Тепло-завеса',   uz: '6. Issiqlik pardasi', uzc: '6. Иссиқлик пардаси' },
  side_curtain: { ko: '7. 측면 수직커튼',  en: '7. Side curtain',     ru: '7. Боковая завеса', uz: '7. Yon parda',     uzc: '7. Ён парда' },
  end_curtain:  { ko: '8. 전후면 수직커튼', en: '8. End curtain',     ru: '8. Торцевая завеса', uz: '8. Old parda',     uzc: '8. Олд парда' },
  vent:         { ko: '10. 개폐·환기',     en: '10. Vent / roll-up',  ru: '10. Вентиляция',    uz: '10. Shamollatish',  uzc: '10. Шамоллатиш' },
  control:      { ko: '11. 콘트롤박스',    en: '11. Control box',     ru: '11. Контроллер',    uz: '11. Boshqaruv',     uzc: '11. Бошқарув' },
  boiler:       { ko: '보일러',            en: 'Boiler',              ru: 'Котёл',             uz: 'Qozon',             uzc: 'Қозон' },
  extra:        { ko: '부대비용',          en: 'Extras',              ru: 'Дополнительно',     uz: 'Qo\'shimcha',       uzc: 'Қўшимча' },
};

function langKey(lng: string): LangCode {
  if (lng.startsWith('ko')) return 'ko';
  if (lng.startsWith('en')) return 'en';
  if (lng.startsWith('ru')) return 'ru';
  if (lng === 'uz-Cyrl') return 'uzc';
  return 'uz';
}

export function categoryLabel(cat: Category, lng: string): string {
  return CATEGORY_LABELS[cat][langKey(lng)];
}

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { writable, derived } from 'svelte/store';

// ── Translation bundles ───────────────────────────────────────
import ko_common    from './locales/ko/common.json';
import ko_stages    from './locales/ko/stages.json';
import ko_proc      from './locales/ko/procedure.json';
import uzC_common   from './locales/uz-Cyrl/common.json';
import uzC_stages   from './locales/uz-Cyrl/stages.json';
import uzC_proc     from './locales/uz-Cyrl/procedure.json';
import uzL_common   from './locales/uz-Latn/common.json';
import uzL_stages   from './locales/uz-Latn/stages.json';
import uzL_proc     from './locales/uz-Latn/procedure.json';
import ru_common    from './locales/ru/common.json';
import ru_stages    from './locales/ru/stages.json';
import ru_proc      from './locales/ru/procedure.json';
import en_common    from './locales/en/common.json';
import en_stages    from './locales/en/stages.json';
import en_proc      from './locales/en/procedure.json';

export const SUPPORTED_LANGS = ['uz-Cyrl', 'uz-Latn', 'ko', 'ru', 'en'] as const;
export type Lang = typeof SUPPORTED_LANGS[number];

// ── Reactive language store ───────────────────────────────────
// Components use $t('key') — Svelte auto-subscribes, re-renders on lang change.
export const langStore = writable<string>('uz-Cyrl');

// t is a derived store: $t('key') | $t('key', 'stages') | $t('warning.x', 'common', { param: 'val' })
export const t = derived(langStore, ($lang) =>
  (key: string, ns = 'common', params?: Record<string, string>): string =>
    i18next.t(key, { ns, lng: $lang, ...(params ?? {}) } as Record<string, unknown>) as string
);

let initialized = false;

export async function initI18n(): Promise<void> {
  if (initialized) return;
  initialized = true;
  await i18next
    .use(LanguageDetector)
    .init({
      fallbackLng: 'uz-Cyrl',
      defaultNS: 'common',
      ns: ['common', 'stages', 'procedure'],
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'fino_lang',
        caches: ['localStorage'],
      },
      resources: {
        ko:        { common: ko_common,  stages: ko_stages,  procedure: ko_proc  },
        'uz-Cyrl': { common: uzC_common, stages: uzC_stages, procedure: uzC_proc },
        'uz-Latn': { common: uzL_common, stages: uzL_stages, procedure: uzL_proc },
        ru:        { common: ru_common,  stages: ru_stages,  procedure: ru_proc  },
        en:        { common: en_common,  stages: en_stages,  procedure: en_proc  },
      },
      interpolation: { escapeValue: false },
    });
  // Sync store with detected language
  langStore.set(i18next.language ?? 'uz-Cyrl');
}

export function setLang(lang: Lang): void {
  i18next.changeLanguage(lang);
  langStore.set(lang);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('fino_lang', lang);
  }
}

export function currentLang(): string {
  let cur = 'uz-Cyrl';
  langStore.subscribe(v => { cur = v; })();
  return cur;
}

export default i18next;

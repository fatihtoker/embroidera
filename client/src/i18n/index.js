import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import nl from './nl.json';
import tr from './tr.json';

const SUPPORTED_LANGS = ['en', 'nl', 'tr'];

function detectLanguage() {
  // 1. Previously saved preference
  const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

  // 2. Browser language
  if (typeof navigator !== 'undefined') {
    const browserLangs = navigator.languages || [navigator.language];
    for (const lang of browserLangs) {
      const code = lang.split('-')[0].toLowerCase();
      if (SUPPORTED_LANGS.includes(code)) return code;
    }
  }

  // 3. Fallback
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    nl: { translation: nl },
    tr: { translation: tr },
  },
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
  document.documentElement.lang = lng;
});

export default i18n;

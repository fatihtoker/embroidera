import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import nl from './nl.json';
import tr from './tr.json';

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    nl: { translation: nl },
    tr: { translation: tr },
  },
  lng: savedLang || 'en',
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

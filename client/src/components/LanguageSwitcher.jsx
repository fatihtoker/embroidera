import { useTranslation } from 'react-i18next';
import '../styles/components.css';

const LANGUAGES = [
  { code: 'nl', label: 'NL' },
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="lang-switcher" role="group" aria-label="Language selection">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          className={`lang-switcher__btn ${
            i18n.language === code ? 'lang-switcher__btn--active' : ''
          }`}
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={i18n.language === code}
          aria-label={`Switch to ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

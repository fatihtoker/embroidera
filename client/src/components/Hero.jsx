import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StitchText from './StitchText';
import '../styles/hero.css';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="hero" aria-label="Hero">
      {/* Floating dots */}
      <div className="hero__dot" aria-hidden="true" />
      <div className="hero__dot" aria-hidden="true" />
      <div className="hero__dot" aria-hidden="true" />

      {/* Embroidery hoop decoration */}
      <div className="hero__hoop" aria-hidden="true">
        <div className="hero__hoop-fabric" />
        <StitchText />
      </div>

      <div className="hero__content">
        <span className="hero__eyebrow">embroidera</span>
        <h1 className="hero__title">
          {t('hero.title')}
        </h1>
        <p className="hero__subtitle">{t('hero.subtitle')}</p>
        <div className="hero__actions">
          <Link to="/workshops" className="btn btn--primary">
            {t('hero.cta_workshops')}
          </Link>
          <Link to="/portfolio" className="btn btn--secondary">
            {t('hero.cta_portfolio')}
          </Link>
        </div>
      </div>
    </section>
  );
}

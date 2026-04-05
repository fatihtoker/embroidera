import { useTranslation } from 'react-i18next';
import StitchDivider from '../components/StitchDivider';
import '../styles/about.css';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="about-page page-enter">
      <div className="container">
        {/* Hero */}
        <div className="about-hero section">
          <h1>{t('about.title')}</h1>
          <p className="about-hero__intro">{t('about.intro')}</p>
        </div>

        {/* Story */}
        <section className="about-content section">
          <div className="about-text">
            <h2 className="about-text__title">{t('about.story_title')}</h2>
            <p className="about-text__body">{t('about.story_text')}</p>
          </div>
          <div className="about-image">
            <div className="hoop-frame">
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, var(--color-linen) 0%, var(--color-cream) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-4xl)',
                color: 'var(--color-primary-light)',
              }}>
                ✦
              </div>
            </div>
          </div>
        </section>

        <StitchDivider />

        {/* Mission */}
        <section className="about-content about-content--reverse section">
          <div className="about-text">
            <h2 className="about-text__title">{t('about.mission_title')}</h2>
            <p className="about-text__body">{t('about.mission_text')}</p>
          </div>
          <div className="about-image">
            <div className="hoop-frame">
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-linen) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-4xl)',
                color: 'var(--color-primary-light)',
              }}>
                ❋
              </div>
            </div>
          </div>
        </section>

        <StitchDivider />

        {/* Values */}
        <section className="section" style={{ textAlign: 'center' }}>
          <h2 className="about-text__title" style={{ marginBottom: 'var(--space-2xl)' }}>
            {t('about.values_title')}
          </h2>
          <div className="values-list" style={{ maxWidth: 500, margin: '0 auto' }}>
            <div className="values-list__item">
              <div className="values-list__icon" aria-hidden="true" />
              <span>{t('about.value_1')}</span>
            </div>
            <div className="values-list__item">
              <div className="values-list__icon" aria-hidden="true" />
              <span>{t('about.value_2')}</span>
            </div>
            <div className="values-list__item">
              <div className="values-list__icon" aria-hidden="true" />
              <span>{t('about.value_3')}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

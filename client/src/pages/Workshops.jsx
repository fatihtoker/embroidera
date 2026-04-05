import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import WorkshopCard from '../components/WorkshopCard';
import { api } from '../lib/api';
import '../styles/workshops.css';

export default function Workshops() {
  const { t } = useTranslation();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWorkshops()
      .then(setWorkshops)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="workshops-page page-enter">
      <div className="container">
        <div className="section-header">
          <h1 className="section-header__title">{t('workshops.title')}</h1>
          <p className="section-header__subtitle">{t('workshops.subtitle')}</p>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : workshops.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: 'var(--space-3xl) 0' }}>
            {t('workshops.no_workshops')}
          </p>
        ) : (
          <div className="workshops-grid">
            {workshops.map((w) => (
              <WorkshopCard key={w.id} workshop={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

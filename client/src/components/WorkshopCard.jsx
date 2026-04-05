import { useTranslation } from 'react-i18next';
import '../styles/workshops.css';

/**
 * Helper to get the localized field based on current language.
 * Falls back to English if the requested language field is empty.
 */
function getLocalized(item, field, lang) {
  return item[`${field}_${lang}`] || item[`${field}_en`] || '';
}

export default function WorkshopCard({ workshop }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const title = getLocalized(workshop, 'title', lang);
  const description = getLocalized(workshop, 'description', lang);

  const formattedDate = workshop.date
    ? new Date(workshop.date).toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <article className="workshop-card">
      <div className="workshop-card__image">
        {workshop.image_url ? (
          <img src={workshop.image_url} alt={title} loading="lazy" />
        ) : (
          <div className="workshop-card__placeholder" aria-hidden="true">✦</div>
        )}
      </div>
      <div className="workshop-card__body">
        <h3 className="workshop-card__title">{title}</h3>
        {description && (
          <p className="workshop-card__desc">{description}</p>
        )}
        <div className="workshop-card__meta">
          <div className="workshop-card__meta-item">
            <span className="workshop-card__meta-label">{t('workshops.date')}</span>
            <span className="workshop-card__meta-value">{formattedDate}</span>
          </div>
          <div className="workshop-card__meta-item">
            <span className="workshop-card__meta-label">{t('workshops.location')}</span>
            <span className="workshop-card__meta-value">{workshop.location || '—'}</span>
          </div>
          <div className="workshop-card__meta-item">
            <span className="workshop-card__meta-label">{t('workshops.capacity')}</span>
            <span className="workshop-card__meta-value">{workshop.capacity || '—'}</span>
          </div>
          <div className="workshop-card__meta-item">
            <span className="workshop-card__meta-label">{t('workshops.price')}</span>
            <span className="workshop-card__meta-value">
              {workshop.price ? `€${workshop.price}` : '—'}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

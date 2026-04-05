import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/portfolio.css';

function getLocalized(item, field, lang) {
  return item[`${field}_${lang}`] || item[`${field}_en`] || '';
}

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const title = getLocalized(product, 'title', lang);
  const images = product.images || [];
  const firstImage = images[0] || null;

  return (
    <Link to={`/portfolio/${product.id}`} className="product-card" aria-label={title}>
      <div className="product-card__image">
        {firstImage ? (
          <img src={firstImage} alt={title} loading="lazy" />
        ) : (
          <div className="product-card__placeholder" aria-hidden="true">✦</div>
        )}
        <div className="product-card__overlay">
          <span className="product-card__overlay-text">
            {t('portfolio.view_details')} →
          </span>
        </div>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{title}</h3>
        {product.category && (
          <span className="product-card__category">{product.category}</span>
        )}
      </div>
    </Link>
  );
}

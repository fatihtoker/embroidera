import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import '../styles/product-detail.css';

function getLocalized(item, field, lang) {
  return item[`${field}_${lang}`] || item[`${field}_en`] || '';
}

export default function ProductDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api.getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="loading"><div className="spinner" /></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail page-enter">
        <div className="container">
          <Link to="/portfolio" className="product-detail__back">
            {t('product.back')}
          </Link>
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: 'var(--space-3xl) 0' }}>
            {t('product.not_found')}
          </p>
        </div>
      </div>
    );
  }

  const title = getLocalized(product, 'title', lang);
  const description = getLocalized(product, 'description', lang);
  const images = product.images || [];

  return (
    <div className="product-detail page-enter">
      <div className="container">
        <Link to="/portfolio" className="product-detail__back">
          {t('product.back')}
        </Link>

        <div className="product-detail__layout">
          {/* Gallery */}
          <div className="product-detail__gallery">
            <div className="product-detail__main-image">
              {images[activeImage] ? (
                <img src={images[activeImage]} alt={`${title} - ${activeImage + 1}`} />
              ) : (
                <div className="product-detail__placeholder" aria-hidden="true">✦</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="product-detail__thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`product-detail__thumb ${idx === activeImage ? 'product-detail__thumb--active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            {product.category && (
              <span className="product-detail__category">{product.category}</span>
            )}
            <h1 className="product-detail__title">{title}</h1>
            {description && (
              <p className="product-detail__description">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

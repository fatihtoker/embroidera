import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';
import '../styles/portfolio.css';

export default function Portfolio() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return cats.sort();
  }, [products]);

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <div className="portfolio-page page-enter">
      <div className="container">
        <div className="section-header">
          <h1 className="section-header__title">{t('portfolio.title')}</h1>
          <p className="section-header__subtitle">{t('portfolio.subtitle')}</p>
        </div>

        {categories.length > 0 && (
          <div className="portfolio-filter" role="group" aria-label="Filter by category">
            <button
              className={`portfolio-filter__btn ${!activeCategory ? 'portfolio-filter__btn--active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              {t('portfolio.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`portfolio-filter__btn ${activeCategory === cat ? 'portfolio-filter__btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: 'var(--space-3xl) 0' }}>
            {t('portfolio.no_products')}
          </p>
        ) : (
          <div className="portfolio-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

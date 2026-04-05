import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import StitchDivider from '../components/StitchDivider';
import WorkshopCard from '../components/WorkshopCard';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';

export default function Home() {
  const { t } = useTranslation();
  const [workshops, setWorkshops] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getWorkshops().then((data) => setWorkshops(data.slice(0, 3))).catch(() => {});
    api.getProducts().then((data) => {
      const featured = data.filter((p) => p.featured);
      setProducts(featured.length > 0 ? featured.slice(0, 6) : data.slice(0, 6));
    }).catch(() => {});
  }, []);

  return (
    <div className="page-enter">
      <Hero />

      {/* About preview */}
      <section className="section section--cream">
        <div className="container" style={{ textAlign: 'center' }}>
          <StitchDivider />
          <h2 style={{ marginBottom: 'var(--space-lg)' }}>
            {t('home.about_preview_title')}
          </h2>
          <p style={{
            maxWidth: 600,
            margin: '0 auto var(--space-2xl)',
            color: 'var(--color-text-light)',
            lineHeight: 'var(--leading-relaxed)',
            fontSize: 'var(--text-lg)',
          }}>
            {t('home.about_preview_text')}
          </p>
          <Link to="/about" className="btn btn--secondary">
            {t('home.learn_more')}
          </Link>
        </div>
      </section>

      {/* Featured Workshops */}
      {workshops.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-header__title">{t('home.featured_workshops')}</h2>
              <p className="section-header__subtitle">{t('home.featured_workshops_desc')}</p>
            </div>
            <div className="workshops-grid">
              {workshops.map((w) => (
                <WorkshopCard key={w.id} workshop={w} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
              <Link to="/workshops" className="btn btn--secondary">
                {t('home.view_all')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="section section--cream">
          <div className="container">
            <div className="section-header">
              <h2 className="section-header__title">{t('home.featured_products')}</h2>
              <p className="section-header__subtitle">{t('home.featured_products_desc')}</p>
            </div>
            <div className="portfolio-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
              <Link to="/portfolio" className="btn btn--secondary">
                {t('home.view_all')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

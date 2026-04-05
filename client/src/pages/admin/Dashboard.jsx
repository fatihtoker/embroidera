import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ workshops: 0, products: 0, messages: 0 });

  useEffect(() => {
    Promise.all([
      api.getWorkshopsAll().catch(() => []),
      api.getProductsAll().catch(() => []),
      api.getMessages().catch(() => []),
    ]).then(([workshops, products, messages]) => {
      setStats({
        workshops: workshops.length,
        products: products.length,
        messages: messages.filter((m) => !m.read).length,
      });
    });
  }, []);

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-header__title">{t('admin.dashboard')}</h1>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card__label">{t('admin.total_workshops')}</div>
          <div className="dashboard-card__value">{stats.workshops}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card__label">{t('admin.total_products')}</div>
          <div className="dashboard-card__value">{stats.products}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card__label">{t('admin.unread_messages')}</div>
          <div className="dashboard-card__value">{stats.messages}</div>
        </div>
      </div>
    </div>
  );
}

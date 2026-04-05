import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function Dashboard() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [stats, setStats] = useState({ workshops: 0, products: 0, messages: 0 });

  useEffect(() => {
    if (!token) return;

    Promise.all([
      api.getWorkshopsAll(token).catch(() => []),
      api.getProductsAll(token).catch(() => []),
      api.getMessages(token).catch(() => []),
    ]).then(([workshops, products, messages]) => {
      setStats({
        workshops: workshops.length,
        products: products.length,
        messages: messages.filter((m) => !m.read).length,
      });
    });
  }, [token]);

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

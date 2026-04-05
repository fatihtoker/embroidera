import { NavLink, Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const ADMIN_NAV = [
  { key: 'dashboard', path: '/admin', icon: '◈' },
  { key: 'manage_workshops', path: '/admin/workshops', icon: '◇' },
  { key: 'manage_products', path: '/admin/products', icon: '▣' },
  { key: 'messages', path: '/admin/messages', icon: '✉' },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">Embroidera</div>
        <nav className="admin-sidebar__nav">
          {ADMIN_NAV.map(({ key, path, icon }) => (
            <NavLink
              key={key}
              to={path}
              end={path === '/admin'}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
              }
            >
              <span className="admin-sidebar__link-icon" aria-hidden="true">{icon}</span>
              <span>{t(`admin.${key}`)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <Link to="/" className="btn btn--sm btn--secondary">
            {t('admin.back_to_site')}
          </Link>
          <button onClick={signOut} className="btn btn--sm btn--danger">
            {t('admin.sign_out')}
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}

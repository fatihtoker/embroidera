import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/navbar.css';

const NAV_ITEMS = [
  { key: 'home', path: '/' },
  { key: 'workshops', path: '/workshops' },
  { key: 'portfolio', path: '/portfolio' },
  { key: 'about', path: '/about' },
  { key: 'contact', path: '/contact' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="Embroidera home">
          Embroidera
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {NAV_ITEMS.map(({ key, path }) => (
            <li key={key}>
              <Link
                to={path}
                className={`navbar__link ${
                  location.pathname === path ? 'navbar__link--active' : ''
                }`}
              >
                {t(`nav.${key}`)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <LanguageSwitcher />
          <button
            className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/footer.css';

const NAV_LINKS = [
  { key: 'home', path: '/' },
  { key: 'workshops', path: '/workshops' },
  { key: 'portfolio', path: '/portfolio' },
  { key: 'about', path: '/about' },
  { key: 'contact', path: '/contact' },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="footer__logo">Embroidera</span>
            <p className="footer__tagline">{t('footer.tagline')}</p>
          </div>

          <div>
            <h4 className="footer__heading">{t('footer.navigation')}</h4>
            <ul className="footer__links">
              {NAV_LINKS.map(({ key, path }) => (
                <li key={key}>
                  <Link to={path} className="footer__link">
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__heading">{t('footer.connect')}</h4>
            <ul className="footer__links">
              <li>
                <a
                  href="https://instagram.com/embroidera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com/embroidera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {year} Embroidera. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}

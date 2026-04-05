import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

export default function Login() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch {
      setError(t('admin.login_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-card__title">{t('admin.login')}</h1>
        <form className="login-card__form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert--error" role="alert">{error}</div>
          )}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">{t('admin.email')}</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">{t('admin.password')}</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? '...' : t('admin.sign_in')}
          </button>
        </form>
      </div>
    </div>
  );
}

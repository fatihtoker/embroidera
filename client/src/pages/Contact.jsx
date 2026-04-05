import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import '../styles/contact.css';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      await api.sendContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page page-enter">
      <div className="container section">
        <div className="contact-layout">
          <div className="contact-info">
            <h1 className="contact-info__title">{t('contact.title')}</h1>
            <p className="contact-info__text">{t('contact.subtitle')}</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {status === 'success' && (
              <div className="alert alert--success" role="alert">
                {t('contact.success')}
              </div>
            )}
            {status === 'error' && (
              <div className="alert alert--error" role="alert">
                {t('contact.error')}
              </div>
            )}

            <div className="contact-form__row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">{t('contact.name')}</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">{t('contact.email')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">{t('contact.subject')}</label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="form-input"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">{t('contact.message')}</label>
              <textarea
                id="message"
                name="message"
                className="form-textarea"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? t('contact.sending') : t('contact.send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

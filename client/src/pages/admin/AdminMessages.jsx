import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function AdminMessages() {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getMessages(token);
      setMessages(data);
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const handleMarkRead = async (id) => {
    try {
      await api.markRead(id, token);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirm_delete'))) return;
    try {
      await api.deleteMessage(id, token);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-header__title">{t('admin.messages')}</h1>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : messages.length === 0 ? (
        <p style={{ color: 'var(--color-text-light)' }}>{t('admin.no_messages')}</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-card ${!msg.read ? 'message-card--unread' : ''}`}
          >
            <div className="message-card__header">
              <div>
                <div className="message-card__from">{msg.name}</div>
                <div className="message-card__email">{msg.email}</div>
              </div>
              <div className="message-card__date">
                {new Date(msg.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            {msg.subject && (
              <div className="message-card__subject">{msg.subject}</div>
            )}
            <div className="message-card__body">{msg.message}</div>
            <div className="message-card__actions">
              {!msg.read && (
                <button
                  className="btn btn--sm btn--secondary"
                  onClick={() => handleMarkRead(msg.id)}
                >
                  {t('admin.mark_read')}
                </button>
              )}
              <button
                className="btn btn--sm btn--danger"
                onClick={() => handleDelete(msg.id)}
              >
                {t('admin.delete')}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

const EMPTY_FORM = {
  title_en: '', title_nl: '', title_tr: '',
  description_en: '', description_nl: '', description_tr: '',
  category: '', images: [],
  status: 'draft', featured: false,
};

export default function AdminProducts() {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getProductsAll(token);
      setProducts(data);
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditing('new');
  };

  const openEdit = (product) => {
    setForm({
      ...EMPTY_FORM,
      ...product,
      images: product.images || [],
    });
    setEditing(product.id);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file, token);
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    } catch (err) {
      alert(err.message);
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editing === 'new') {
        await api.createProduct(form, token);
      } else {
        await api.updateProduct(editing, form, token);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirm_delete'))) return;
    try {
      await api.deleteProduct(id, token);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  // Form view
  if (editing !== null) {
    return (
      <div>
        <div className="admin-header">
          <h1 className="admin-header__title">
            {editing === 'new' ? t('admin.add_new') : t('admin.edit')} — {t('admin.manage_products')}
          </h1>
        </div>

        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form__row--3">
            <div className="form-group">
              <label className="form-label">{t('admin.title_en')}</label>
              <input name="title_en" className="form-input" value={form.title_en} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('admin.title_nl')}</label>
              <input name="title_nl" className="form-input" value={form.title_nl} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('admin.title_tr')}</label>
              <input name="title_tr" className="form-input" value={form.title_tr} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.desc_en')}</label>
            <textarea name="description_en" className="form-textarea" value={form.description_en} onChange={handleChange} rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin.desc_nl')}</label>
            <textarea name="description_nl" className="form-textarea" value={form.description_nl} onChange={handleChange} rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin.desc_tr')}</label>
            <textarea name="description_tr" className="form-textarea" value={form.description_tr} onChange={handleChange} rows={3} />
          </div>

          <div className="admin-form__row">
            <div className="form-group">
              <label className="form-label">{t('admin.category')}</label>
              <input name="category" className="form-input" value={form.category} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('admin.status')}</label>
              <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                <option value="draft">{t('admin.draft')}</option>
                <option value="published">{t('admin.published')}</option>
                <option value="archived">{t('admin.archived')}</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
              {t('admin.featured')}
            </label>
          </div>

          {/* Images */}
          <div className="form-group">
            <label className="form-label">{t('admin.images')}</label>
            {form.images.length > 0 && (
              <div className="image-preview">
                {form.images.map((url, idx) => (
                  <div key={idx} className="image-preview__item">
                    <img src={url} alt="" />
                    <button type="button" className="image-preview__remove" onClick={() => removeImage(idx)}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="image-upload" style={{ marginTop: form.images.length > 0 ? 'var(--space-md)' : 0 }}>
              <span className="image-upload__label">
                {uploading ? '...' : t('admin.upload_image')}
              </span>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </div>
          </div>

          <div className="admin-form__actions">
            <button type="button" className="btn btn--secondary" onClick={() => setEditing(null)}>
              {t('admin.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? '...' : t('admin.save')}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-header__title">{t('admin.manage_products')}</h1>
        <button className="btn btn--primary" onClick={openNew}>
          {t('admin.add_new')}
        </button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <p style={{ color: 'var(--color-text-light)' }}>{t('admin.no_items')}</p>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>{t('admin.title_en')}</th>
                <th>{t('admin.category')}</th>
                <th>{t('admin.status')}</th>
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.title_en}</td>
                  <td>{p.category || '—'}</td>
                  <td>
                    <span className={`status-badge status-badge--${p.status}`}>
                      {t(`admin.${p.status}`)}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="btn btn--sm btn--secondary" onClick={() => openEdit(p)}>
                        {t('admin.edit')}
                      </button>
                      <button className="btn btn--sm btn--danger" onClick={() => handleDelete(p.id)}>
                        {t('admin.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

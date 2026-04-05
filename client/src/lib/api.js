const API_BASE = '/api';

/**
 * Helper to make authenticated API calls.
 * Automatically attaches the Supabase session token.
 */
async function request(endpoint, options = {}) {
  const { method = 'GET', body, token, headers: customHeaders = {} } = options;

  const headers = { ...customHeaders };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Workshops
  getWorkshops: () => request('/workshops'),
  getWorkshopsAll: (token) => request('/workshops/all', { token }),
  getWorkshop: (id) => request(`/workshops/${id}`),
  createWorkshop: (body, token) => request('/workshops', { method: 'POST', body, token }),
  updateWorkshop: (id, body, token) => request(`/workshops/${id}`, { method: 'PUT', body, token }),
  deleteWorkshop: (id, token) => request(`/workshops/${id}`, { method: 'DELETE', token }),

  // Products
  getProducts: () => request('/products'),
  getProductsAll: (token) => request('/products/all', { token }),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (body, token) => request('/products', { method: 'POST', body, token }),
  updateProduct: (id, body, token) => request(`/products/${id}`, { method: 'PUT', body, token }),
  deleteProduct: (id, token) => request(`/products/${id}`, { method: 'DELETE', token }),

  // Upload
  uploadImage: (file, token) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/upload', { method: 'POST', body: formData, token });
  },

  // Contact
  sendContact: (body) => request('/contact', { method: 'POST', body }),
  getMessages: (token) => request('/contact', { token }),
  markRead: (id, token) => request(`/contact/${id}/read`, { method: 'PUT', token }),
  deleteMessage: (id, token) => request(`/contact/${id}`, { method: 'DELETE', token }),
};

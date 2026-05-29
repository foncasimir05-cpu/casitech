import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('casitech_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('casitech_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Convenience API functions ──────────────────────────
export const productsAPI = {
  getAll:    (params) => api.get('/products', { params }),
  getOne:    (id)     => api.get(`/products/${id}`),
  create:    (data)   => data instanceof FormData
    ? api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    : api.post('/products', data),
  update:    (id, d)  => api.put(`/products/${id}`, d),
  remove:    (id)     => api.delete(`/products/${id}`),
  getReviews:(id)     => api.get(`/products/${id}/reviews`),
  addReview: (id, d)  => api.post(`/products/${id}/reviews`, d),
};

export const authAPI = {
  register: (d)  => api.post('/auth/register', d),
  login:    (d)  => api.post('/auth/login', d),
  me:       ()   => api.get('/auth/me'),
  logout:   ()   => api.post('/auth/logout'),
};

export const cartAPI = {
  get:    ()        => api.get('/cart'),
  add:    (d)       => api.post('/cart/add', d),
  update: (id, qty) => api.put(`/cart/${id}`, { quantity: qty }),
  remove: (id)      => api.delete(`/cart/${id}`),
  clear:  ()        => api.delete('/cart'),
};

export const ordersAPI = {
  create:  (d)  => api.post('/orders', d),
  getAll:  ()   => api.get('/orders'),
  getOne:  (id) => api.get(`/orders/${id}`),
};

export const userAPI = {
  getProfile:     ()        => api.get('/users/profile'),
  updateProfile:  (d)       => api.put('/users/profile', d),
  getWishlist:    ()        => api.get('/users/wishlist'),
  toggleWishlist: (id)      => api.post(`/users/wishlist/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
};

export const uploadAPI = {
  image: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/uploads/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

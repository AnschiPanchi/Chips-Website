// Frontend API client — replaces the old base44Client mock
// All calls go to http://localhost:3001/api

// Clean and robust base URL resolution
function getBaseUrl() {
  const envUrl = (import.meta.env.VITE_API_URL || "").trim();
  if (!envUrl || envUrl === "/api") return "/api";

  // Strip all trailing slashes
  let clean = envUrl.replace(/\/+$/, "");

  // If user passed backend URL without /api, append /api
  if (!clean.endsWith("/api")) {
    clean = `${clean}/api`;
  }
  return clean;
}

const BASE = getBaseUrl();

function buildUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");
}

// ── Token management ─────────────────────────────────────────
function getTokens() {
  try {
    return {
      access: localStorage.getItem("moro_access_token"),
      refresh: localStorage.getItem("moro_refresh_token"),
    };
  } catch { return { access: null, refresh: null }; }
}

function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("moro_access_token", accessToken);
  if (refreshToken) localStorage.setItem("moro_refresh_token", refreshToken);
}

function clearTokens() {
  localStorage.removeItem("moro_access_token");
  localStorage.removeItem("moro_refresh_token");
  localStorage.removeItem("moro_user");
}

// ── Core fetch wrapper with auto-refresh ─────────────────────
let refreshing = null;

async function request(path, options = {}, retry = true) {
  const { access, refresh } = getTokens();

  const headers = {
    "Content-Type": "application/json",
    ...(access && { Authorization: `Bearer ${access}` }),
    ...options.headers,
  };

  const targetUrl = buildUrl(path);
  const res = await fetch(targetUrl, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && retry && refresh) {
    if (!refreshing) {
      refreshing = fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.ok) setTokens(data);
          else clearTokens();
          return data;
        })
        .finally(() => { refreshing = null; });
    }
    const refreshResult = await refreshing;
    if (refreshResult?.ok) return request(path, options, false);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Network error" }));
    throw Object.assign(new Error(err.message || "Request failed"), { status: res.status, data: err });
  }

  return res.json();
}

const api = {
  get: (path, opts) => request(path, { method: "GET", ...opts }),
  post: (path, body, opts) => request(path, { method: "POST", body: JSON.stringify(body), ...opts }),
  patch: (path, body, opts) => request(path, { method: "PATCH", body: JSON.stringify(body), ...opts }),
  delete: (path, opts) => request(path, { method: "DELETE", ...opts }),
};

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post("/auth/register", data).then(d => { setTokens(d); return d; }),
  login: (data) => api.post("/auth/login", data).then(d => { setTokens(d); return d; }),
  logout: () => {
    const { refresh } = getTokens();
    return api.post("/auth/logout", { refreshToken: refresh }).finally(clearTokens);
  },
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.patch("/auth/me", data),
  changePassword: (data) => api.patch("/auth/change-password", data),
  addAddress: (data) => api.post("/auth/addresses", data),
  updateAddress: (id, data) => api.patch(`/auth/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
  hasToken: () => !!getTokens().access,
};

// ── Products ─────────────────────────────────────────────────
export const productsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/products${q ? "?" + q : ""}`);
  },
  bySlug: (slug) => api.get(`/products/${slug}`),
  bestsellers: (limit = 6) => api.get(`/products/bestsellers?limit=${limit}`),
  bundles: () => api.get("/products/bundles"),
};

// ── Payments & Orders ─────────────────────────────────────────
export const paymentsApi = {
  createRazorpayOrder: (payload) => api.post("/payments/create-order", payload),
  verify: (payload) => api.post("/payments/verify", payload),
  cod: (payload) => api.post("/payments/cod", payload),
  getKey: () => api.get("/payments/key"),
};

export const ordersApi = {
  mine: () => api.get("/orders/my"),
  byNumber: (num) => api.get(`/orders/${num}`),
};

// ── Coupons ───────────────────────────────────────────────────
export const couponsApi = {
  validate: (code, subtotal) => api.post("/coupons/validate", { code, subtotal }),
};

// ── Newsletter & Campaigns ─────────────────────────────────────
export const newsletterApi = {
  subscribe: ({ email, phone }) => api.post("/newsletter/subscribe", { email, phone }),
  subscribers: () => api.get("/newsletter/subscribers"),
};

// ── Admin ─────────────────────────────────────────────────────
export const adminApi = {
  stats: () => api.get("/admin/stats"),
  customers: (p) => api.get(`/admin/customers?${new URLSearchParams(p)}`),
  updateStock: (id, variantIndex, stock) => api.patch(`/admin/products/${id}/stock`, { variantIndex, stock }),
  orders: (p) => api.get(`/orders?${new URLSearchParams(p)}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  notifyOrder: (id, type = "status") => api.post(`/orders/${id}/notify`, { type }),
  broadcast: (data) => api.post("/admin/broadcast", data),
  audience: () => api.get("/admin/audience"),
  products: (p) => api.get(`/products?${new URLSearchParams(p)}`),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),
  coupons: () => api.get("/coupons"),
  createCoupon: (data) => api.post("/coupons", data),
  updateCoupon: (id, data) => api.patch(`/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
};

// Legacy compat shim (kept so nothing breaks during migration)
export const base44 = {
  auth: {
    hasToken: authApi.hasToken,
    me: () => authApi.me().then(d => d.user).catch(() => null),
    login: authApi.login,
    logout: authApi.logout,
    register: authApi.register,
  },
};

export default api;

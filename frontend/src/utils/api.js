import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hx_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};

export const ordersApi = {
  getAll: (dateFilter) => api.get("/orders", { params: { dateFilter } }).then((r) => r.data),
  create: (data) => api.post("/orders", data).then((r) => r.data),
  update: (id, data) => api.put(`/orders/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/orders/${id}`).then((r) => r.data),
};

export const dashboardApi = {
  get: () => api.get("/dashboard").then((r) => r.data),
  save: (data) => api.post("/dashboard", data).then((r) => r.data),
};

export const usersApi = {
  getEmployees: () => api.get("/users").then((r) => r.data),
  getEmployee: (id) => api.get(`/users/${id}`).then((r) => r.data),
  updateEmployee: (id, data) => api.put(`/users/${id}`, data).then((r) => r.data),
  setTarget: (id, monthlyTarget) => api.put(`/users/${id}/target`, { monthlyTarget }).then((r) => r.data),
  sendReminder: (id) => api.post(`/users/${id}/remind`).then((r) => r.data),
};

export const notificationsApi = {
  getAll: () => api.get("/notifications").then((r) => r.data),
  markAllRead: () => api.put("/notifications/read-all").then((r) => r.data),
  markOneRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
};

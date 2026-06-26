import axios from "axios";

const api = axios.create({
  baseURL: 'https://app-60b31aca-0db9-4f67-94d3-191bf1e88a75.cleverapps.io/api',
  headers: {
    "Content-Type": "application/json",
  },
});

// بيبعت الـ JWT token تلقائياً مع كل request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// لو الـ token انتهى يرجعه للـ login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/Auth/login")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

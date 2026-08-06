import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.startsWith("/user/login") &&
          !window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/user/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

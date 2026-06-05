import axios from "axios";

const api = axios.create({
  baseURL: "https://sql-generator-backend-production.up.railway.app/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      config.headers.Authorization = undefined;
    }

    return config;
  },

  (error) => Promise.reject(error),
);

export default api;

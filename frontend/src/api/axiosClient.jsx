import axios from "axios";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// INTERCEPTOR REQUEST
axiosClient.interceptors.request.use(
  (config) => {

    // Nếu là FormData thì để axios tự set Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      // Ngược lại, request thường → JSON
      config.headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR RESPONSE
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (error.response?.status === 401 && accessToken) {
      if (!refreshToken) {
        localStorage.removeItem("access_token");
        toast.error("Phiên đăng nhập đã hết hạn");
        window.location.replace("/login");
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { token: refreshToken }
        );

        if (res.status === 200) {
          localStorage.setItem("access_token", res.data.access_token);

          axiosClient.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.access_token}`;

          originalRequest.headers["Authorization"] =
            `Bearer ${res.data.access_token}`;

          return axios(originalRequest);
        }
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refreshToken");
        toast.error("Phiên đăng nhập đã hết hạn");
        window.location.replace("/login");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

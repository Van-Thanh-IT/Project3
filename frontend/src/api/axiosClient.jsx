import axios from "axios";
import { toast } from "react-toastify";
// tạo axios client riêng cho các request
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

//tạo token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refreshToken");

    // Chỉ xử lý 401 nếu đang có token
    if (error.response?.status === 401 && accessToken) {

      if (!refreshToken) {
        // Token hết hạn, không có refreshToken
        localStorage.removeItem("access_token");
        toast.error("Phiên đăng nhập đã hết hạn");
        window.location.replace("/login");
        return Promise.reject(error);
      }

      try {
        // refresh token
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, { token: refreshToken });

        if (res.status === 200) {
          localStorage.setItem('access_token', res.data.access_token);
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;

          originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
          return axios(originalRequest);
        }
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refreshToken');
        toast.error("Phiên đăng nhập đã hết hạn");
        window.location.replace("/login");
        return Promise.reject(err);
      }
    }
    // Nếu chưa có token → chỉ reject, không logout
    return Promise.reject(error);
  }
);

export default axiosClient;

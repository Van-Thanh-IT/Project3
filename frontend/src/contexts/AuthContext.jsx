import { createContext, useContext, useState, useEffect} from "react";
import AuthService from "../services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await AuthService.getMe();
      setMe(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      setMe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
}, []);

  const register = async (data) => {
    const res = await AuthService.register(data);
    return res.data;
  };

  const login = async (data) => {
    const res = await AuthService.login(data);
    localStorage.setItem("access_token", res.data.access_token);
    await fetchMe();
    return res.data;
  };


  const loginWithGoogle = async (token) => {
    const res = await AuthService.loginWithGoogle(token);
    localStorage.setItem("access_token", res.data.access_token);
    await fetchMe();
    return res.data;
  };

  const loginWithFacebook = async (token) => {
    const res = await AuthService.loginWithFacebook(token);
    localStorage.setItem("access_token", res.data.access_token);
    await fetchMe();
    return res.data;
  };

  const logout = async () => {
    await AuthService.logout();
    localStorage.removeItem("access_token");
    setMe(null);
  };

  const forgotPassword = async (email) => {
    const res = await AuthService.forgotPassword(email);
    return res.data;
  }

  const resetPassword = async (data) => {
    const res = await AuthService.resetPassword(data);
    await fetchMe();
    return res.data;
  }
  return (
    <AuthContext.Provider value={
        { 
            register,
            login,
            loginWithGoogle,
            loginWithFacebook,
            logout,
            forgotPassword,
            resetPassword,
            loading,
            me
        }
        }>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

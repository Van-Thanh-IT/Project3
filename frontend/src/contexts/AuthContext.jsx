import { createContext, useContext, useState, useEffect} from "react";
import AuthService from "../services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const fetchMe = async () => {
    try {
      const res = await AuthService.getMe();
      setMe(res.data.user);
      setRoles(res.data.roles);
       
      setPermissions(res.data.permissions);
      return res.data;
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
    try {
      await AuthService.logout(); 
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
      localStorage.removeItem("access_token");
      setMe(null);
      setRoles([]);
      setPermissions([]); 
    }
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
            fetchMe,
            loading,
            me, roles, permissions
        }
        }>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);



// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import AuthService from "../services/AuthService";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [me, setMe] = useState(null);
//   const [roles, setRoles] = useState([]);
//   const [permissions, setPermissions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Lấy info người dùng, trả luôn dữ liệu
//   const fetchMe = useCallback(async () => {
//     try {
//       const res = await AuthService.getMe();
//       const { user, roles, permissions } = res.data;
//       setMe(user);
//       setRoles(roles || []);
//       setPermissions(permissions || []);
//       return res.data;
//     } catch (err) {
//       console.error("Lỗi khi lấy thông tin người dùng:", err);
//       setMe(null);
//       setRoles([]);
//       setPermissions([]);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Khởi tạo khi load app
//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (token) fetchMe();
//     else setLoading(false);
//   }, [fetchMe]);

//   // Hàm login chung
//   const handleLogin = async (loginFn) => {
//     const res = await loginFn();
//     if (res?.data?.access_token) {
//       localStorage.setItem("access_token", res.data.access_token);
//       await fetchMe();
//     }
//     return null;
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         me,
//         roles,
//         permissions,
//         loading,
//         fetchMe,
//         register: async (data) => (await AuthService.register(data)).data,
//         login: (data) => handleLogin(() => AuthService.login(data)),
//         loginWithGoogle: (token) => handleLogin(() => AuthService.loginWithGoogle(token)),
//         loginWithFacebook: (token) => handleLogin(() => AuthService.loginWithFacebook(token)),
//         logout: async () => {
//           await AuthService.logout();
//           localStorage.removeItem("access_token");
//           setMe(null);
//           setRoles([]);
//           setPermissions([]);
//         },
//         forgotPassword: async (email) => (await AuthService.forgotPassword(email)).data,
//         resetPassword: async (data) => {
//           const res = await AuthService.resetPassword(data);
//           await fetchMe();
//           return res.data;
//         },
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

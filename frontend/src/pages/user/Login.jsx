import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { redirectByRole } from "../../utils/redirectByRole";

const Login = () => {
  const { login, loginWithGoogle, loginWithFacebook, fetchMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Hàm xử lý input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Hàm chung cho mọi loại login
  const handleLogin = async (loginFn) => {
  setLoading(true);
  try {
    await loginFn();
    const meData = await fetchMe();

    if (!meData.user) {
      toast.error("Không lấy được thông tin tài khoản!");
      return;
    }
    if (meData.user.status !== "active") {
      toast.error("Tài khoản của bạn đã bị khoá hoặc không hoạt động!");
      return; 
    }

    if (meData.roles && meData.roles.length > 0) {
      redirectByRole(meData.roles, navigate);
    } else {
      navigate("/");
    }

    toast.success("Đăng nhập thành công!");
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Đăng nhập thất bại!");
  } finally {
    setLoading(false);
  }
};

  // Submit email/password
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(() => login(formData));
  };

  // Google login
  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) return toast.error("Đăng nhập Google thất bại!");
    handleLogin(() => loginWithGoogle(token));
  };

  // Facebook login
  const handleFacebookSuccess = (response) => {
    const token = response?.accessToken;
    if (!token) return toast.error("Đăng nhập Facebook thất bại!");
    handleLogin(() => loginWithFacebook(token));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h1>

      {/* Form email/password */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {/* Quên mật khẩu */}
      <div className="mt-2">
        <Link to="/forgot-password" className="text-blue-600">
          Quên mật khẩu bằng email
        </Link>
      </div>

      {/* Đăng ký */}
      <p className="mt-4 text-center">
        Bạn chưa có tài khoản?{" "}
        <Link to="/register" className="text-blue-600">
          Đăng ký
        </Link>
      </p>

      {/* Social login */}
      <div className="mt-6 flex flex-col gap-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Không thể đăng nhập bằng Google!")}
        />
        <FacebookLogin
          className="bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800"
          appId="2016734672462629"
          onSuccess={handleFacebookSuccess}
          onFail={() => toast.error("Không thể đăng nhập bằng Facebook!")}
        />
      </div>
    </div>
  );
};

export default Login;

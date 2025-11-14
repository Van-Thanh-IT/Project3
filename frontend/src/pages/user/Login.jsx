import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { Link } from "react-router-dom";
const Login = () => {
  const { login, loginWithGoogle, loginWithFacebook} = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success("Đăng nhập thành công!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) return toast.error("Đăng nhập Google thất bại!");
    try {
      setLoading(true);
      await loginWithGoogle(token);
      toast.success("Đăng nhập Google thành công!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSuccess = async (response) => {
    const token = response?.accessToken;
    if (!token) return toast.error("Facebook login thất bại!");
    try {
      setLoading(true);
      await loginWithFacebook(token);
      toast.success("Đăng nhập Facebook thành công!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Đăng nhập Facebook thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h1>

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

      <div>
        <Link to= "/forgot-password" className="text-blue-600">Quên mật khẩu bằng email</Link>
      </div>

      <p className="mt-4 text-center">
        Bản chưa có tài khoản?{" "}
        <Link to= "/register" className="text-blue-600">Đăng ký</Link>
      </p>

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

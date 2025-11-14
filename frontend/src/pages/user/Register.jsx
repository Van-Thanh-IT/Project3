import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

   if( form.password !== form.password_confirmation){
        errors.password_confirmation = "Mật khẩu không khớp";
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      setLoading(true);
      await register(form);
      toast.success("Đăng ký thành công");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setErrors(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Đăng ký</h1>

      {errors.general && (
        <p className="text-red-500 mb-2 text-center">{errors.general}</p>
      )}
    
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Mật khẩu"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Số điện thoại"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded text-white font-bold ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
      <p className="mt-4 text-center">
              Ban đã có tài khoản?{" "}
              <Link to= "/login" className="text-blue-600">Đăng nhập</Link>
      </p>
    </div>
  );
};
export default Register;

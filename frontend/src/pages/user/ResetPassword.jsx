import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  //Lấy token và email từ URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const data = {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      }
      const response = await resetPassword(data); 
      toast.success(response?.message || "Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      toast.error(error?.response?.data?.errors.password[0] || "Đặt lại mật khẩu thất bại!");
    }
  };

  return (
    <div>
      <h2>Đặt lại mật khẩu</h2>
      <form  onSubmit={handleSubmit}>
        <p>Email: {email}</p>
        <input
          type="password"
          placeholder="Nhập mật khẩu mới."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu mới."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-700">Đặt lại</button>
      </form>
    </div>
  );
};

export default ResetPassword;

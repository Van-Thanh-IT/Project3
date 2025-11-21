import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Profile = () => {
  const { me, roles, loading, logout, forgotPassword} = useAuth();
  const isSeller = roles.includes("seller");
  const [cooldown, setCooldown] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = async () => { // Thêm async
      if (!window.confirm("Bạn có chắc muốn đăng xuất không?")) return;
      await logout(); 
      navigate("/login");
    };

const handleForgotPassword = async () => {
  if (cooldown) return;
  setCooldown(true);

  try {
    const res = await forgotPassword(me.email);
    toast.success(res.message); 
    setCooldown(false);
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Gửi email thất bại");
  } finally {
    setTimeout(() => setCooldown(false), 60000); // 60s cooldown
  }
};


  if (loading) return <div className="text-center mt-10 text-gray-500">Đang tải thông tin...</div>;
  if (!me) return <div className="text-center mt-10 text-red-500">Không tìm thấy thông tin người dùng!</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-6 border-b pb-6">
        {/* Avatar */}
        <img
          src={me.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />

        {/* Tên và Email */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {me.username || "Chưa có tên"}
          </h1>
          <p className="text-gray-500">{me.email}</p>
          <p className="text-sm text-gray-400 mt-1">
            ID: {me.id} | Trạng thái:{" "}
            <span
              className={`font-medium ${
                me.status === "active" ? "text-green-500" : "text-red-500"
              }`}
            >
              {me.status}
            </span>
          </p>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Giới tính:</span>
          <span className="text-gray-800 capitalize">{me.gender}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Ngày sinh:</span>
          <span className="text-gray-800">
            {new Date(me.date_of_birth).toLocaleDateString("vi-VN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Số điện thoại:</span>
          <span className="text-gray-800">{me.phone}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Tài khoản:</span>
          <span className="text-gray-800">{me.provider}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Ngày tạo:</span>
          <span className="text-gray-800">
            {new Date(me.created_at).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="mt-8 flex justify-end gap-4">

      {!isSeller && (
          <a href="/seller-registration">Đăng ký bán hàng</a>
        )}

      <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-gray-300 rounded-lg text-gray-700">
          Đăng xuất
        </button>
        <button disabled={cooldown} onClick={handleForgotPassword} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700">
          {cooldown ? "Email đang gửi..." : "Đổi mật khẩu bằng email"}
        </button>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
          Cập nhật thông tin
        </button>
      </div>
     
    </div>
  );
};

export default Profile;

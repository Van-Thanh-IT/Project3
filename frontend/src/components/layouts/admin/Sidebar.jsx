import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa"; // dùng namespace để tránh lỗi React child
import { useAuth } from "../../../contexts/AuthContext";
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {roles} = useAuth();
  const isStaff = roles.includes("staff");

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (!window.confirm("Bạn có muốn đăng xuất không?")) return;
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const menuItems = [
    { name: "Trang chủ", path: "/admin", icon: <FaIcons.FaHome size={20} /> },
    {name:"Quản lý nhân viên", path: "/admin/staff", icon: <FaIcons.FaUsers size={20} /> },
    {name: "Quản lý nhười bán hàng", path: "/admin/sellers", icon: <FaIcons.FaUsers size={20} /> },
    {name: "Quản lý người dùng", path: "/admin/users", icon: <FaIcons.FaUsers size={20} /> },
    {name: "Quản lý danh mục", path: "/admin/categories", icon: <FaIcons.FaListAlt size={20} /> },
    { name: "Quản lý sản phẩm", path: "/admin/products", icon: <FaIcons.FaBoxOpen size={20} /> },

    { name: "Cài đặt", path: "/admin/settings", icon: <FaIcons.FaListAlt size={20} /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col overflow-y-auto">
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
        Admin
      </div>

     <ul className="mt-4 flex flex-col gap-1 px-2">
      {menuItems
        .filter(item => {
          // Ẩn menu quản lý nhân viên nếu là staff
          if (item.name === "Quản lý nhân viên" && isStaff) return false;
            if (item.name === "Cài đặt" && isStaff) return false;
          return true;
        })
        .map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition-colors ${
                isActive(item.path) ? "bg-gray-700" : ""
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}

        <li className="mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-gray-700 transition-colors text-left"
          >
            <FaIcons.FaSignOutAlt size={20} />
            <span>Đăng xuất</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

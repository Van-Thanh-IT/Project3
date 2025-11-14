import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa"; // dùng namespace để tránh lỗi React child

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (!window.confirm("Bạn có muốn đăng xuất không?")) return;
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const menuItems = [
    { name: "Trang chủ", path: "/admin", icon: <FaIcons.FaHome size={20} /> },
    { name: "Quản lý sản phẩm", path: "/admin/products", icon: <FaIcons.FaBoxOpen size={20} /> },
    { name: "Cài đặt", path: "/admin/settings", icon: <FaIcons.FaListAlt size={20} /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col overflow-y-auto">
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
        Admin
      </div>

      <ul className="mt-4 flex flex-col gap-1 px-2">
        {menuItems.map((item) => (
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

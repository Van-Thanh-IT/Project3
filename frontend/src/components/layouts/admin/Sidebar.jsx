import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // Điều chỉnh đường dẫn import nếu cần

// Import Icons từ Heroicons (đồng bộ với toàn project)
import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  FolderIcon,
  CubeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roles } = useAuth();
  
  // Kiểm tra role an toàn
  const isStaff = roles && roles.includes("staff");

  const isActive = (path) => {
    // Active exact match hoặc active parent path (nếu cần)
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc chắn muốn đăng xuất?")) return;
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // Cấu hình Menu
  const menuItems = [
    { name: "Trang chủ", path: "/admin", icon: HomeIcon },
    { name: "Quản lý nhân viên", path: "/admin/staff", icon: UserGroupIcon },
    { name: "Quản lý người bán", path: "/admin/sellers", icon: BuildingStorefrontIcon },
    { name: "Quản lý người dùng", path: "/admin/users", icon: UsersIcon },
    { name: "Quản lý danh mục", path: "/admin/categories", icon: FolderIcon },
    { name: "Quản lý sản phẩm", path: "/admin/products", icon: CubeIcon },
    { name: "Cài đặt", path: "/admin/settings", icon: Cog6ToothIcon },
  ];

  // Lọc menu dựa trên quyền hạn
  const filteredMenuItems = menuItems.filter((item) => {
    if (isStaff) {
      // Staff không thấy Quản lý nhân viên và Cài đặt
      if (item.name === "Quản lý nhân viên" || item.name === "Cài đặt") return false;
    }
    return true;
  });

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-50 transition-all duration-300">
      
      {/* 1. LOGO AREA */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800/50">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <ChartBarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide leading-tight">Admin</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* 2. MENU ITEMS */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 custom-scrollbar">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu chính</p>
        
        {filteredMenuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "hover:bg-slate-800 hover:text-white text-slate-400"
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  active ? "text-white" : "text-slate-500 group-hover:text-white"
                }`}
              />
              <span>{item.name}</span>
              
              {/* Chỉ báo active nhỏ bên phải (Optional) */}
              {active && (
                <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-sm animate-pulse"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. USER PROFILE / LOGOUT */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900">
        <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-3 px-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                    AD
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">Administrator</p>
                    <p className="text-xs text-slate-500 truncate">{isStaff ? 'Staff' : 'Super Admin'}</p>
                </div>
            </div>
            <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-200 border border-red-500/20 hover:border-transparent"
            >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            Đăng xuất
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute với role
 * @param allowedRoles - mảng role được phép truy cập
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ví dụ "admin", "user"

  if (!token) {
    // Chưa đăng nhập => chuyển đến login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Không đủ quyền => chuyển về trang home
    return <Navigate to="/" replace />;
  }

  // Token hợp lệ + role hợp lệ => render Outlet
  return <Outlet />;
};

export default ProtectedRoute;

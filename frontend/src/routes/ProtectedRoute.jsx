import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles = [], allowedPermissions = [] }) => {
  const { me, roles, permissions, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  if (!me) return <Navigate to="/login" replace />;

  // Kiểm tra role
  if (allowedRoles.length > 0) {
    const hasRole = roles.some(r => allowedRoles.includes(r));
    if (!hasRole) return <Navigate to="/login" replace />;
  }

  // // Kiểm tra permission
  // if (allowedPermissions.length > 0) {
  //   const hasPermission = permissions.some(p => allowedPermissions.includes(p));
  //   if (!hasPermission) return <Navigate to="/" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// layouts
import UserMainLayout from "../components/layouts/user/MainLayout";
import AdminMainLayout from "../components/layouts/admin/MainLayout";
import SellerMainLayout from "../components/layouts/seller/MainLayout";

// client
import Home from "../pages/user/Home";
import About from "../pages/user/About";
import Contact from "../pages/user/Contact";
import Cart from "../pages/user/Cart";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Profile from "../pages/user/Profile";
import ResetPassword from "../pages/user/ResetPassword";
import ForgotPassword from "../pages/user/ForgotPassword";


// admin
import AdminDashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagerment";
import AdminSettings from "../pages/admin/Settings";
import AdminStaffManagement from "../pages/admin/StaffManagement";
import AdminSellerManagerment from "../pages/admin/SellerManagerment";
import AdminProductManagerment from "../pages/admin/ProductManagerment";
import AdminCategoryManagerment from "../pages/admin/CategoryManagerment";

// seller
import SellerDashboard from "../pages/seller/Dashboard";
import SellerProductManagerment from "../pages/seller/ProductManagerment";
import SellerOrderManagerment from "../pages/seller/OrderManagerment";
import SellerCustomerManagerment from "../pages/seller/CustomerManagerment";
import SellerPromotionManagerment from "../pages/seller/PromotionManagerment";
import SellerInventoryManagerment from "../pages/seller/InventoryManagerment";
import SellerSettings from "../pages/seller/Settings";
import SellerRegistration from "../pages/seller/Registeration";
// protected route
import ProtectedRoute from "./ProtectedRoute";

const AppRoute = () => {
  return (
    <Router>
      <Routes>
        {/*  USER ROUTES */}
        <Route path="/" element={<UserMainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="seller-registration" element={<SellerRegistration />} />
        </Route>

        {/*ADMIN ROUTES*/}
      <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
        <Route path="/admin" element={<AdminMainLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductManagerment />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="sellers" element={<AdminSellerManagerment />} />
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />} >
             <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />} >
             <Route path="staff" element={<AdminStaffManagement />} />
          </Route>
          <Route path="categories" element={<AdminCategoryManagerment />} />
        </Route>
      </Route>

      {/* SELLER ROUTES */}
    <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
        <Route path="/seller" element={<SellerMainLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProductManagerment />} />
          <Route path="orders" element={<SellerOrderManagerment />} />
          <Route path="customers" element={<SellerCustomerManagerment />} />
          <Route path="promotions" element={<SellerPromotionManagerment />} />
          <Route path="inventory" element={<SellerInventoryManagerment />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>
      </Route>
    </Routes>
    </Router>
  );
};

export default AppRoute;

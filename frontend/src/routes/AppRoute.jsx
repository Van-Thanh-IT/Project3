import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserMainLayout from "../components/layouts/user/UserMainLayout";
import AdminMainLayout from "../components/layouts/admin/AdminMainLayout";

import Home from "../pages/user/Home";
import About from "../pages/user/About";
import Contact from "../pages/user/Contact";
import Cart from "../pages/user/Cart";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Profile from "../pages/user/Profile";
import ResetPassword from "../pages/user/ResetPassword";
import ForgotPassword from "../pages/user/ForgotPassword";

import Dashboard from "../pages/admin/Dashboard";
import ProductManagerment from "../pages/admin/ProductManagerment";
import Settings from "../pages/admin/Settings";

const AppRoute = () => {
  return (
    <Router>
      <Routes>
        {/* ===== USER ROUTES ===== */}
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
        </Route>

        {/* ===== ADMIN ROUTES ===== */}
        <Route path="/admin" element={<AdminMainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagerment />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoute;

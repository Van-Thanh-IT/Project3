import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserMainLayout from "../components/layouts/user/UserMainLayout";

import Home from "../pages/user/Home";
import About from "../pages/user/About";
import Contact from "../pages/user/Contact";
import Cart from "../pages/user/Cart";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";

const AppRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserMainLayout />}>
         <Route index element={<Home />} /> 
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoute;

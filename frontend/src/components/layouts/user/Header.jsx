import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const Header = () => {
  const { roles } = useAuth();
  const user = roles.includes("user");
  const isSeller = roles.includes("seller");

  return (
    <header className="bg-green-400 w-full">
      {/* Container căn giữa */}
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          <Link to="/">MyShop</Link>
        </div>

        {/* Menu */}
        <nav>
          <ul className="flex gap-6 text-white font-medium">
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/about">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
            <li>
              <Link to="/cart">Giỏ hàng</Link>
            </li>
            {!user && (
              <>
                <li>
                  <Link to="/login">Đăng nhập</Link>
                </li>
                <li>
                  <Link to="/register">Đăng ký</Link>
                </li>
              </>
            )}
            {user && (
              <li>
                <Link to="/profile">Trang cá nhân</Link>
              </li>
            )}
            {isSeller && (
              <li>
                <Link to="/seller">Quản lý bán hàng</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

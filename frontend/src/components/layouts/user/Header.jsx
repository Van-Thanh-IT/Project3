import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div>
      <header className="bg-green-600 text-white m-auto p-10">
        <nav>
          <ul className="flex d-flex gap-5 text-2xl">
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
            <li>
              <Link to="/login">Đang nhập</Link>
            </li>
            <li>
              <Link to="/register">Đăng ký</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;

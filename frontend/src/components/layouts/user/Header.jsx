import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// --- MOCK AUTH CONTEXT (Thay thế cho import bị lỗi) ---
// Bạn có thể xóa đoạn này và uncomment dòng import thật khi đưa vào dự án
const useAuth = () => {
  // Giả lập user đã đăng nhập. Để test giao diện chưa đăng nhập, hãy sửa roles thành []
  return {
    user: { username: "Demo User", avatar: null },
    roles: ["seller"],
    logout: () => {
      console.log("Mock logout");
      window.location.href = "/login";
    }
  };
};
// Import Icons
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";


const Header = () => {
  const { roles, user, logout } = useAuth(); 

  const navigate = useNavigate();
  const isSeller = roles && roles.includes("seller");
  const isLoggedIn = roles && roles.length > 0;

  // State UI
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Demo số lượng giỏ hàng

  const userMenuRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (logout) logout();
    else localStorage.removeItem("access_token");
    
    navigate("/login");
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-emerald-600 text-white sticky top-0 z-50 shadow-lg transition-all">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. LOGO & BRAND */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <ShoppingBagIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight hidden sm:block">
              SINHVIEN_SHOP
            </span>
          </div>

          {/* 2. SEARCH BAR (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative group">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-emerald-700/50 text-white placeholder-emerald-200 border border-emerald-500 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:ring-2 focus:ring-white/50 transition-all duration-300"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-emerald-500 hover:bg-emerald-400 text-white p-1.5 rounded-full transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>

          {/* 3. ACTIONS & NAVIGATION */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Main Nav Links */}
            <nav className="flex gap-5 text-sm font-medium">
              <Link to="/" className="hover:text-emerald-100 transition-colors">Trang chủ</Link>
              <Link to="/about" className="hover:text-emerald-100 transition-colors">Giới thiệu</Link>
              {/* Nếu là Seller thì hiện nút quản lý */}
              {isSeller && (
                <Link to="/seller" className="flex items-center gap-1 text-yellow-300 hover:text-yellow-100 font-semibold transition-colors bg-white/10 px-3 py-1 rounded-full">
                  <BuildingStorefrontIcon className="h-4 w-4" />
                  Kênh người bán
                </Link>
              )}
            </nav>

            {/* Separator */}
            <div className="h-6 w-px bg-emerald-500/50"></div>

            {/* Cart & User Actions */}
            <div className="flex items-center gap-4">
              
              {/* Cart Icon */}
              <Link to="/cart" className="relative group p-1">
                <ShoppingBagIcon className="h-7 w-7 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-emerald-600">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Auth Logic */}
              {!isLoggedIn ? (
                <div className="flex gap-2 text-sm font-semibold">
                  <Link to="/login" className="px-4 py-2 hover:bg-emerald-700 rounded-lg transition-colors">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 shadow-md transition-transform hover:-translate-y-0.5">
                    Đăng ký
                  </Link>
                </div>
              ) : (
                // Logged In User Dropdown
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 hover:bg-emerald-700 py-1 px-2 rounded-lg transition-colors focus:outline-none"
                  >
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover border-2 border-emerald-200" />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-emerald-800 flex items-center justify-center text-sm font-bold border-2 border-emerald-400">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}
                    <span className="text-sm font-medium max-w-[100px] truncate">{user?.username || "User"}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 text-gray-700 border border-gray-100 animate-fade-in-up origin-top-right">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-xs text-gray-500">Xin chào,</p>
                            <p className="font-bold text-gray-900 truncate">{user?.username}</p>
                        </div>
                        
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm">
                            <UserIcon className="h-5 w-5 text-gray-400" /> Trang cá nhân
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm">
                            <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" /> Đơn mua
                        </Link>
                        <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm">
                            <HeartIcon className="h-5 w-5 text-gray-400" /> Yêu thích
                        </Link>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm text-left"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" /> Đăng xuất
                        </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. MOBILE MENU BUTTON */}
          <div className="flex md:hidden items-center gap-4">
             {/* Cart Mobile */}
             <Link to="/cart" className="relative p-1">
                <ShoppingBagIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full border border-emerald-600">
                    {cartCount}
                  </span>
                )}
              </Link>

            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-700 focus:outline-none"
            >
                {isMobileMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* 5. MOBILE SEARCH BAR (Hiện dưới header khi ở mobile) */}
        <div className="md:hidden pb-4">
            <div className="relative">
                <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full bg-emerald-700/50 text-white placeholder-emerald-200 border border-emerald-500 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-colors"
                />
                <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-emerald-300" />
            </div>
        </div>
      </div>

      {/* 6. MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-800 border-t border-gray-200 shadow-lg animate-fade-in-down">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-50 hover:text-emerald-600">Trang chủ</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-50 hover:text-emerald-600">Giới thiệu</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-50 hover:text-emerald-600">Liên hệ</Link>
            {isSeller && (
                <Link to="/seller" className="block px-3 py-2 rounded-md text-base font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100">Kênh người bán</Link>
            )}
            
            <div className="border-t border-gray-100 my-2"></div>

            {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3 px-3">
                    <Link to="/login" className="text-center py-2 border border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50">Đăng nhập</Link>
                    <Link to="/register" className="text-center py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">Đăng ký</Link>
                </div>
            ) : (
                <>
                    <div className="px-3 py-2 flex items-center gap-3 bg-gray-50 rounded-lg mb-2">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-sm">{user?.username}</p>
                            <p className="text-xs text-gray-500">Thành viên</p>
                        </div>
                    </div>
                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50">Trang cá nhân</Link>
                    <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50">Đơn mua</Link>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Đăng xuất</button>
                </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
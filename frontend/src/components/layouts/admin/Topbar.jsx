import React from "react";
import { useAuth } from "../../../contexts/AuthContext"; // Lấy thông tin user

// Import Icons từ Heroicons
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid"; // Dùng bản solid cho mũi tên nhỏ

const Topbar = ({ onOpenSidebar }) => {
  const { user } = useAuth() || {}; // Giả sử context trả về user object

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
      
      {/* 1. MOBILE MENU BUTTON */}
      {/* Chỉ hiện ở màn hình nhỏ (lg:hidden), dùng để mở Sidebar */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:text-blue-600 transition-colors"
        onClick={onOpenSidebar}
      >
        <span className="sr-only">Mở sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* 2. SEPARATOR (Mobile only) */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        
        {/* 3. SEARCH BAR */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Tìm kiếm
          </label>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 bg-transparent sm:text-sm"
            placeholder="Tìm kiếm dữ liệu..."
            type="search"
            name="search"
          />
        </form>

        {/* 4. RIGHT ACTIONS */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          
          {/* Notification Button */}
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative group transition-colors">
            <span className="sr-only">Xem thông báo</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {/* Dot thông báo đỏ */}
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white transform scale-0 group-hover:scale-100 transition-transform duration-200"></span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="sr-only">Open user menu</span>
              
              {/* Avatar */}
              {user?.avatar ? (
                 <img
                 className="h-8 w-8 rounded-full bg-gray-50 object-cover ring-2 ring-white shadow-sm"
                 src={user.avatar}
                 alt=""
               />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white">
                    {user?.username?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
             
              {/* Name (Hidden on mobile) */}
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                  {user?.username || "Admin User"}
                </span>
                <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
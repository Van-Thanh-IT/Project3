import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersThunk, updateUserStatusThunk, getUserByIdThunk, setFilters } from "../../app/features/userSlice";
import { toast } from "react-toastify";
import UserDetailModal from "../../components/modal/UserDetailModal";

// Icons
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon
} from "@heroicons/react/24/outline";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, filters, lastPage, selectedUser } = useSelector((state) => state.user);

  const [search, setSearch] = useState(filters.search);
  const [role, setRole] = useState(filters.role);
  const [status, setStatus] = useState(filters.status);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch data khi component mount hoặc page thay đổi
  useEffect(() => {
    dispatch(fetchUsersThunk(filters));
  }, [dispatch, filters.page]);

  // Xử lý lọc
  const handleFilter = () => {
    const newFilters = { search, role, status, page: 1 };
    dispatch(setFilters(newFilters));
    dispatch(fetchUsersThunk(newFilters));
  };

  // Xử lý đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      const newFilters = { ...filters, page: newPage };
      dispatch(setFilters(newFilters));
      dispatch(fetchUsersThunk(newFilters));
    }
  };

  // Toggle trạng thái user
  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "banned" : "active";
    try {
      await dispatch(updateUserStatusThunk({ id: user.id, status: newStatus })).unwrap();
      toast.success(`Đã ${newStatus === "active" ? "mở khóa" : "khóa"} tài khoản thành công!`);
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại!");
    }
  };

  // Xem chi tiết user
  const viewUserDetail = async (id) => {
    try {
      await dispatch(getUserByIdThunk(id)).unwrap();
      setModalOpen(true);
    } catch (err) {
      toast.error("Lấy thông tin user thất bại");
    }
  };

  // --- Helper: Render Badge cho Role ---
  const renderRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">Quản trị viên</span>;
      case "staff":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">Nhân viên</span>;
      case "seller":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">Người bán</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Người dùng</span>;
    }
  };

  // --- Helper: Render Avatar ---
  const renderAvatar = (user) => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.username} className="h-10 w-10 rounded-full object-cover border border-gray-200" />;
    }
    const initial = (user.username || user.name || "U").charAt(0).toUpperCase();
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border border-white shadow-sm">
        {initial}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UsersIcon className="w-8 h-8 text-blue-600" />
          Quản lý người dùng
        </h1>
        <p className="text-sm text-gray-500 mt-1">Theo dõi, phân quyền và quản lý trạng thái tài khoản người dùng.</p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        
        {/* TOOLBAR (FILTER) */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/30 flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm shadow-sm"
            />
          </div>

          {/* Filter Group */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition"
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="seller">Seller</option>
              <option value="user">User</option>
            </select>

            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="banned">Đã khóa</option>
            </select>

            <button 
              onClick={handleFilter} 
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FunnelIcon className="w-4 h-4" />
              Lọc
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4 w-16 text-center">ID</th>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4 text-center">Vai trò</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : users?.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Không tìm thấy người dùng nào.</td></tr>
              ) : (
                users?.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    
                    {/* ID */}
                    <td className="px-6 py-4 text-center text-sm text-gray-500 font-mono">#{user.id}</td>

                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {renderAvatar(user)}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.username || user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 text-center">
                      {renderRoleBadge(user.role)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        user.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Nút Xem chi tiết */}
                        <button
                          onClick={() => viewUserDetail(user.id)}
                          className="p-2 rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-sm transition-all"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>

                        {/* Nút Khóa/Mở khóa */}
                        <button
                          onClick={() => toggleStatus(user)}
                          className={`p-2 rounded-lg border shadow-sm transition-all ${
                            user.status === 'active'
                              ? 'bg-white text-red-500 border-gray-200 hover:bg-red-50 hover:border-red-300'
                              : 'bg-white text-green-500 border-gray-200 hover:bg-green-50 hover:border-green-300'
                          }`}
                          title={user.status === 'active' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        >
                          {user.status === 'active' ? <LockClosedIcon className="w-4 h-4" /> : <LockOpenIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Trang <span className="font-bold text-gray-700">{filters.page}</span> trên <span className="font-bold text-gray-700">{lastPage}</span>
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page <= 1}
              className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
            {/* Page Numbers (Giới hạn hiển thị nếu cần, ở đây hiển thị đơn giản) */}
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => {
                 // Logic hiển thị rút gọn pagination có thể thêm ở đây nếu lastPage quá lớn
                 // Hiện tại hiển thị max 5 trang gần nhất hoặc tất cả nếu ít
                 if (lastPage > 7 && Math.abs(page - filters.page) > 2 && page !== 1 && page !== lastPage) return null;
                 if (lastPage > 7 && Math.abs(page - filters.page) === 3) return <span key={page} className="px-2 text-gray-400">...</span>;

                 return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      page === filters.page
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                 )
              })}
            </div>

            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= lastPage}
              className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default UserManagement;
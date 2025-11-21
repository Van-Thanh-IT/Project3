import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersThunk, updateUserStatusThunk, getUserByIdThunk } from "../../app/features/userSlice";
import { setFilters } from "../../app/features/userSlice";
import { toast } from "react-toastify";
import UserDetailModal from "../../components/modal/UserDetailModal";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, filters, lastPage, selectedUser } = useSelector(state => state.user);

  const [search, setSearch] = useState(filters.search);
  const [role, setRole] = useState(filters.role);
  const [status, setStatus] = useState(filters.status);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsersThunk(filters));
  }, [dispatch, filters.page]);

  const handleFilter = () => {
    const newFilters = { search, role, status, page: 1 };
    dispatch(setFilters(newFilters));
    dispatch(fetchUsersThunk(newFilters));
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "banned" : "active";
    try {
      await dispatch(updateUserStatusThunk({ id: user.id, status: newStatus })).unwrap();
      toast.success("Cập nhật trạng thái thành công!");
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại!");
    }
  };

  const viewUserDetail = async (id) => {
    try {
      await dispatch(getUserByIdThunk(id)).unwrap();
      setModalOpen(true);
    } catch (err) {
      toast.error("Lấy thông tin user thất bại");
    }
  };

  return (
    <div>
      <h2>Quản lý người dùng</h2>

      {/* Filter */}
      <div className="mb-4 flex gap-2">
        <input
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-1 rounded"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-1 rounded">
          <option value="">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
           <option value="staff">Staff</option>
          <option value="seller">seller</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-1 rounded">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="banned">Bị khóa</option>
        </select>
        <button onClick={handleFilter} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Lọc
        </button>
      </div>

      {loading ? <p>Đang tải...</p> : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Họ tên</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Vai trò</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user.id} className="text-center">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.username || user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className={`border p-2 ${user.status === "active" ? "text-green-600" : "text-red-600"}`}>
                  {user.status === "active" ? "Hoạt động" : "Bị khóa"}
                </td>
                <td className="border p-2 flex justify-center gap-2">
                  <button
                    onClick={() => toggleStatus(user)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    {user.status === "active" ? "Khóa" : "Mở khóa"}
                  </button>
                  <button
                    onClick={() => viewUserDetail(user.id)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="mt-4 flex gap-1">
        {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            disabled={page === filters.page}
            onClick={() => {
              const newFilters = { ...filters, page };
              dispatch(setFilters(newFilters));
              dispatch(fetchUsersThunk(newFilters));
            }}
            className={`px-3 py-1 rounded ${page === filters.page ? "bg-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default UserManagement;

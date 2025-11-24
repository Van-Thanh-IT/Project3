import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStaffsThunk, updateStatusThunk } from "../../app/features/staffSlice";
import StaffFormModal from "../../components/modal/StaffFormModal";
import PermissonManagement from "./PermissonManagement";
import { toast } from "react-toastify";

// Icons
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  LockOpenIcon,
  UserIcon,
  ShieldCheckIcon,
  UsersIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

const StaffManagement = () => {
  const dispatch = useDispatch();
  const { staffs, loading } = useSelector((state) => state.staff);
  
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // Quản lý Tab bằng State
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllStaffsThunk());
  }, [dispatch]);

  // --- Xử lý tìm kiếm Client-side ---
  const filteredStaffs = useMemo(() => {
    if (!searchTerm) return staffs;
    return staffs.filter(
      (s) =>
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone?.includes(searchTerm)
    );
  }, [staffs, searchTerm]);

  // --- Toggle Trạng thái ---
  const toggleStatus = async (staff) => {
    const newStatus = staff.status === "active" ? "banned" : "active";
    try {
      await dispatch(updateStatusThunk({ id: staff.id, status: newStatus })).unwrap();
      dispatch(fetchAllStaffsThunk());
      toast.success(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản thành công!`);
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại!");
    }
  };

  // --- Helper: Render Avatar ---
  const renderAvatar = (staff) => {
    if (staff.avatar) {
      return (
        <img
          src={staff.avatar}
          alt={staff.username}
          className="h-10 w-10 rounded-full object-cover border border-gray-200"
        />
      );
    }
    // Fallback Avatar: Lấy chữ cái đầu tên
    const initial = staff.username ? staff.username.charAt(0).toUpperCase() : "U";
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-teal-500"];
    const color = colors[staff.id % colors.length]; // Random màu theo ID
    return (
      <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center text-white font-bold border border-white shadow-sm`}>
        {initial}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* HEADER */}
      <div className="">
        <p className="text-sm text-gray-500 mt-1">Quản lý thông tin nhân viên và phân quyền hệ thống.</p>
      </div>

      {/* CUSTOM TABS */}
      <div className="flex space-x-1 rounded-xl bg-gray-200/50 p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === "info"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          <UsersIcon className="w-5 h-5" />
          Thông tin nhân viên
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === "permissions"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          <ShieldCheckIcon className="w-5 h-5" />
          Phân quyền
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="transition-all duration-300">
        
        {/* TAB 1: DANH SÁCH NHÂN VIÊN */}
        {activeTab === "info" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            
            {/* TOOLBAR */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
              {/* Search */}
              <div className="relative w-full sm:w-96">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, sđt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-sm"
              >
                <UserPlusIcon className="w-5 h-5" />
                Thêm nhân viên
              </button>
            </div>

            {/* TABLE */}
            <div className=" overflow-y-auto max-h-[500px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">Nhân viên</th>
                    <th className="px-6 py-4">Liên hệ</th>
                    <th className="px-6 py-4 text-center">Giới tính</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Đang tải danh sách...</td></tr>
                  ) : filteredStaffs.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Không tìm thấy nhân viên nào.</td></tr>
                  ) : (
                    filteredStaffs.map((staff) => (
                      <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors group">
                        
                        {/* Cột Info (Avatar + Tên + Role) */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {renderAvatar(staff)}
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{staff.username}</p>
                              <p className="text-xs text-gray-500">ID: #{staff.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Cột Liên hệ */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-700">{staff.email}</span>
                            <span className="text-xs text-gray-400">{staff.phone || "Chưa cập nhật"}</span>
                          </div>
                        </td>

                        {/* Cột Giới tính */}
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            staff.gender === 'male' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            staff.gender === 'female' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                          }`}>
                            {staff.gender === 'male' ? 'Nam' : staff.gender === 'female' ? 'Nữ' : 'Khác'}
                          </span>
                        </td>

                        {/* Cột Trạng thái */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            staff.status === 'active' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                            {staff.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                          </span>
                        </td>

                        {/* Cột Hành động */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* Nút Khóa/Mở khóa */}
                            <button
                              onClick={() => toggleStatus(staff)}
                              className={`p-2 rounded-lg border shadow-sm transition-all duration-200 ${
                                staff.status === 'active'
                                  ? 'bg-white text-red-500 border-gray-200 hover:bg-red-50 hover:border-red-200'
                                  : 'bg-white text-green-500 border-gray-200 hover:bg-green-50 hover:border-green-200'
                              }`}
                              title={staff.status === 'active' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                            >
                              {staff.status === 'active' ? (
                                <LockClosedIcon className="w-4 h-4" />
                              ) : (
                                <LockOpenIcon className="w-4 h-4" />
                              )}
                            </button>
                            
                            {/* Nút Sửa (Ví dụ) */}
                            <button className="p-2 bg-white text-blue-600 border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 transition-all" title="Chỉnh sửa">
                                <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* FOOTER */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <span>Hiển thị {filteredStaffs.length} bản ghi</span>
                <span>Dữ liệu được cập nhật tự động</span>
            </div>
          </div>
        )}

        {/* TAB 2: PHÂN QUYỀN */}
        {activeTab === "permissions" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <PermissonManagement />
          </div>
        )}

      </div>

      {/* MODAL */}
      <StaffFormModal show={showModal} handleClose={() => setShowModal(false)} />
    </div>
  );
};

export default StaffManagement;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissionsThunk, createPermissionThunk, assignPermissionThunk } from "../../app/features/permissionSlice";
import { toast } from "react-toastify";

// Icons
import { 
  ShieldCheckIcon, 
  PlusIcon, 
  KeyIcon, 
  ListBulletIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

const PermissionManagement = () => {
  const dispatch = useDispatch();
  const { permissions, loading, error } = useSelector((state) => state.permission);

  const [permissionName, setPermissionName] = useState("");
  const [staffPermissionIds, setStaffPermissionIds] = useState([]);

  // --- Fetch Data ---
  useEffect(() => {
    dispatch(fetchPermissionsThunk()).then((res) => {
      if (res.payload?.staff_permission_ids) {
        setStaffPermissionIds(res.payload.staff_permission_ids.map((id) => Number(id)));
      }
    });
  }, [dispatch]);

  // --- Tạo quyền mới ---
  const handleCreatePermission = async () => {
    if (!permissionName.trim()) {
      toast.warning("Vui lòng nhập tên quyền!");
      return;
    }
    try {
      await dispatch(createPermissionThunk({ name: permissionName })).unwrap();
      toast.success("Tạo quyền mới thành công!");
      setPermissionName("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Tạo quyền thất bại!");
    }
  };

  // --- Toggle Quyền (Gán/Gỡ) ---
  const handleTogglePermission = (permissionId, currentState) => {
    const id = Number(permissionId);
    const newState = !currentState; // Đảo ngược trạng thái hiện tại

    // 1. Optimistic UI Update (Cập nhật giao diện ngay lập tức cho mượt)
    setStaffPermissionIds((prev) =>
      newState ? [...prev, id] : prev.filter((pid) => pid !== id)
    );

    // 2. Gọi API
    dispatch(
      assignPermissionThunk(
        newState
          ? { permission_ids: [id] }
          : { remove_permission_ids: [id] }
      )
    )
      .unwrap()
      .then(() => {
        toast.success(`Đã ${newState ? "gán" : "gỡ"} quyền thành công`);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message || "Cập nhật thất bại");
        
        // Revert UI nếu lỗi (hoàn tác checkbox)
        setStaffPermissionIds((prev) =>
          !newState ? [...prev, id] : prev.filter((pid) => pid !== id)
        );
      });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
            Phân quyền hệ thống
          </h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh sách quyền và gán quyền cho nhân sự.</p>
        </div>

        {/* FORM TẠO QUYỀN MỚI */}
        <div className="flex w-full md:w-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Nhập tên quyền mới..."
            value={permissionName}
            onChange={(e) => setPermissionName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreatePermission()}
            className="pl-10 pr-20 py-2.5 w-full md:w-80 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm shadow-sm"
          />
          <button
            onClick={handleCreatePermission}
            className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
          >
            <PlusIcon className="w-3 h-3" />
            Thêm
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
       <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <th className="px-6 py-4 w-20 text-center">ID</th>
              <th className="px-6 py-4">Tên quyền hạn</th>
              <th className="px-6 py-4">Mô tả / Slug</th>
              <th className="px-6 py-4 w-48 text-center">Trạng thái gán</th>
              <th className="px-6 py-4 w-32 text-center">Bật/Tắt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
               <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : permissions.length === 0 ? (
               <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Chưa có quyền nào được tạo.</td></tr>
            ) : (
              permissions.map((perm) => {
                const isAssigned = staffPermissionIds.includes(Number(perm.id));
                return (
                  <tr key={perm.id} className={`hover:bg-blue-50/30 transition-colors ${isAssigned ? 'bg-blue-50/10' : ''}`}>
                    
                    {/* ID */}
                    <td className="px-6 py-4 text-center text-sm text-gray-500 font-mono">
                      #{perm.id}
                    </td>

                    {/* TÊN QUYỀN */}
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${isAssigned ? 'text-blue-700' : 'text-gray-700'}`}>
                        {perm.name}
                      </span>
                    </td>

                    {/* MÔ TẢ */}
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        {perm.description || perm.slug || "system.permission"}
                      </span>
                    </td>

                    {/* TRẠNG THÁI LABEL */}
                    <td className="px-6 py-4 text-center">
                      {isAssigned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <CheckCircleIcon className="w-3 h-3" /> Đã gán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <XCircleIcon className="w-3 h-3" /> Chưa gán
                        </span>
                      )}
                    </td>

                    {/* TOGGLE SWITCH */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTogglePermission(perm.id, isAssigned)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          isAssigned ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                            isAssigned ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
        <span>Tổng cộng: {permissions.length} quyền</span>
        <span>Hệ thống phân quyền Staff</span>
      </div>
    </div>
  );
};

export default PermissionManagement;
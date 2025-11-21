import React from "react";

const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Chi tiết người dùng</h3>
        
        <p><span className="font-medium">ID:</span> {user.id}</p>
        <p><span className="font-medium">Họ tên:</span> {user.username || user.name}</p>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Số điện thoại:</span> {user.phone || '-'}</p>
        <p><span className="font-medium">Vai trò:</span> {user.roles?.map(r => r.name).join(", ") || '-'}</p>
        <p><span className="font-medium">Trạng thái:</span> 
          <span className={user.status === "active" ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
            {user.status === "active" ? "Hoạt động" : "Bị khóa"}
          </span>
        </p>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;

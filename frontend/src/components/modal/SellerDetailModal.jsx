import React from "react";
import { Modal, Tag } from "antd";

const SellerDetailModal = ({ open, onClose, currentSeller }) => {
  // Helper function để render trạng thái
  const renderStatus = (status) => {
    if (!status) return <Tag>Không rõ</Tag>;
    switch (status.toLowerCase()) {
      case "pending":
        return <Tag color="orange">Chờ duyệt</Tag>;
      case "approved":
      case "active":
        return <Tag color="green">Đang hoạt động</Tag>;
      case "rejected":
        return <Tag color="red">Đã từ chối</Tag>;
      case "revoked":
        return <Tag color="volcano">Đã thu hồi</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <Modal
      title="Chi tiết thông tin Seller"
      open={open}
      onCancel={onClose}
      footer={[
        <button
          key="close"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          Đóng
        </button>,
      ]}
      width={650}
    >
      {currentSeller && (
        <div className="space-y-6 pt-4">
          {/* CARD THÔNG TIN */}
          <div className="bg-white shadow-md rounded-xl p-6 space-y-3 border border-gray-100">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-700">
                Thông tin cá nhân
              </h2>
              <div>{renderStatus(currentSeller.status)}</div>
            </div>

            {/* Xử lý trường hợp object user có thể null hoặc structure khác */}
            <p><span className="font-medium">Họ tên:</span> {currentSeller.user?.username || currentSeller.username || "N/A"}</p>
            <p><span className="font-medium">Email:</span> {currentSeller.user?.email || currentSeller.email || "N/A"}</p>

            <p><span className="font-medium">SĐT tài khoản:</span> {currentSeller.user?.phone || "N/A"}</p>
            <p><span className="font-medium">SĐT đăng ký bán hàng:</span> {currentSeller.phone}</p>

            <p>
              <span className="font-medium">Giới tính:</span>{" "}
              {currentSeller.user?.gender || "Không cung cấp"}
            </p>

            <p>
              <span className="font-medium">Ngày sinh:</span>{" "}
              {currentSeller.user?.date_of_birth
                ? new Date(currentSeller.user.date_of_birth).toLocaleDateString("vi-VN")
                : "Không cung cấp"}
            </p>

            <p><span className="font-medium">Địa chỉ:</span> {currentSeller.address}</p>

            <p>
              <span className="font-medium">Mã số thuế (VAT):</span>{" "}
              {currentSeller.vat_number || "Không cung cấp"}
            </p>

            <p>
              <span className="font-medium">Giấy phép kinh doanh:</span>{" "}
              {currentSeller.business_doc || "Không cung cấp"}
            </p>

            <p>
              <span className="font-medium">Ngày tạo:</span>{" "}
              {currentSeller.created_at ? new Date(currentSeller.created_at).toLocaleString("vi-VN") : "N/A"}
            </p>
          </div>

          {/* HIỂN THỊ LÝ DO TÙY THEO TRẠNG THÁI */}
          
          {/* Trường hợp 1: Lý do đăng ký (Thường dùng cho Pending) */}
          {(currentSeller.status === 'pending' || !currentSeller.status) && currentSeller.reason && (
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold border-b pb-2 text-gray-700">
                Lý do đăng ký
              </h2>
              <p className="mt-3 bg-blue-50 p-4 rounded-lg text-gray-700">
                {currentSeller.reason}
              </p>
            </div>
          )}

          {/* Trường hợp 2: Lý do bị hủy/từ chối (Cho Revoked/Rejected) */}
          {(currentSeller.status === 'revoked' || currentSeller.status === 'rejected') && currentSeller.reason && (
             <div className="bg-white shadow-md rounded-xl p-6 border border-red-100">
             <h2 className="text-lg font-semibold border-b pb-2 text-red-700">
               Lý do {currentSeller.status === 'revoked' ? 'bị thu hồi' : 'bị từ chối'}
             </h2>
             <p className="mt-3 bg-red-50 p-4 rounded-lg text-red-700">
               {currentSeller.reason}
             </p>
           </div>
          )}

          {/* AVATAR */}
          {currentSeller.user?.avatar && (
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold border-b pb-2 text-gray-700">
                Ảnh đại diện
              </h2>

              <div className="mt-4 flex justify-center">
                <img
                  src={currentSeller.user.avatar}
                  alt="avatar"
                  className="w-32 h-32 rounded-full border shadow-sm object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SellerDetailModal;
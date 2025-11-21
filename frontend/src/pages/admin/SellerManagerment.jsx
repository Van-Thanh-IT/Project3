import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Tabs,
  Button,
  Tag,
  Space,
  Modal,
  Input,
  message,
  Popconfirm,
  Tooltip,
  Card
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  EyeOutlined,
  ReloadOutlined,
  UndoOutlined
} from "@ant-design/icons";

import {
  fetchPendingSellersThunk,
  fetchAllSellersThunk,
  fetchRevokedSellersThunk,
  approveSellerThunk,
  rejectSellerThunk,
  revokeSellerThunk,
  restoreSellerThunk
} from "../../app/features/sellerSlice";

import SellerDetailModal from "../../components/modal/SellerDetailModal";

const { TextArea } = Input;

const SellerManagement = () => {
  const dispatch = useDispatch();
  const { sellers, pendingSellers, revokedSellers, loading } = useSelector((state) => state.seller);
  // Modal từ chối
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Modal xem hồ sơ
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    dispatch(fetchPendingSellersThunk());
    dispatch(fetchAllSellersThunk());
    dispatch(fetchRevokedSellersThunk());
  };

  const handleRefresh = () => {
    loadAllData();
    message.info("Đã cập nhật dữ liệu mới nhất");
  };

  const openViewModal = (seller) => {
    setCurrentSeller(seller);
    setIsViewModalOpen(true);
  };

  const handleApprove = (id) => {
    dispatch(approveSellerThunk(id))
      .unwrap()
      .then(() => {
        message.success("Đã duyệt hồ sơ thành công");
        loadAllData();
      })
      .catch((err) => message.error(err));
  };

  const openRejectModal = (id) => {
    setCurrentRejectId(id);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return message.warning("Vui lòng nhập lý do!");

    dispatch(rejectSellerThunk({ id: currentRejectId, reason: rejectReason }))
      .unwrap()
      .then(() => {
        message.success("Đã từ chối hồ sơ");
        setIsRejectModalOpen(false);
        loadAllData();
      })
      .catch((err) => message.error(err));
  };

  const handleRevoke = (id) => {
    dispatch(revokeSellerThunk(id))
      .unwrap()
      .then(() => {
        message.success("Đã thu hồi quyền Seller");
        loadAllData();
      })
      .catch((err) => message.error(err));
  };

  const handleRestore = (id) => {
    dispatch(restoreSellerThunk(id))
      .unwrap()
      .then(() => {
        message.success("Đã khôi phục quyền Seller");
        loadAllData();
      })
      .catch((err) => message.error(err));
  };

  // columns - PENDING (Giữ nguyên)
  const pendingColumns = [
    { title: "ID", dataIndex: "id", width: 60 },
    {
      title: "Người đăng ký",
      render: (_, record) => (
        <div>
          <strong>{record.user?.name || record.user?.username}</strong><br />
          <span className="text-gray-500 text-xs">{record.user?.email}</span>
        </div>
      ),
    },
    { title: "SĐT", dataIndex: "phone" },
    {
      title: "Ngày gửi",
      dataIndex: "updated_at",
      render: (t) => new Date(t).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem hồ sơ đăng ký">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => openViewModal(record)}
            >
              Xem
            </Button>
          </Tooltip>

          <Popconfirm
            title="Duyệt hồ sơ?"
            onConfirm={() => handleApprove(record.id)}
          >
            <Button type="primary" size="small" icon={<CheckCircleOutlined />}>
              Duyệt
            </Button>
          </Popconfirm>

          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => openRejectModal(record.id)}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  // columns - ACTIVE (Đã sửa: Thêm onClick)
  const activeColumns = [
    { title: "ID", dataIndex: "id", width: 60 },
    {
      title: "Người bán",
      render: (_, record) => (
        <div>
          <strong>{record.user?.username || record.username}</strong><br />
          <span className="text-gray-500 text-xs">{record.user?.email || record.email}</span>
        </div>
      ),
    },
    {
      title: "Vai trò",
      render: () => <Tag color="green">Người bán hàng</Tag>,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            {/* Đã thêm onClick tại đây */}
            <Button 
              size="small" 
              icon={<EyeOutlined />} 
              onClick={() => openViewModal(record)} 
            />
          </Tooltip>

          <Popconfirm
            title="Thu hồi quyền?"
            onConfirm={() => handleRevoke(record.id)}
            okType="danger"
          >
            <Button danger size="small" icon={<StopOutlined />}>
              Thu hồi
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // columns - REVOKED (Đã sửa: Thêm nút Xem)
  const revokedColumns = [
    { title: "ID", dataIndex: "id", width: 60 },
    {
      title: "Người dùng",
      render: (_, record) => (
        <div>
          <strong>{record.user?.username || record.user?.name}</strong><br />
          <span className="text-gray-500 text-xs">{record.user?.email}</span>
        </div>
      ),
    },
    {
      title: "Lý do hủy",
      dataIndex: "reason",
      render: (text) => <span className="text-red-600">{text || "Không có lý do"}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => <Tag color="volcano">{status?.toUpperCase()}</Tag>,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
           {/* Đã thêm nút Xem tại đây */}
          <Tooltip title="Xem chi tiết">
            <Button 
              size="small" 
              icon={<EyeOutlined />} 
              onClick={() => openViewModal(record)} 
            />
          </Tooltip>

          <Popconfirm
            title="Cấp phép lại?"
            onConfirm={() => handleRestore(record.id)}
          >
            <Button type="dashed" size="small" icon={<UndoOutlined />}>
              Khôi phục
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: `Chờ duyệt (${pendingSellers.length})`,
      children: (
        <Table dataSource={pendingSellers} columns={pendingColumns} rowKey="id" loading={loading} />
      ),
    },
    {
      key: "2",
      label: `Hoạt động (${sellers.length})`,
      children: (
        <Table dataSource={sellers} columns={activeColumns} rowKey="id" loading={loading} />
      ),
    },
    {
      key: "3",
      label: `Đã hủy (${revokedSellers.length})`,
      children: (
        <Table dataSource={revokedSellers} columns={revokedColumns} rowKey="id" loading={loading} />
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Quản lý Đối tác (Sellers)"
        extra={<Button icon={<ReloadOutlined />} onClick={handleRefresh}>Làm mới</Button>}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Card>

      <SellerDetailModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        currentSeller={currentSeller}
      />

      <Modal
        title="Từ chối hồ sơ Seller"
        open={isRejectModalOpen}
        onOk={handleConfirmReject}
        onCancel={() => setIsRejectModalOpen(false)}
        okText="Xác nhận"
        okType="danger"
        confirmLoading={loading}
      >
        <p>Vui lòng nhập lý do từ chối:</p>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Lý do..."
        />
      </Modal>
    </div>
  );
};

export default SellerManagement;
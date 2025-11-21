import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Button, message } from "antd";
import { fetchPermissionsThunk,createPermissionThunk, assignPermissionThunk } from "../../app/features/permissionSlice";

const PermissionManagement = () => {
  const dispatch = useDispatch();
  const { permissions, loading, error } = useSelector((state) => state.permission);

  const [permissionName, setPermissionName] = useState("");
  const [staffPermissionIds, setStaffPermissionIds] = useState([]);

  // --- Fetch all permissions + staff assigned
  useEffect(() => {
    dispatch(fetchPermissionsThunk()).then((res) => {
      if (res.payload?.staff_permission_ids) {
        setStaffPermissionIds(res.payload.staff_permission_ids.map((id) => Number(id)));
      }
    });
  }, [dispatch]);

  // --- Tạo quyền mới
  const handleCreatePermission = async () => {
    if (!permissionName.trim()) return message.error("Nhập tên quyền!");
    try {
      const res = await dispatch(createPermissionThunk({ name: permissionName })).unwrap();
      message.success("Tạo quyền thành công!");
      setPermissionName("");

      // Redux slice đã push permission mới vào state, checkbox mặc định false
      // Không cần cập nhật staffPermissionIds
    } catch (err) {
      console.error(err);
      message.error(err.message || "Tạo quyền thất bại!");
    }
  };

  // --- Tick/bỏ tick quyền cho staff
  const handleTogglePermission = (permissionId, checked) => {
    permissionId = Number(permissionId);

    // Cập nhật local state ngay để checkbox phản hồi tức thì
    setStaffPermissionIds((prev) =>
      checked ? [...prev, permissionId] : prev.filter((id) => id !== permissionId)
    );

    // Gọi backend
    dispatch(
      assignPermissionThunk(
        checked
          ? { permission_ids: [permissionId] }
          : { remove_permission_ids: [permissionId] }
      )
    )
      .unwrap()
      .then(() => {
        message.success(`Quyền đã được ${checked ? "gán" : "gỡ"} thành công`);
      })
      .catch((err) => {
        console.error(err);
        message.error(err.message || "Cập nhật quyền thất bại");

        // Nếu backend lỗi, revert checkbox
        setStaffPermissionIds((prev) =>
          checked ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
        );
      });
  };

  // --- Columns Table
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên quyền", dataIndex: "name" },
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Giao quyên cho nhân viên",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={staffPermissionIds.includes(Number(record.id))}
          onChange={(e) => handleTogglePermission(record.id, e.target.checked)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý quyền</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Input
          placeholder="Tên quyền mới"
          value={permissionName}
          onChange={(e) => setPermissionName(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={handleCreatePermission}>
          Thêm quyền
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={permissions}
        columns={columns}
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default PermissionManagement;

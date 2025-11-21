import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tabs } from "antd";
import { toast } from "react-toastify";
import PermissonManagement from "./PermissonManagement";
import StaffFormModal from "../../components/modal/StaffFormModal";
import { fetchAllStaffsThunk, updateStatusThunk } from "../../app/features/staffSlice";

const StaffManagement = () => {
  const dispatch = useDispatch();
  const { staffs, loading, error } = useSelector((state) => state.staff);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllStaffsThunk());
  }, [dispatch]);

  const toggleStatus = async (staff) => {
    const newStatus = staff.status === "active" ? "banned" : "active";
    try {
      await dispatch(updateStatusThunk({ id: staff.id, status: newStatus })).unwrap();
      dispatch(fetchAllStaffsThunk());
      toast.success("Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Cập nhật thất bại!");
    }
  };

  const items = [
    {
      key: "1",
      label: "Thông tin nhân viên",
      children: (
        <div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            style={{ marginBottom: "20px" }}
          >
            Thêm nhân viên
          </Button>
          <StaffFormModal show={showModal} handleClose={() => setShowModal(false)} />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <table border="1" cellPadding="5" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.id}</td>
                  <td>{staff.username}</td>
                  <td>{staff.email}</td>
                  <td>{staff.status}</td>
                  <td>
                    <Button
                      variant={staff.status === "active" ? "danger" : "success"}
                      onClick={() => toggleStatus(staff)}
                    >
                      {staff.status === "active" ? "Khóa" : "Mở"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      key: "2",
      label: "Quản lý quyền nhân viên",
      children: <PermissonManagement />,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý hệ thống</h1>
      <Tabs items={items} />
    </div>
  );
};

export default StaffManagement;

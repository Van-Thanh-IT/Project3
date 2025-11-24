import axiosClient from "../api/axiosClient";

const StaffService = { 
    getAllStaffs: () => axiosClient.get("/admin/staffs"),
    getStaffById: (id) => axiosClient.get(`/admin/staffs/${id}`),
    createStaff: (data) => axiosClient.post(`/admin/staffs`, data,{
        headers: { "Content-Type": "multipart/form-data" },
    }),
    updateStaff: (id, data) => axiosClient.put(`/admin/staffs/${id}`, data,{
        headers: { "Content-Type": "multipart/form-data" },
    }),
    updateStatus: (id, status) => axiosClient.patch(`/admin/staffs/${id}/status`, { status  }),
};

export default StaffService;
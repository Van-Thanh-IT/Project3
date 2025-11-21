import axiosClient from "../api/axiosClient";

const permissionService = {
    getPermissionsWithStaffStatus: () => axiosClient.get("/admin/permissions"),
    createPermission: (data) => axiosClient.post("/admin/permissions", data),
    assignPermissionToStaff: (data) => axiosClient.post("/admin/permissions/assign", data),
};

export default permissionService;
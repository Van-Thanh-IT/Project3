import axiosClient from "../api/axiosClient";

const UserService = {
     getAllUsers: ({ search = '', role = '', status = '', page = 1 } = {}) => {
        return axiosClient.get("/admin/users", {
            params: { search, role, status, page },
        });
    },
    getUserById: (id) => axiosClient.get(`/admin/users/${id}`),
    updateUserStatus: (id, status) => axiosClient.put(`/admin/users/${id}/status`, {status: status}),
}

export default UserService;
import axiosClient from "../api/axiosClient";

const CategoryService = {
  getAllCategories: () => axiosClient.get("/admin/categories"),
  getCategoryById: (id) => axiosClient.get(`/admin/categories/${id}`),
  createCategory: (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    }
    return axiosClient.post("/admin/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateCategory: (id, data) => {
    const formData = new FormData();
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    }
    return axiosClient.post(`/admin/categories/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  toggleCategory: (id) => axiosClient.patch(`/admin/categories/${id}/toggle`),
};

export default CategoryService;

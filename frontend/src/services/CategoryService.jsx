import axiosClient from "../api/axiosClient";

const CategoryService = {
  getAllCategories: () => axiosClient.get("/categories"),
  getCategoryById: (id) => axiosClient.get(`/admin/categories/${id}`),
  createCategory: (formData) =>
    axiosClient.post("/admin/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    
  updateCategory: (id, formData) =>
    axiosClient.post(`/admin/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
  }),
  
  toggleCategory: (id) => axiosClient.patch(`/admin/categories/${id}/toggle`),
};

export default CategoryService;
import axiosClient from "../api/axiosClient";

const ProductShopService = {
    getAllProducts: () => axiosClient.get(`/products`),
    createProduct: (data) => axiosClient.post("/products", data,{
        headers: { "Content-Type": "multipart/form-data" },
    }),
    updateProduct: (id, data) => axiosClient.post(`/products/${id}`, data,{
        headers: { "Content-Type": "multipart/form-data" },
    }),
    updateProductStatus : (id, status) => axiosClient.put(`/products/${id}/status`, {status}),

}
export default ProductShopService

import axiosClient from "../api/axiosClient";
const settingSellerService = {
    getShops: () => axiosClient.get("/seller/settings/shop"), 
    createShop: (data) => axiosClient.post("/seller/settings/shop", data, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    updateShop: (id, data) => axiosClient.post(`/seller/settings/shop/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default settingSellerService;
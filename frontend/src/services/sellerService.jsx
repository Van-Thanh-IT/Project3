import axiosClient from "../api/axiosClient";

const sellerService = {
  //admin
  getAllSellers: () => axiosClient.get(`/admin/sellers`),
  getPendingSellers: () => axiosClient.get(`/admin/sellers/pending`),
  getSellerDetail: (id) => axiosClient.get(`/admin/sellers/${id}`),
  approveSeller: (id) => axiosClient.post(`/admin/sellers/approve/${id}`),
  rejectSeller: (id, reason) => axiosClient.post(`/admin/sellers/reject/${id}`, { reason }),
  revokeSeller: (id) => axiosClient.post(`/admin/sellers/revoke/${id}`),
  getRevokedList: () => axiosClient.get(`/admin/sellers/revoked`),
  restoreSeller: (id) => axiosClient.post(`/admin/sellers/restore/${id}`),
  
  //seller
  registerSeller:  (data) =>  axiosClient.post("/user/registerSeller", data, {
    headers: {"Content-Type": "multipart/form-data"},
  })
};

export default sellerService;

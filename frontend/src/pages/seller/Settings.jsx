import React, { useEffect, useState } from "react";
import settingSellerService from "../../services/SettingSellerService";
import { toast } from "react-toastify";
import { 
  Store, UploadCloud, Save, X, Edit3, 
  MapPin, Info, CheckCircle2 
} from "lucide-react";

const Settings = () => {
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", avatar: null });
  const [editingShop, setEditingShop] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // State để xem trước ảnh
  const [loading, setLoading] = useState(false);

  // Lấy danh sách shop
  const fetchShops = async () => {
    try {
      const res = await settingSellerService.getShops();
      setShops(res.data.data);
    } catch (err) {
      // Silent error or toast
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      const file = files[0];
      setForm({ ...form, avatar: file });
      setAvatarPreview(URL.createObjectURL(file)); // Tạo URL xem trước
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Tạo shop
  const handleCreate = async () => {
    if (!form.name.trim()) return toast.warning("Vui lòng nhập tên Shop");
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description || "");
      if (form.avatar) data.append("avatar", form.avatar);

      const res = await settingSellerService.createShop(data);
      toast.success(res.data.message);
      setForm({ name: "", description: "", avatar: null });
      setAvatarPreview(null);
      fetchShops();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi tạo shop");
    } finally {
      setLoading(false);
    }
  };

  // Bắt đầu chỉnh sửa
  const startEdit = (shop) => {
    setEditingShop(shop);
    setForm({ name: shop.name, description: shop.description || "", avatar: null });
    setAvatarPreview(shop.avatar); // Hiển thị avatar hiện tại
  };

  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingShop(null);
    setForm({ name: "", description: "", avatar: null });
    setAvatarPreview(null);
  };

  // Cập nhật shop
  const handleUpdate = async () => {
    if (!form.name || !form.name.trim()) {
      toast.error("Tên shop không được để trống");
      return;
    }
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("description", form.description?.trim() || "");
      
      if (form.avatar instanceof File) { 
        data.append("avatar", form.avatar);
      }

      data.append("_method", "PUT"); 

      const res = await settingSellerService.updateShop(editingShop.id, data);
      
      toast.success(res.data.message);
      setEditingShop(null);
      setForm({ name: "", description: "", avatar: null });
      setAvatarPreview(null);
      fetchShops();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Store className="w-8 h-8 text-indigo-600" /> Hồ Sơ Shop
        </h1>
        <p className="text-slate-500 text-sm mt-1">Quản lý thông tin hiển thị và thương hiệu của cửa hàng.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* CASE 1: CHƯA CÓ SHOP HOẶC ĐANG SỬA -> HIỂN THỊ FORM */}
        {(shops.length === 0 || editingShop) && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                {editingShop ? <Edit3 className="w-5 h-5"/> : <Store className="w-5 h-5"/>}
                {editingShop ? "Chỉnh Sửa Thông Tin" : "Khởi Tạo Gian Hàng"}
              </h3>
              {editingShop && (
                <button onClick={cancelEdit} className="text-indigo-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Cột Trái: Avatar Upload */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative group w-40 h-40 mb-4">
                    <div className={`w-full h-full rounded-full overflow-hidden border-4 border-indigo-50 shadow-lg ${!avatarPreview ? 'bg-gray-100 flex items-center justify-center' : ''}`}>
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-16 h-16 text-gray-300" />
                      )}
                    </div>
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-indigo-50 transition-all group-hover:scale-110">
                      <UploadCloud className="w-5 h-5" />
                    </label>
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      name="avatar" 
                      onChange={handleChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">Định dạng: .jpg, .png</p>
                </div>

                {/* Cột Phải: Inputs */}
                <div className="w-full md:w-2/3 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tên Shop <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nhập tên cửa hàng của bạn..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả giới thiệu</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Giới thiệu đôi chút về cửa hàng và sản phẩm..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={editingShop ? handleUpdate : handleCreate}
                      disabled={loading}
                      className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 disabled:bg-gray-400"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <><Save className="w-5 h-5" /> {editingShop ? "Lưu Thay Đổi" : "Tạo Gian Hàng"}</>
                      )}
                    </button>
                    {editingShop && (
                      <button
                        onClick={cancelEdit}
                        className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all border border-gray-200"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: ĐÃ CÓ SHOP VÀ KHÔNG SỬA -> HIỂN THỊ SHOP INFO CARD */}
        {shops.map((shop) => (
          !editingShop && (
            <div key={shop.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              {/* Cover Banner giả lập (nếu muốn đẹp hơn) */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 w-full relative"></div>
              
              <div className="px-8 pb-8 relative">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 mb-6">
                  {/* Avatar */}
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex-shrink-0">
                    {shop.avatar ? (
                      <img src={shop.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <Store className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{shop.name}</h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>Tài khoản đã xác thực</span>
                        </div>
                      </div>
                      <button
                        onClick={() => startEdit(shop)}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <Edit3 className="w-4 h-4" /> Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description Box */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Giới thiệu cửa hàng
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {shop.description || "Chưa có mô tả giới thiệu..."}
                  </p>
                </div>

                {/* Footer Info (Ví dụ) */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                   <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-indigo-50 rounded-full text-indigo-600"><Store className="w-5 h-5"/></div>
                      <div>
                        <p className="text-xs text-gray-400">Loại hình</p>
                        <p className="font-medium text-sm">Cửa hàng cá nhân</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-green-50 rounded-full text-green-600"><CheckCircle2 className="w-5 h-5"/></div>
                      <div>
                        <p className="text-xs text-gray-400">Trạng thái</p>
                        <p className="font-medium text-sm text-green-600">Đang hoạt động</p>
                      </div>
                   </div>
                   {/* Có thể thêm địa chỉ nếu API trả về */}
                </div>

              </div>
            </div>
          )
        ))}

      </div>
    </div>
  );
};

export default Settings;
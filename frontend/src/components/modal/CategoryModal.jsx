import React, { useState, useEffect } from "react";
import { XMarkIcon, PhotoIcon, FolderIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const CategoryModal = ({ category, categories, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    parent_id: null,
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [formError, setFormError] = useState("");
  const [isClosing, setIsClosing] = useState(false); // State để xử lý animation đóng

  const parentOptions = categories.filter(
    (cat) => cat.parent_id === null && (!category || cat.id !== category.id)
  );

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        parent_id: category.parent_id || null,
        description: category.description || "",
        image: null,
      });
      setPreview(category.image || null);
    }
  }, [category]);

  // Hàm đóng có animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Vui lòng nhập tên danh mục");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name.trim());
    form.append("parent_id", formData.parent_id ?? "");
    form.append("description", formData.description ?? "");
    if (formData.image instanceof File) form.append("image", formData.image);
    if (category) form.append("_method", "PUT");

    try {
      await onSubmit(form, category?.id);
      handleClose();
    } catch (err) {
      console.error(err);  
      setFormError(err?.message || "Đã xảy ra lỗi!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Modal Container với hiệu ứng Scale Up */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all duration-200 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
      >
        
        {/* Header: Tạo điểm nhấn border-bottom nhẹ */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div>
             <h2 className="text-xl font-bold text-gray-800">
                {category ? "Cập nhật danh mục" : "Thêm danh mục mới"}
             </h2>
             <p className="text-xs text-gray-500 mt-1">Điền thông tin chi tiết cho danh mục của bạn</p>
          </div>
          <button 
            onClick={handleClose} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
             <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 md:p-8">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </svg>
              {formError}
            </div>
          )}

          <form id="categoryForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* CỘT TRÁI (7 phần) */}
              <div className="md:col-span-7 flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tên danh mục <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Nhập tên danh mục..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    placeholder="Mô tả ngắn gọn về danh mục này..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 flex-1 min-h-[140px] resize-none"
                  />
                </div>
              </div>

              {/* CỘT PHẢI (5 phần) */}
              <div className="md:col-span-5 flex flex-col gap-6">
                
                {/* Upload Area - Làm đẹp hơn */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
                  <div className="relative group">
                    <div className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all h-48 flex flex-col items-center justify-center cursor-pointer ${preview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>
                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        
                        {preview ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            {/* Overlay khi hover vào ảnh đã chọn */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <PhotoIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        ) : (
                        <>
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <ArrowUpTrayIcon className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Tải ảnh lên</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG (Tối đa 2MB)</p>
                        </>
                        )}
                    </div>
                  </div>
                </div>

                {/* Danh mục cha - Card style */}
                <div className="flex-1 flex flex-col min-h-0">
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục cha</label>
                   <div className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden flex flex-col h-full max-h-[200px]">
                      {/* Header nhỏ cho list */}
                      <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Chọn 1 danh mục
                      </div>
                      
                      <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
                          <label className={`flex items-center w-full px-3 py-2 rounded-lg cursor-pointer transition-all ${formData.parent_id === null ? 'bg-white shadow-sm border border-gray-200' : 'hover:bg-gray-200/50'}`}>
                            <input
                              type="radio"
                              name="parent_id"
                              checked={formData.parent_id === null}
                              onChange={() => setFormData({ ...formData, parent_id: null })}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-700">-- Gốc (Không có cha) --</span>
                          </label>
                          
                          {parentOptions.map((cat) => (
                            <label key={cat.id} className={`flex items-center w-full px-3 py-2 rounded-lg cursor-pointer transition-all ${formData.parent_id === cat.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-200/50'}`}>
                              <input
                                type="radio"
                                name="parent_id"
                                value={cat.id}
                                checked={formData.parent_id === cat.id}
                                onChange={() => setFormData({ ...formData, parent_id: cat.id })}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <div className="ml-3 flex items-center">
                                <FolderIcon className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600">{cat.name}</span>
                              </div>
                            </label>
                          ))}
                      </div>
                   </div>
                </div>

              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-sm transition-all text-sm"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="categoryForm"
            className="px-6 py-2.5 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all text-sm transform hover:-translate-y-0.5"
          >
            {category ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CategoryModal;
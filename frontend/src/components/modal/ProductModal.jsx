import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProductThunk, updateProductThunk } from "../../app/features/productSlice";
import { fetchCategoriesThunk } from "../../app/features/categorySlice";
// import {filterActiveCategories} from "../../app/features/categorySlice";

import { toast } from "react-toastify";
import { 
  XMarkIcon, PhotoIcon, PlusIcon, TrashIcon, CubeIcon, 
  TagIcon, ListBulletIcon, CurrencyDollarIcon 
} from "@heroicons/react/24/outline";

const ProductModal = ({ isOpen, onClose, product }) => {
  console.log(product);
  const dispatch = useDispatch();
  
  // 1. Lấy data từ Redux an toàn
  const { categories } = useSelector((state) => state.category) || { categories: [] };
  const activeCategories = categories.filter(cat => cat.status === 1);
  const { loading } = useSelector((state) => state.product) || { loading: false };
  console.log(categories);
  // State quản lý ảnh: Tách biệt ảnh cũ (URL) và ảnh mới (File)
  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const initialForm = {
    category_id: "",
    name: "",
    description: "",
    price: "",
    variants: [],
  };
  const [form, setForm] = useState(initialForm);

  // Load danh mục khi mở modal
  useEffect(() => {
    if (isOpen) dispatch(fetchCategoriesThunk());
  }, [isOpen, dispatch]);

  // 3. Load dữ liệu vào Form khi mở (Fill data để sửa)
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // --- CHẾ ĐỘ SỬA ---
        setForm({
          category_id: product.category_id || "",
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          // Variants logic
          variants: Array.isArray(product.variants) 
            ? product.variants.map(v => ({
                id: v.id,
                color: v.color || "",
                size: v.size || "",
                price: v.price || "",
                attributes: Array.isArray(v.attributes) ? [...v.attributes] : []
              })) 
            : [],
        });
        
        // HIỂN THỊ ẢNH CŨ NGAY LẬP TỨC
        setOldImages(Array.isArray(product.images) ? product.images : []);
        setNewImages([]); // Reset ảnh mới
      } else {
        // --- CHẾ ĐỘ THÊM MỚI ---
        setForm(initialForm);
        setOldImages([]);
        setNewImages([]);
        setForm(prev => ({
           ...prev,
           variants: [{ color: "", size: "", price: "", attributes: [] }] 
        }));
      }
    }
  }, [isOpen, product]);

  // --- HANDLERS ---

  const handleInput = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Thêm ảnh mới vào danh sách hiển thị ngay
      setNewImages(prev => [...prev, ...files]);
    }
    e.target.value = null; 
  };

  const removeOldImage = (id) => {
    // Xóa ảnh cũ trên UI -> Khi submit sẽ không gửi ID này -> Backend sẽ xóa trong DB
    setOldImages(prev => prev.filter(img => img.id !== id));
  };

  const removeNewImage = (index) => {
    // Hủy chọn ảnh mới vừa upload
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // --- VARIANTS HANDLERS ---
  const addVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [...prev.variants, { color: "", size: "", price: "", attributes: [] }]
    }));
  };

  const removeVariant = (index) => {
    const newVariants = form.variants.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, variants: newVariants }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index][field] = value;
    setForm(prev => ({ ...prev, variants: newVariants }));
  };

  // --- ATTRIBUTES HANDLERS ---
  const addAttribute = (vIndex) => {
    const newVariants = [...form.variants];
    if (!newVariants[vIndex].attributes) newVariants[vIndex].attributes = [];
    newVariants[vIndex].attributes.push({ attribute_name: "", attribute_value: "" });
    setForm(prev => ({ ...prev, variants: newVariants }));
  };

  const removeAttribute = (vIndex, aIndex) => {
    const newVariants = [...form.variants];
    newVariants[vIndex].attributes = newVariants[vIndex].attributes.filter((_, i) => i !== aIndex);
    setForm(prev => ({ ...prev, variants: newVariants }));
  };

  const handleAttributeChange = (vIndex, aIndex, field, value) => {
    const newVariants = [...form.variants];
    newVariants[vIndex].attributes[aIndex][field] = value;
    setForm(prev => ({ ...prev, variants: newVariants }));
  };

  // --- SUBMIT ---
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error("Vui lòng điền Tên, Giá và Danh mục!");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category_id", form.category_id);
    formData.append("description", form.description || "");
    formData.append("price", form.price);
    // ĐÃ BỎ STATUS

    // 1. Xử lý Variants
    form.variants.forEach((v, i) => {
        formData.append(`variants[${i}][color]`, v.color || "");
        formData.append(`variants[${i}][size]`, v.size || "");
        formData.append(`variants[${i}][price]`, v.price || form.price); 
        if (v.id) formData.append(`variants[${i}][id]`, v.id);

        if (Array.isArray(v.attributes)) {
            v.attributes.forEach((a, j) => {
                formData.append(`variants[${i}][attributes][${j}][attribute_name]`, a.attribute_name);
                formData.append(`variants[${i}][attributes][${j}][attribute_value]`, a.attribute_value);
            });
        }
    });

    // // 2. Xử lý Ảnh MỚI upload
    newImages.forEach((file, i) => {
        formData.append(`images[${i}][url]`, file);
        // Nếu không còn ảnh cũ nào thì ảnh mới đầu tiên là Primary
        const isPrimary = (oldImages.length === 0 && i === 0) ? 1 : 0;
        formData.append(`images[${i}][is_primary]`, isPrimary);
    });

  

    try {
      if (product) {
        // --- LOGIC UPDATE ---
        formData.append("_method", "PUT");
        
        // Gửi danh sách ID ảnh CŨ mà người dùng GIỮ LẠI
        // Nếu người dùng không xóa gì -> Gửi toàn bộ ID cũ -> Backend giữ nguyên
        // Nếu người dùng xóa bớt -> Gửi list còn lại -> Backend xóa ảnh thiếu
        oldImages.forEach((img, i) => {
            formData.append(`old_image_ids[${i}]`, img.id);
        });
        
        await dispatch(updateProductThunk({ id: product.id, formData })).unwrap();
        toast.success("Cập nhật thành công!");
      } else {
        // --- LOGIC CREATE ---
        await dispatch(createProductThunk(formData)).unwrap();
        toast.success("Thêm sản phẩm thành công!");
      }
      onClose();
    } catch (err) {
      console.error("Lỗi API:", err);
      if (err && err.errors) {
        const firstErrorKey = Object.keys(err.errors)[0];
        const firstErrorMessage = err.errors[firstErrorKey][0];
        toast.error(`${firstErrorMessage}`);
      } else if (err && err.message) {
        toast.error(err.message);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-orange-100 rounded-full">
                {product ? <CubeIcon className="w-6 h-6 text-orange-600"/> : <PlusIcon className="w-6 h-6 text-green-600"/>}
             </div>
             <h2 className="text-xl font-bold text-gray-800">
                {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
             </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* KHỐI 1: THÔNG TIN CƠ BẢN */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-blue-500"/> Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tên sản phẩm */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
                    <input name="name" value={form.name} onChange={handleInput} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Nhập tên sản phẩm..."/>
                </div>
                
                {/* Danh mục (Đã căn chỉnh lại grid) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                    <select name="category_id" value={form.category_id} onChange={handleInput} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white outline-none">
                        <option value="">-- Chọn Danh Mục --</option>
                        {Array.isArray(categories) && activeCategories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                </div>

                {/* Ô trống để cân bằng layout (hoặc có thể thêm field khác nếu muốn) */}
                <div className="hidden md:block"></div>

                {/* Mô tả */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
                    <textarea name="description" value={form.description} onChange={handleInput} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none" placeholder="Mô tả chi tiết..."/>
                </div>
            </div>
          </div>

          {/* KHỐI 2: HÌNH ẢNH */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2"><PhotoIcon className="w-5 h-5 text-blue-500"/> Hình ảnh sản phẩm</h3>
             <div className="flex flex-wrap gap-4">
                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-orange-300 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors group">
                    <PlusIcon className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform"/>
                    <span className="text-xs text-orange-500 font-medium mt-1">Thêm ảnh</span>
                    <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*"/>
                </label>
                
                {/* Render Ảnh CŨ (Nếu người dùng ko xóa thì nó vẫn ở đây) */}
                {oldImages.map((img) => (
                    <div key={img.id} className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden group">
                        <img src={img.url} alt="old" className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => removeOldImage(img.id)} className="text-white bg-red-500 p-1 rounded-full hover:bg-red-600"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                        <span className="absolute bottom-0 left-0 w-full bg-gray-800/60 text-white text-[10px] text-center py-0.5">Ảnh cũ</span>
                    </div>
                ))}

                {/* Render Ảnh MỚI (Nếu người dùng upload thêm) */}
                {newImages.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative w-24 h-24 border-2 border-green-400 rounded-lg overflow-hidden group">
                        <img src={URL.createObjectURL(file)} alt="new" className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button onClick={() => removeNewImage(idx)} className="text-white bg-red-500 p-1 rounded-full hover:bg-red-600"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                        <span className="absolute bottom-0 left-0 w-full bg-green-600 text-white text-[10px] text-center py-0.5">Mới</span>
                    </div>
                ))}
             </div>
          </div>

          {/* KHỐI 3: THÔNG TIN BÁN HÀNG */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
                    <ListBulletIcon className="w-5 h-5 text-blue-500"/> Phân loại hàng (Variants)
                </h3>
                <div className="flex gap-2">
                     <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
                         <CurrencyDollarIcon className="w-4 h-4 text-gray-500"/>
                         <input type="number" placeholder="Giá chung..." value={form.price} onChange={e => setForm(prev => ({...prev, price: e.target.value}))} className="bg-transparent outline-none text-sm w-24 font-semibold"/>
                         <span className="text-xs text-gray-400">VNĐ</span>
                     </div>
                     <button onClick={addVariant} className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-lg font-medium border border-orange-200 hover:bg-orange-100 text-sm">
                        <PlusIcon className="w-4 h-4"/> Thêm phân loại
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {Array.isArray(form.variants) && form.variants.map((v, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors relative bg-gray-50/50">
                        {form.variants.length > 1 && (
                            <button onClick={() => removeVariant(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                                <XMarkIcon className="w-5 h-5"/>
                            </button>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Màu sắc</label>
                                    <input value={v.color} onChange={e => handleVariantChange(i, "color", e.target.value)} placeholder="VD: Đỏ..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:border-orange-500 outline-none"/>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Kích thước</label>
                                    <input value={v.size} onChange={e => handleVariantChange(i, "size", e.target.value)} placeholder="VD: S, M..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:border-orange-500 outline-none"/>
                                </div>
                            </div>
                            
                            <div className="col-span-2">
                                <label className="text-xs text-gray-500 mb-1 block">Giá riêng (Để trống lấy giá chung)</label>
                                <input 
                                    type="number"
                                    value={v.price} 
                                    onChange={e => handleVariantChange(i, "price", e.target.value)} 
                                    placeholder={form.price || "0"} 
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:border-orange-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-white p-3 rounded border border-dashed border-gray-300">
                             <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-xs font-medium text-gray-500 mr-2">Thông số khác:</span>
                                {Array.isArray(v.attributes) && v.attributes.map((a, j) => (
                                    <div key={j} className="flex items-center bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                        <input value={a.attribute_name} onChange={e => handleAttributeChange(i, j, "attribute_name", e.target.value)} placeholder="Tên" className="bg-transparent w-16 text-xs border-b border-blue-200 outline-none text-blue-800"/>
                                        <span className="mx-1 text-blue-400">:</span>
                                        <input value={a.attribute_value} onChange={e => handleAttributeChange(i, j, "attribute_value", e.target.value)} placeholder="Giá trị" className="bg-transparent w-20 text-xs border-b border-blue-200 outline-none text-blue-800"/>
                                        <button onClick={() => removeAttribute(i, j)} className="ml-2 text-red-400 hover:text-red-600"><XMarkIcon className="w-3 h-3"/></button>
                                    </div>
                                ))}
                                <button onClick={() => addAttribute(i)} className="text-xs text-blue-600 hover:underline flex items-center gap-1 py-1">
                                    <PlusIcon className="w-3 h-3"/> Thêm
                                </button>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-end gap-4 sticky bottom-0 z-10">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 border hover:border-gray-300">Hủy bỏ</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading || !form.name || !form.price}
            className={`px-8 py-2 rounded-lg text-white font-bold shadow-md flex items-center gap-2 ${(loading || !form.name || !form.price) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600'}`}
          >
             {loading && "..."} {product ? "Lưu Cập Nhật" : "Đăng Sản Phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
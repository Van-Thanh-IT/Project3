import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  XMarkIcon, CubeIcon, TagIcon, CurrencyDollarIcon, 
  SwatchIcon, InformationCircleIcon, PhotoIcon 
} from "@heroicons/react/24/outline";

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Khi mở modal hoặc đổi sản phẩm, reset ảnh hiển thị về ảnh đầu tiên
  useEffect(() => {
    if (isOpen && product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0].url);
    } else {
      setSelectedImage(null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Hàm format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Render Badge trạng thái
  const renderStatusBadge = (status) => {
    const styles = {
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending_approval: "bg-amber-100 text-amber-700 border-amber-200",
      archived: "bg-gray-100 text-gray-600 border-gray-200",
      inactive: "bg-red-100 text-red-600 border-red-200"
    };
    const labels = {
      active: "Đang hoạt động",
      pending_approval: "Chờ duyệt",
      archived: "Đã ẩn",
      inactive: "Ngừng kinh doanh"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.archived}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* HEADER */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
               <CubeIcon className="w-6 h-6"/>
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800 line-clamp-1">Chi tiết sản phẩm</h2>
                <p className="text-xs text-gray-500 font-mono">ID: #{product.id}</p>
            </div>
          </div>
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* CỘT TRÁI: HÌNH ẢNH (5 Cột) */}
            <div className="lg:col-span-5 space-y-4">
               {/* Ảnh lớn */}
               <div className="aspect-square w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center relative group">
                  {selectedImage ? (
                    <img 
                        src={selectedImage} 
                        alt="Main" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-300">
                        <PhotoIcon className="w-16 h-16"/>
                        <span className="text-sm font-medium">Không có ảnh</span>
                    </div>
                  )}
               </div>

               {/* List ảnh nhỏ */}
               {product.images && product.images.length > 0 && (
                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.map((img) => (
                        <button 
                            key={img.id}
                            onClick={() => setSelectedImage(img.url)}
                            className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${selectedImage === img.url ? 'border-indigo-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                            <img src={img.url} alt="thumb" className="w-full h-full object-cover"/>
                        </button>
                    ))}
                 </div>
               )}
            </div>

            {/* CỘT PHẢI: THÔNG TIN (7 Cột) */}
            <div className="lg:col-span-7 space-y-6">
               {/* 1. Tiêu đề & Giá */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start gap-4 mb-3">
                      <h1 className="text-2xl font-bold text-gray-800 leading-tight">{product.name}</h1>
                      {renderStatusBadge(product.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <TagIcon className="w-4 h-4"/>
                      <span>Danh mục: <span className="font-semibold text-gray-700">{product.category?.name || "Chưa cập nhật"}</span></span>
                  </div>

                  <div className="flex items-end gap-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                      <CurrencyDollarIcon className="w-8 h-8 text-indigo-600 mb-1"/>
                      <span className="text-3xl font-extrabold text-indigo-600">{formatCurrency(product.price)}</span>
                      <span className="text-sm text-indigo-400 mb-2 font-medium">/ sản phẩm</span>
                  </div>
               </div>

               {/* 2. Mô tả */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <InformationCircleIcon className="w-5 h-5 text-gray-400"/> Mô tả sản phẩm
                  </h3>
                  <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line min-h-[80px]">
                      {product.description || "Chưa có mô tả cho sản phẩm này."}
                  </div>
               </div>

               {/* 3. Variants Grid */}
               {product.variants && product.variants.length > 0 && (
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <SwatchIcon className="w-5 h-5 text-gray-400"/> Phân loại hàng ({product.variants.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.variants.map((variant) => (
                            <div key={variant.id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all bg-gray-50/30">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2">
                                        {variant.color && (
                                            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-700 shadow-sm">
                                                {variant.color}
                                            </span>
                                        )}
                                        {variant.size && (
                                            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-700 shadow-sm">
                                                {variant.size}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-end mt-3">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-mono uppercase">SKU: {variant.sku || "N/A"}</p>
                                        <p className="text-sm font-bold text-indigo-600">
                                            {variant.price ? formatCurrency(variant.price) : formatCurrency(product.price)}
                                        </p>
                                    </div>
                                </div>

                                {/* Attributes */}
                                {variant.attributes && variant.attributes.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-1.5">
                                        {variant.attributes.map((attr, idx) => (
                                            <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {attr.attribute_name}: {attr.attribute_value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
            >
                Đóng
            </button>
        </div>

      </div>
    </div>
  );
};

ProductDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
};

export default ProductDetailModal;
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAllProductsThunk,
  updateProductStatusThunk
} from "../../app/features/productSlice";
import ProductModal from "../../components/modal/ProductModal";
import ProductDetailModal from "../../components/modal/ProductDetailModal";
import { 
  PlusIcon, MagnifyingGlassIcon, FunnelIcon, 
  PencilSquareIcon, EyeIcon, ArchiveBoxIcon, 
  ArrowPathIcon, CubeIcon, CheckBadgeIcon, ClockIcon, NoSymbolIcon ,PhotoIcon
} from "@heroicons/react/24/outline";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  // State UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  
  // State Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 

  // Lấy dữ liệu
  useEffect(() => {
    dispatch(fetchAllProductsThunk());
  }, [dispatch]);

  // --- LOGIC THỐNG KÊ & FILTER ---
  const stats = useMemo(() => {
    if (!Array.isArray(products)) return { total: 0, active: 0, pending: 0, archived: 0 };
    return {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      pending: products.filter(p => p.status === 'pending_approval').length,
      archived: products.filter(p => p.status === 'archived' || p.status === 'inactive').length,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' 
        ? true 
        : (filterStatus === 'archived' ? (p.status === 'archived' || p.status === 'inactive') : p.status === filterStatus);
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, filterStatus]);

  // --- HANDLERS ---
  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (productId, currentStatus, newStatus) => {
    const actionText = newStatus === 'archived' ? 'Tạm ẩn' : 'Mở bán lại';
    if (window.confirm(`Bạn có chắc muốn ${actionText} sản phẩm này?`)) {
      dispatch(updateProductStatusThunk({ id: productId, status: newStatus }));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // --- RENDER COMPONENTS ---
  
  // Badge trạng thái
  const StatusBadge = ({ status }) => {
    const styles = {
      active: "bg-green-100 text-green-700 border-green-200",
      pending_approval: "bg-yellow-50 text-yellow-700 border-yellow-200",
      archived: "bg-gray-100 text-gray-600 border-gray-200",
      inactive: "bg-red-50 text-red-600 border-red-200"
    };
    
    const labels = {
      active: "Đang hoạt động",
      pending_approval: "Chờ duyệt",
      archived: "Đã ẩn",
      inactive: "Ngừng kinh doanh"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.archived} flex items-center gap-1 w-fit`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-slate-800">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CubeIcon className="w-8 h-8 text-indigo-600" /> Quản Lý Sản Phẩm
          </h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý kho hàng và trạng thái sản phẩm của bạn.</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5 font-medium"
        >
          <PlusIcon className="w-5 h-5" /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* 2. DASHBOARD MINI STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-blue-50 rounded-full text-blue-600"><CubeIcon className="w-6 h-6"/></div>
           <div><p className="text-xs text-gray-500 font-medium">Tổng sản phẩm</p><h4 className="text-xl font-bold text-gray-800">{stats.total}</h4></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-green-50 rounded-full text-green-600"><CheckBadgeIcon className="w-6 h-6"/></div>
           <div><p className="text-xs text-gray-500 font-medium">Đang hoạt động</p><h4 className="text-xl font-bold text-gray-800">{stats.active}</h4></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-yellow-50 rounded-full text-yellow-600"><ClockIcon className="w-6 h-6"/></div>
           <div><p className="text-xs text-gray-500 font-medium">Chờ duyệt</p><h4 className="text-xl font-bold text-gray-800">{stats.pending}</h4></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-gray-100 rounded-full text-gray-600"><NoSymbolIcon className="w-6 h-6"/></div>
           <div><p className="text-xs text-gray-500 font-medium">Đã ẩn / Vi phạm</p><h4 className="text-xl font-bold text-gray-800">{stats.archived}</h4></div>
        </div>
      </div>

      {/* 3. FILTERS & TABS */}
      <div className="bg-white rounded-t-xl border-b border-gray-200 px-6 pt-4">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {[
                { id: 'all', label: 'Tất cả' },
                { id: 'active', label: 'Đang hoạt động' },
                { id: 'pending_approval', label: 'Chờ duyệt' },
                { id: 'archived', label: 'Đã ẩn' }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        filterStatus === tab.id 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* 4. TOOLBAR */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4 items-center">
         <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            <input 
                type="text" 
                placeholder="Tìm kiếm theo tên sản phẩm..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
         </div>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <FunnelIcon className="w-4 h-4"/> Bộ lọc
            </button>
         </div>
      </div>

      {/* 5. PRODUCT TABLE */}
      <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                        <th className="px-6 py-4 w-14">ID</th>
                        <th className="px-6 py-4">Thông tin sản phẩm</th>
                        <th className="px-6 py-4">Giá bán</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        // Loading Skeleton
                        [...Array(3)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                                <td className="px-6 py-4"></td>
                            </tr>
                        ))
                    ) : filteredProducts.length === 0 ? (
                        // Empty State
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <CubeIcon className="w-16 h-16 mb-4 text-gray-200"/>
                                    <p className="text-lg font-medium text-gray-500">Không tìm thấy sản phẩm nào</p>
                                    <p className="text-sm">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        // Product List
                        filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-indigo-50/30 transition-colors group">
                                <td className="px-6 py-4 text-gray-500 text-sm">#{product.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><PhotoIcon className="w-6 h-6"/></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {product.category?.name || "Chưa phân loại"} 
                                                {product.variants?.length > 0 && <span className="mx-1">• {product.variants.length} phân loại</span>}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {formatCurrency(product.price)}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={product.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => { setDetailProduct(product); setIsDetailModalOpen(true); }}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                            title="Xem chi tiết"
                                        >
                                            <EyeIcon className="w-5 h-5"/>
                                        </button>
                                        
                                        {/* Chỉ cho sửa nếu chưa bị khóa vĩnh viễn */}
                                        {product.status !== 'inactive' && (
                                            <button 
                                                onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                                                title="Chỉnh sửa"
                                            >
                                                <PencilSquareIcon className="w-5 h-5"/>
                                            </button>
                                        )}

                                        {/* Nút Ẩn / Hiện */}
                                        {product.status === 'active' && (
                                            <button 
                                                onClick={() => handleUpdateStatus(product.id, product.status, "archived")}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Tạm ẩn sản phẩm"
                                            >
                                                <ArchiveBoxIcon className="w-5 h-5"/>
                                            </button>
                                        )}
                                        {(product.status === 'archived' || product.status === 'inactive') && (
                                            <button 
                                                onClick={() => handleUpdateStatus(product.id, product.status, "active")}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Mở bán lại"
                                            >
                                                <ArrowPathIcon className="w-5 h-5"/>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        
        {/* Pagination (Placeholder - bạn có thể thêm logic phân trang sau) */}
        {!loading && filteredProducts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Hiển thị {filteredProducts.length} kết quả</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-50">Trước</button>
                    <button className="px-3 py-1 text-xs border rounded bg-indigo-600 text-white">1</button>
                    <button className="px-3 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-50">Sau</button>
                </div>
            </div>
        )}
      </div>

      {/* MODALS */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
      />
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={detailProduct}
      />
    </div>
  );
};

export default ProductManagement;
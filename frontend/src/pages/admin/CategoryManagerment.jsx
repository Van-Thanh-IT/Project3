import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesThunk,
  createCategoryThunk,
  updateCategoryThunk,
  toggleCategoryThunk,
  resetCategoryState,
} from "../../app/features/categorySlice";
import CategoryModal from "../../components/modal/CategoryModal";

// Icons
import {
  PlusIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  ChartBarIcon,
  CheckCircleIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";

// --- COMPONENT THỐNG KÊ NHỎ ---
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

// --- COMPONENT SKELETON LOADING ---
const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((i) => (
      <tr key={i} className="animate-pulse border-b border-gray-50">
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
        <td className="px-6 py-4"><div className="h-10 w-10 bg-gray-200 rounded-lg"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div></td>
        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div></td>
        <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-16 ml-auto"></div></td>
      </tr>
    ))}
  </>
);

// --- MAIN COMPONENT ---
const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
    return () => dispatch(resetCategoryState());
  }, [dispatch]);

  // Xử lý logic
  const handleAdd = () => setAddModalOpen(true);
  const handleEdit = (cat) => { setEditingCategory(cat); setEditModalOpen(true); };
  const handleSubmitAdd = async (form) => { await dispatch(createCategoryThunk(form)).unwrap(); dispatch(fetchCategoriesThunk()); };
  const handleSubmitEdit = async (form, id) => { await dispatch(updateCategoryThunk({ id, data: form })).unwrap(); dispatch(fetchCategoriesThunk()); };
  const handleToggle = async (id) => { try { await dispatch(toggleCategoryThunk(id)).unwrap(); dispatch(fetchCategoriesThunk()); } catch (err) {} };

  // Logic Tree View + Search
  const processedCategories = useMemo(() => {
    const treeData = (list, parentId = null, level = 0) => {
      const children = list
        .filter((cat) => cat.parent_id === parentId)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)); 
      
      let result = [];
      for (const child of children) {
        result.push({ ...child, level });
        result.push(...treeData(list, child.id, level + 1));
      }
      return result;
    };

    let data = treeData(categories);

    if (searchTerm) {
      data = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data;
  }, [categories, searchTerm]);

  const stats = useMemo(() => ({
    total: categories.length,
    active: categories.filter(c => c.status).length,
    hidden: categories.filter(c => !c.status).length
  }), [categories]);

  return (
    <div className="p-6 min-h-screen bg-[#F3F4F6] font-sans text-gray-800">
      
      {/* HEADER & STATS */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản trị danh mục</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard title="Tổng danh mục" value={stats.total} icon={ChartBarIcon} color="bg-blue-500" />
          <StatCard title="Đang hiển thị" value={stats.active} icon={CheckCircleIcon} color="bg-green-500" />
          <StatCard title="Đang ẩn" value={stats.hidden} icon={NoSymbolIcon} color="bg-red-500" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="relative w-full sm:w-96">
             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             <input 
                type="text" 
                placeholder="Tìm kiếm danh mục..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
             />
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Thêm mới</span>
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        
        {/* TABLE CONTAINER: Thêm Scrollbar + Max Height */}
        {/* max-h-[600px]: Giới hạn chiều cao để hiện thanh cuộn nếu danh sách dài */}
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left border-collapse relative">
            
            {/* HEADER: Sticky top để ghim tiêu đề khi cuộn */}
            <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                <th className="px-6 py-4 w-20 text-center">ID</th>
                <th className="px-6 py-4 w-24">Hình ảnh</th>
                <th className="px-6 py-4">Tên danh mục (Cấu trúc cây)</th>
                <th className="px-6 py-4 w-28 text-center">Thứ tự</th>
                <th className="px-6 py-4 w-36 text-center">Trạng thái</th>
                <th className="px-6 py-4 w-40 text-right">Thao tác</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableSkeleton />
              ) : processedCategories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                       <FolderIcon className="w-12 h-12 mb-2 opacity-50" />
                       <p>Không có dữ liệu danh mục nào.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                processedCategories.map((cat) => (
                  <tr 
                    key={cat.id} 
                    className="group hover:bg-blue-50/40 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-center text-sm text-gray-500">#{cat.id}</td>
                    
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                        {cat.image ? (
                          <img src={cat.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FolderIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </td>

                    {/* CỘT TÊN */}
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center" 
                        style={{ paddingLeft: `${cat.level * 40}px` }}
                      >
                        {cat.level > 0 && (
                          <span className="mr-3 w-5 border-b-2 border-l-2 border-gray-300 h-4 rounded-bl-md inline-block relative -top-2 opacity-50"></span>
                        )}
                        <div>
                          <p className={`text-sm font-medium ${cat.level === 0 ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                             {cat.name}
                          </p>
                          {cat.description && <p className="text-xs text-gray-400 truncate max-w-[200px]">{cat.description}</p>}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
                          {cat.sort_order ?? 0}
                        </span>
                    </td>

                    {/* CỘT TRẠNG THÁI: Chỉ hiển thị Label (Badge) */}
                    <td className="px-6 py-4 text-center">
                       <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                           cat.status 
                           ? "bg-green-100 text-green-700 border-green-200" 
                           : "bg-red-100 text-red-700 border-red-200"
                       }`}>
                         {cat.status ? "Hiển thị" : "Đã ẩn"}
                       </span>
                    </td>

                    {/* CỘT THAO TÁC: Gồm Edit + Switch Bật/Tắt */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                        
                        {/* Nút Sửa */}
                        <button 
                            onClick={() => handleEdit(cat)} 
                            className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm transition-all" 
                            title="Chỉnh sửa"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Nút Bật/Tắt (Switch) chuyển sang đây */}
                        <div className="flex flex-col items-center justify-center">
                            <button 
                                onClick={() => handleToggle(cat.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${cat.status ? 'bg-blue-600' : 'bg-gray-300'}`}
                                title={cat.status ? "Nhấn để ẩn" : "Nhấn để hiển thị"}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${cat.status ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Table */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
           <span className="text-xs text-gray-500">Danh sách được sắp xếp tự động theo cấu trúc & thứ tự ưu tiên.</span>
           <span className="text-sm font-medium text-gray-700">Tổng: {processedCategories.length}</span>
        </div>
      </div>

      {/* Modals */}
      {addModalOpen && <CategoryModal categories={categories} onClose={() => setAddModalOpen(false)} onSubmit={handleSubmitAdd} />}
      {editModalOpen && <CategoryModal category={editingCategory} categories={categories} onClose={() => setEditModalOpen(false)} onSubmit={handleSubmitEdit} />}
    </div>
  );
};

export default CategoryManagement;
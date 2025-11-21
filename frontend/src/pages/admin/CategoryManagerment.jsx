import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesThunk,
  createCategoryThunk,
  updateCategoryThunk,
  toggleCategoryThunk,
  resetCategoryState,
} from "../../app/features/categorySlice";

const CategoryManagerment = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  // --- State modal ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    parent_id: null,
    description: "",
    image: "",
    status: 1,
  });
  const [formError, setFormError] = useState("");

  // --- Fetch danh mục khi load trang ---
  useEffect(() => {
    dispatch(fetchCategoriesThunk());
    return () => dispatch(resetCategoryState());
  }, [dispatch]);

  // --- Mở modal thêm mới ---
  const handleAdd = () => {
    setEditingCategory(null);
    setFormError("");
    setFormData({
      name: "",
      parent_id: null,
      description: "",
      image: "",
      status: 1,
    });
    setModalOpen(true);
  };

  // --- Mở modal sửa ---
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormError("");
    setFormData({
      name: category.name,
      parent_id: category.parent_id,
      description: category.description,
      image: category.image,
      status: category.status,
    });
    setModalOpen(true);
  };

  // --- Submit form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError("");
      if (editingCategory) {
        await dispatch(updateCategoryThunk({ id: editingCategory.id, data: formData })).unwrap();
      } else {
        await dispatch(createCategoryThunk(formData)).unwrap();
      }
        setModalOpen(false);
        dispatch(fetchCategoriesThunk()); 
    } catch (err) {
      console.error("Validation Error:", err);
      // Hiển thị lỗi validation từ Laravel
      if (err.errors) {
        setFormError(Object.values(err.errors).flat().join(", "));
      } else {
        setFormError(err.message || "Đã xảy ra lỗi!");
      }
    }
  };

  // --- Toggle trạng thái ---
  const handleToggle = async (id) => {
    try {
      await dispatch(toggleCategoryThunk(id)).unwrap();
      dispatch(fetchCategoriesThunk());
    } catch (err) {
      console.error("Toggle error:", err);
      setFormError(err.message || "Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý danh mục</h1>

      <button
        onClick={handleAdd}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Thêm danh mục
      </button>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* === Bảng danh mục === */}
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên danh mục</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-100">
              <td className="border p-2">{cat.id}</td>
              <td className="border p-2">{cat.name}</td>
              <td className="border p-2">{cat.status ? "Hiển thị" : "Ẩn"}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="px-2 py-1 bg-yellow-400 text-white rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleToggle(cat.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  {cat.status ? "Ẩn" : "Hiển thị"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* === Modal thêm/sửa === */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
            </h2>
            {formError && <p className="text-red-500 mb-2">{formError}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Tên danh mục"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="URL ảnh"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: Number(e.target.value) })
                }
                className="w-full border p-2 rounded"
              >
                <option value={1}>Hiển thị</option>
                <option value={0}>Ẩn</option>
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagerment;

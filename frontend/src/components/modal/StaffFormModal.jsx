import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Giả sử bạn có action clearStaffError để xóa lỗi cũ trong slice
import { createStaffThunk, fetchAllStaffsThunk, clearStaffError } from "../../app/features/staffSlice";
import { toast } from "react-toastify";

// Icons
import { 
  XMarkIcon, CameraIcon, UserIcon, EnvelopeIcon, 
  LockClosedIcon, PhoneIcon, CalendarDaysIcon, CheckBadgeIcon
} from "@heroicons/react/24/outline";

const StaffFormModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  // Lấy error trực tiếp từ Redux Store
  const { loading, error} = useSelector((state) => state.staff);

  const [form, setForm] = useState({
    username: "", email: "", password: "", phone: "",
    gender: "male", avatar: null, date_of_birth: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (show) {
      setForm({
        username: "", email: "", password: "", phone: "",
        gender: "male", avatar: null, date_of_birth: "",
      });
      setConfirmPassword("");
      setPreview(null);
      
   
      if (dispatch && clearStaffError) {
          dispatch(clearStaffError());
      }
    }
  }, [show, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate Client nhanh (chỉ những cái logic logic ko liên quan server)
    if (form.password !== confirmPassword) {
        toast.error("Mật khẩu nhập lại không khớp!");
        return;
    }

    // 2. Chuẩn bị FormData
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    formData.append("date_of_birth", form.date_of_birth);
    if (form.avatar instanceof File) formData.append("avatar", form.avatar);

    // 3. Gọi API
    try {
      // unwrap() giúp ta bắt được flow thành công hay thất bại
      await dispatch(createStaffThunk(formData)).unwrap();
      
      toast.success("Tạo nhân viên thành công!");
      handleClose();
      dispatch(fetchAllStaffsThunk()); // Load lại danh sách
    } catch (err) {
      console.error("Lỗi tạo staff:", err);
      toast.error("Tạo thất bại! Vui lòng kiểm tra lại thông tin.");
    }
  };

  if (!show) return null;

  // --- Helper: Check lỗi từ Redux store ---
  // Cấu trúc error thường là: { message: "...", errors: { email: ["..."], ... } }
  const hasError = (field) => error?.errors?.[field]?.length > 0;
  const getErrorMsg = (field) => error?.errors?.[field]?.[0];

  const getInputClass = (fieldName) => {
      return `w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none transition text-sm ${
          hasError(fieldName)
            ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50" 
            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white"
      }`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
             <h2 className="text-xl font-bold text-gray-800">Tạo hồ sơ nhân viên</h2>
             <p className="text-xs text-gray-500 mt-1">Nhập thông tin để cấp quyền truy cập hệ thống</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-400 transition">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          {/* Hiển thị lỗi chung nếu có (ví dụ lỗi server 500) */}
          {error && !error.errors && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded border border-red-100">
                  {error.message || "Đã xảy ra lỗi không xác định"}
              </div>
          )}

          <form onSubmit={handleSubmit} id="staffForm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* CỘT TRÁI: Avatar */}
              <div className="md:col-span-4 flex flex-col items-center pt-2">
                 <label className="block text-sm font-semibold text-gray-700 mb-3">Ảnh đại diện</label>
                 <div className={`relative group cursor-pointer rounded-full p-1 border-2 ${hasError('avatar') ? 'border-red-500' : 'border-transparent'}`}>
                    <div className="w-36 h-36 rounded-full border-4 border-gray-100 shadow-sm overflow-hidden relative bg-gray-50">
                        {preview ? <img src={preview} className="w-full h-full object-cover" alt="preview" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><UserIcon className="w-16 h-16" /></div>}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><CameraIcon className="w-8 h-8 text-white" /></div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full" />
                 </div>
                 {/* Lỗi Avatar từ Redux */}
                 {hasError('avatar') && <p className="text-xs text-red-500 mt-2 text-center">{getErrorMsg('avatar')}</p>}
              </div>

              {/* CỘT PHẢI: Inputs */}
              <div className="md:col-span-8 space-y-5">
                 
                 {/* Username */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" name="username" value={form.username} onChange={handleChange} placeholder="Ví dụ: Nguyễn Văn A"
                            className={getInputClass("username")}
                        />
                    </div>
                    {hasError('username') && <p className="text-xs text-red-500 mt-1 ml-1">{getErrorMsg('username')}</p>}
                 </div>

                 {/* Email & Phone */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com"
                                className={getInputClass("email")}
                            />
                        </div>
                        {hasError('email') && <p className="text-xs text-red-500 mt-1 ml-1">{getErrorMsg('email')}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <div className="relative">
                            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="098..."
                                className={getInputClass("phone")}
                            />
                        </div>
                        {hasError('phone') && <p className="text-xs text-red-500 mt-1 ml-1">{getErrorMsg('phone')}</p>}
                    </div>
                 </div>

                 {/* Password & Confirm */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••"
                                className={getInputClass("password")}
                            />
                        </div>
                        {hasError('password') && <p className="text-xs text-red-500 mt-1 ml-1">{getErrorMsg('password')}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <CheckBadgeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••"
                                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition text-sm ${
                                    confirmPassword && form.password !== confirmPassword 
                                    ? "border-red-300 focus:ring-red-200" 
                                    : "border-gray-200 focus:ring-blue-500"
                                }`}
                            />
                        </div>
                        {confirmPassword && form.password !== confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">Mật khẩu không khớp</p>}
                    </div>
                 </div>

                 {/* Date & Gender */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                        <div className="relative">
                            <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange}
                                className={getInputClass("date_of_birth")}
                            />
                        </div>
                        {hasError('date_of_birth') && <p className="text-xs text-red-500 mt-1 ml-1">{getErrorMsg('date_of_birth')}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                        <select 
                            name="gender" value={form.gender} onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-sm text-gray-600"
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                 </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
             <button onClick={handleClose} className="px-5 py-2.5 rounded-xl text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-100 transition text-sm">Hủy bỏ</button>
             <button type="submit" form="staffForm" disabled={loading} className={`px-5 py-2.5 rounded-xl text-white font-medium shadow-lg transition text-sm flex items-center gap-2 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {loading ? "Đang xử lý..." : "Tạo nhân viên"}
             </button>
        </div>
      </div>
    </div>
  );
};

export default StaffFormModal;
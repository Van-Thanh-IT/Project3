import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import sellerService from "../../services/sellerService";
import axios from "axios";
import { 
  Store, MapPin, Phone, FileText, UploadCloud, 
  CheckCircle2, Building2, Map as MapIcon 
} from "lucide-react";

const Registeration = () => {
  const [formData, setFormData] = useState({
    vat_number: "",
    business_doc: null,
    phone: "",
    reason: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(""); // Để hiển thị tên file đã chọn

  // Địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  // Load tỉnh
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleProvinceChange = async (e) => {
    const code = e.target.value;
    setProvince(code);
    setDistrict("");
    setWard("");
    const res = await axios.get(
      `https://provinces.open-api.vn/api/p/${code}?depth=2`
    );
    setDistricts(res.data.districts);
    setWards([]);
  };

  const handleDistrictChange = async (e) => {
    const code = e.target.value;
    setDistrict(code);
    setWard("");
    const res = await axios.get(
      `https://provinces.open-api.vn/api/d/${code}?depth=2`
    );
    setWards(res.data.wards);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, business_doc: file });
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedProvinceName = provinces.find((p) => p.code == province)?.name || "";
    const selectedDistrictName = districts.find((d) => d.code == district)?.name || "";
    const selectedWardName = wards.find((w) => w.code == ward)?.name || "";
    
    // Validation cơ bản
    if (!province || !district || !ward || !detailAddress) {
        toast.error("Vui lòng điền đầy đủ địa chỉ!");
        setLoading(false);
        return;
    }

    const fullAddress = `${detailAddress} - ${selectedWardName} - ${selectedDistrictName} - ${selectedProvinceName}`;

    try {
      const data = new FormData();
      data.append("vat_number", formData.vat_number);
      data.append("phone", formData.phone);
      data.append("reason", formData.reason);
      data.append("address", fullAddress);
      if (formData.business_doc) {
        data.append("business_doc", formData.business_doc);
      }

      const res = await sellerService.registerSeller(data);

      if (res.data.status === "success") {
        toast.success("Đăng ký thành công! Vui lòng chờ duyệt.");
        setFormData({
          vat_number: "",
          business_doc: null,
          phone: "",
          reason: "",
        });
        setFileName("");
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gửi yêu cầu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT SIDE: Banner & Info */}
        <div className="lg:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <Store className="w-10 h-10" />
              <span className="text-2xl font-bold tracking-wide">Seller Center</span>
            </div>
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Bắt đầu hành trình kinh doanh của bạn
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Gia nhập cộng đồng hàng ngàn nhà bán hàng thành công. Tiếp cận triệu khách hàng tiềm năng ngay hôm nay.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full"><CheckCircle2 className="w-5 h-5" /></div>
                <span>Miễn phí đăng ký gian hàng</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full"><CheckCircle2 className="w-5 h-5" /></div>
                <span>Hỗ trợ vận hành 24/7</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full"><CheckCircle2 className="w-5 h-5" /></div>
                <span>Công cụ Marketing mạnh mẽ</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 mt-12 text-sm text-blue-200">
            © 2024 E-Commerce Platform. All rights reserved.
          </div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="lg:w-7/12 p-8 lg:p-12 bg-white overflow-y-auto max-h-[90vh]">
          <div className="max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký nhà bán hàng</h3>
            <p className="text-gray-500 mb-8">Vui lòng điền đầy đủ thông tin doanh nghiệp của bạn.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section: Thông tin cơ bản */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Thông tin pháp lý
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Mã số thuế (VAT)</label>
                    <input
                      type="text"
                      name="vat_number"
                      value={formData.vat_number}
                      onChange={handleChange}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                      placeholder="Ví dụ: 0101234567"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                        placeholder="0987..."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload Custom */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Giấy phép kinh doanh</label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-blue-50 hover:border-blue-400 transition-all group cursor-pointer text-center">
                    <input
                      type="file"
                      name="business_doc"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.jpg,.png,.jpeg"
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-600">
                      <UploadCloud className="w-10 h-10 mb-2" />
                      {fileName ? (
                        <span className="text-sm font-semibold text-green-600 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4"/> {fileName}
                        </span>
                      ) : (
                        <>
                          <span className="text-sm font-medium">Kéo thả hoặc click để tải lên</span>
                          <span className="text-xs text-gray-400 mt-1">Hỗ trợ: PDF, JPG, PNG (Max 5MB)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Section: Địa chỉ */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Địa chỉ kho hàng
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <select
                      value={province}
                      onChange={handleProvinceChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-gray-700"
                      required
                    >
                      <option value="">Tỉnh/Thành</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </select>
                    <MapIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={district}
                      onChange={handleDistrictChange}
                      disabled={!province}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                      required
                    >
                      <option value="">Quận/Huyện</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.code}>{d.name}</option>
                      ))}
                    </select>
                    <MapIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      disabled={!district}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                      required
                    >
                      <option value="">Xã/Phường</option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.code}>{w.name}</option>
                      ))}
                    </select>
                    <MapIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường cụ thể..."
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Section: Lý do */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4" /> Giới thiệu
                </h4>
                <textarea
                  name="reason"
                  placeholder="Mô tả ngắn về doanh nghiệp và lý do bạn muốn hợp tác..."
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2
                  ${loading 
                    ? "bg-gray-400 cursor-not-allowed text-gray-200" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>Gửi hồ sơ đăng ký <CheckCircle2 className="w-5 h-5" /></>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registeration;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Registration = () => {
  const [formData, setFormData] = useState({
    vat_number: "",
    business_doc: "",
    phone: "",
    reason: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // ============================
  // ĐỊA CHỈ TỈNH → HUYỆN → XÃ
  // ============================
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [detailAddress, setDetailAddress] = useState("");

  // Load danh sách tỉnh
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Khi chọn tỉnh
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

  // Khi chọn huyện
  const handleDistrictChange = async (e) => {
    const code = e.target.value;
    setDistrict(code);
    setWard("");

    const res = await axios.get(
      `https://provinces.open-api.vn/api/d/${code}?depth=2`
    );

    setWards(res.data.wards);
  };

  // Xử lý input text thường
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================
  // GỬI FORM
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Lấy tên tỉnh/huyện/xã
    const selectedProvinceName =
      provinces.find((p) => p.code == province)?.name || "";
    const selectedDistrictName =
      districts.find((d) => d.code == district)?.name || "";
    const selectedWardName = wards.find((w) => w.code == ward)?.name || "";

    // Ghép full address
    const fullAddress = `${detailAddress} - ${selectedWardName} - ${selectedDistrictName} - ${selectedProvinceName}`;

    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/register`,
        {
          ...formData,
          address: fullAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.message);

        // Reset form
        setFormData({
          vat_number: "",
          business_doc: "",
          phone: "",
          reason: "",
        });

        setDetailAddress("");
        setProvince("");
        setDistrict("");
        setWard("");
        setDistricts([]);
        setWards([]);
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Gửi yêu cầu bán hàng thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // RENDER UI
  // ============================
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Đăng ký trở thành người bán
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="vat_number"
          placeholder="Mã số thuế (VAT)"
          value={formData.vat_number}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          name="business_doc"
          placeholder="Giấy phép kinh doanh / tài liệu liên quan"
          value={formData.business_doc}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại liên hệ"
          value={formData.phone}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg"
        />

        {/* ==============================
            ĐỊA CHỈ 4 PHẦN
        =============================== */}
        <h2 className="text-lg font-semibold mt-2">Địa chỉ kinh doanh</h2>

        <input
          type="text"
          placeholder="Số nhà, tên đường..."
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />

        {/* Tỉnh */}
        <select
          value={province}
          onChange={handleProvinceChange}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">-- Chọn Tỉnh/Thành phố --</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Huyện */}
        <select
          value={district}
          onChange={handleDistrictChange}
          className="px-4 py-2 border rounded-lg"
          disabled={!province}
        >
          <option value="">-- Chọn Quận/Huyện --</option>
          {districts.map((d) => (
            <option key={d.code} value={d.code}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Xã */}
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          className="px-4 py-2 border rounded-lg"
          disabled={!district}
        >
          <option value="">-- Chọn Xã/Phường --</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>

        <textarea
          name="reason"
          placeholder="Lý do muốn trở thành người bán"
          value={formData.reason}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg"
          rows={4}
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
};

export default Registration;

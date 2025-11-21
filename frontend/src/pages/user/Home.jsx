import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Khi chọn tỉnh → load huyện
  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setSelectedWard("");

    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const res = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
    );

    setDistricts(res.data.districts);
    setWards([]);
  };

  // Khi chọn huyện → load xã
  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedWard("");

    if (!districtCode) {
      setWards([]);
      return;
    }

    const res = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );

    setWards(res.data.wards);
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-blue-600 mb-5">
        Chọn địa chỉ Việt Nam (Tỉnh → Huyện → Xã)
      </h1>

      {/* Chọn Tỉnh */}
      <select
        value={selectedProvince}
        onChange={handleProvinceChange}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">-- Chọn Tỉnh/Thành phố --</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Chọn Huyện */}
      <select
        value={selectedDistrict}
        onChange={handleDistrictChange}
        className="border p-2 rounded w-full mb-4"
        disabled={!selectedProvince}
      >
        <option value="">-- Chọn Quận/Huyện --</option>
        {districts.map((d) => (
          <option key={d.code} value={d.code}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Chọn Xã */}
      <select
        value={selectedWard}
        onChange={(e) => setSelectedWard(e.target.value)}
        className="border p-2 rounded w-full mb-4"
        disabled={!selectedDistrict}
      >
        <option value="">-- Chọn Xã/Phường --</option>
        {wards.map((w) => (
          <option key={w.code} value={w.code}>
            {w.name}
          </option>
        ))}
      </select>

      {/* Kết quả */}
      <div className="mt-5 p-3 border rounded bg-gray-100">
        <h2 className="font-bold">📍 Địa chỉ đã chọn:</h2>
        <p><strong>Tỉnh:</strong> {selectedProvince}</p>
        <p><strong>Huyện:</strong> {selectedDistrict}</p>
        <p><strong>Xã:</strong> {selectedWard}</p>
      </div>
    </div>
  );
};

export default Home;

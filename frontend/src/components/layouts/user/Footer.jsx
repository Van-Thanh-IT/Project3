import React from "react";
import { 
  Facebook, Instagram, Youtube, Twitter, 
  MapPin, Phone, Mail, Send, 
  Truck, ShieldCheck, Headphones, CreditCard 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 font-sans">
      
      {/* 1. USP BAR (Cam kết dịch vụ) */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-gray-800 rounded-full text-orange-500">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm uppercase">Vận chuyển miễn phí</h4>
                <p className="text-xs text-gray-400">Cho đơn hàng từ 500k</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-gray-800 rounded-full text-orange-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm uppercase">Bảo hành uy tín</h4>
                <p className="text-xs text-gray-400">Đổi trả trong 30 ngày</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-gray-800 rounded-full text-orange-500">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm uppercase">Hỗ trợ 24/7</h4>
                <p className="text-xs text-gray-400">Hotline: 1900 1234</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-gray-800 rounded-full text-orange-500">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm uppercase">Thanh toán an toàn</h4>
                <p className="text-xs text-gray-400">Bảo mật thông tin 100%</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER INFO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Cột 1: Thông tin công ty */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Về Shop Của Bạn</h3>
            <p className="text-sm leading-6 mb-6">
              Chúng tôi cung cấp các sản phẩm chất lượng cao với giá cả hợp lý. 
              Sứ mệnh của chúng tôi là mang lại trải nghiệm mua sắm tuyệt vời nhất cho khách hàng.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>Tầng 5, Tòa nhà ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>1900 1234 - 0987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>support@yourshop.com</span>
              </li>
            </ul>
          </div>

          {/* Cột 2: Chăm sóc khách hàng */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Chăm sóc khách hàng</h3>
            <ul className="space-y-3 text-sm">
              {['Trung tâm trợ giúp', 'Hướng dẫn mua hàng', 'Chính sách vận chuyển', 'Chính sách đổi trả', 'Chính sách bảo hành', 'Câu hỏi thường gặp'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-orange-500 transition-colors duration-200 block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Về chúng tôi */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Về chúng tôi</h3>
            <ul className="space-y-3 text-sm">
              {['Giới thiệu', 'Tuyển dụng', 'Điều khoản sử dụng', 'Chính sách bảo mật', 'Bán hàng cùng chúng tôi', 'Liên hệ'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-orange-500 transition-colors duration-200 block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin & Mạng xã hội */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Đăng ký nhận tin</h3>
            <p className="text-sm mb-4">Nhận thông tin về các chương trình khuyến mãi sớm nhất.</p>
            
            <form className="flex flex-col gap-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-8">
              <h4 className="text-white font-bold mb-4">Kết nối với chúng tôi</h4>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 hover:text-white transition-all">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM FOOTER (Thanh toán & Bản quyền) */}
      <div className="bg-gray-950 py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="text-xs text-gray-500 text-center md:text-left">
            <p>© 2024 YourShop Name. Tất cả các quyền được bảo lưu.</p>
            <p className="mt-1">Giấy chứng nhận ĐKKD số: 0123456789 do Sở KH & ĐT TP.HCM cấp.</p>
          </div>

          <div className="flex items-center gap-4">
             {/* Giả lập icon thanh toán */}
             <div className="flex gap-2">
                {['Visa', 'MasterCard', 'JCB', 'Momo', 'ZaloPay'].map((pay) => (
                    <div key={pay} className="h-8 w-12 bg-white rounded flex items-center justify-center text-gray-800 text-[10px] font-bold shadow-sm">
                        {pay}
                    </div>
                ))}
             </div>
             {/* Logo bộ công thương (Placeholder) */}
             <div className="h-8 w-20 bg-blue-600/20 border border-blue-600/50 rounded flex items-center justify-center text-blue-500 text-[8px] text-center leading-tight p-1">
                Đã thông báo<br/>BCT
             </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { redirectByRole } from "../../utils/redirectByRole";

// Icons từ Heroicons
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const { login, loginWithGoogle, loginWithFacebook, fetchMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Hàm xử lý input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Hàm chung cho mọi loại login
  const handleLogin = async (loginFn) => {
    setLoading(true);
    try {
      await loginFn();
      const meData = await fetchMe();

      if (!meData.user) {
        toast.error("Không lấy được thông tin tài khoản!");
        return;
      }
      if (meData.user.status !== "active") {
        toast.error("Tài khoản của bạn đã bị khoá hoặc không hoạt động!");
        return;
      }

      if (meData.roles && meData.roles.length > 0) {
        redirectByRole(meData.roles, navigate);
      } else {
        navigate("/");
      }

      toast.success("Đăng nhập thành công!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Submit email/password
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(() => login(formData));
  };

  // Google login
  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) return toast.error("Đăng nhập Google thất bại!");
    handleLogin(() => loginWithGoogle(token));
  };

  // Facebook login
  const handleFacebookSuccess = (response) => {
    const token = response?.accessToken;
    if (!token) return toast.error("Đăng nhập Facebook thất bại!");
    handleLogin(() => loginWithFacebook(token));
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* --- LEFT SIDE: ARTWORK / BRANDING --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Background Pattern/Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-900 opacity-90 z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale mix-blend-multiply"
        />
        
        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col justify-between w-full p-12 text-white h-full">
            <div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/10 shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    Quản trị hệ thống <br/> <span className="text-blue-300">Đẳng cấp & Hiệu quả.</span>
                </h1>
                <p className="mt-6 text-lg text-slate-300 max-w-md leading-relaxed">
                    Nền tảng quản lý toàn diện giúp bạn kiểm soát mọi hoạt động kinh doanh, nhân sự và bán hàng chỉ trong một cú nhấp chuột.
                </p>
            </div>
            
            {/* Testimonial / Footer */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                <p className="italic text-slate-200">"Giao diện tuyệt vời nhất mà tôi từng sử dụng. Nhanh, mượt mà và cực kỳ chuyên nghiệp."</p>
                <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                    <div>
                        <p className="font-semibold text-sm">Trần CEO</p>
                        <p className="text-xs text-slate-400">Founder TechCorp</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-8">
            
            {/* Header Mobile (Logo) */}
            <div className="lg:hidden text-center mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-lg">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>

            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Chào mừng trở lại!</h2>
                <p className="mt-2 text-sm text-slate-500">Vui lòng nhập thông tin để truy cập vào Dashboard.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <ArrowRightIcon className="h-5 w-5 text-blue-300 group-hover:text-blue-100 transition-colors" aria-hidden="true" />
                            </span>
                        )}
                        {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
                    </button>
                </div>
            </form>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500 font-medium">Hoặc tiếp tục với</span>
                </div>
            </div>

            {/* Social Login Grid */}
            <div className="grid grid-cols-1 gap-4">
                <div className="w-full flex justify-center [&_div[role=button]]:w-full [&_iframe]:mx-auto">
                    {/* Google Login Container - Căn giữa */}
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error("Không thể đăng nhập bằng Google!")}
                        width="100%"
                        theme="outline"
                        shape="rectangular"
                        size="large"
                        text="signin_with"
                    />
                </div>
                
                <FacebookLogin
                    appId="2016734672462629"
                    onSuccess={handleFacebookSuccess}
                    onFail={() => toast.error("Không thể đăng nhập bằng Facebook!")}
                    render={({ onClick }) => (
                        <button onClick={onClick} className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm bg-[#1877F2] hover:bg-[#166fe5] transition-colors text-white font-medium text-sm gap-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            Đăng nhập với Facebook
                        </button>
                    )}
                />
            </div>

            {/* Footer Link */}
            <p className="text-center text-sm text-slate-600">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                    Đăng ký miễn phí
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
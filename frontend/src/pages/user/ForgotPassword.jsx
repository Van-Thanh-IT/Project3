import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [cooldown, setCooldown] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Vui lòng nhập email");
      return;
    }

    if (cooldown) return;

    try {
      setCooldown(true); 
      const res = await forgotPassword(email);
      toast.success(res.message);
      setEmail('');
      setMessage('');
      // Nếu thành công → cooldown 60s
      setTimeout(() => setCooldown(false), 60000);

    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.errors?.email?.[0] ||
        "Gửi email thất bại"
      );
      //tắt cooldown ngay
      setCooldown(false);
    }
  };



  return (
    <div>
      <h1>Quên mật khẩu</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {message && <p className='text-red-600'>{message}</p>}
        <button type="submit" disabled={cooldown}>
          {cooldown ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

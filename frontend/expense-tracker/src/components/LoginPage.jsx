import React, { useEffect, useState } from 'react';
import './css/login_reg.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const remembered = localStorage.getItem('remember') === 'true';
    if (remembered) {
      setUsername(localStorage.getItem('username') || '');
      setRemember(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'password123') {
      alert('Đăng nhập thành công!');

      if (remember) {
        localStorage.setItem('username', username);
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('remember');
      }

      // Redirect
      window.location.href = '/loginXong.html';
    } else {
      alert('Tên người dùng hoặc mật khẩu không đúng!');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const email = prompt('Đóng 5 xị để khôi phục pass?');
    if (email) {
      alert(`Link khôi phục mật khẩu đã được gửi đến ${email}`);
    } else {
      alert('Vui lòng nhập email!');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert('Chuyển đến trang đăng ký!');
    window.location.href = '/register.html';
  };

  return (
    <div className="wrapper">
      <form id="loginForm" onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="input_box">
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <i className="bx bx-user"></i>
        </div>
        <div className="input_box">
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i className="bx bx-lock"></i>
        </div>
        <div className="remember_forgot">
          <label>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember login
          </label>
          <a href="#" id="forgotPassword" onClick={handleForgotPassword}>
            Forgot password?
          </a>
        </div>
        <button type="submit" className="btn">
          Login
        </button>
        <div className="register_link">
          <a href="#" id="registerLink" onClick={handleRegister}>
            Don't have an account? Register
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

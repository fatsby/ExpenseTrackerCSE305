import React, { useState, useEffect } from 'react';
import './css/login_reg.css';

function LoginPage() {
   
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberLogin, setRememberLogin] = useState(false);
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoginFormActive, setIsLoginFormActive] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

  
    useEffect(() => {
       
        if (localStorage.getItem('remember') === 'true') {
            setLoginUsername(localStorage.getItem('username') || '');
            setRememberLogin(true);
        }

      
        const preloaderTimer = setTimeout(() => {
            setIsLoading(false);
        }, 600); 

        return () => {
            clearTimeout(preloaderTimer);
        };
    }, []); 

   const handleLoginSubmit = (event) => {
        event.preventDefault();

        if (!loginUsername || !loginPassword) {
            alert('Please enter both username and password!');
            return;
        }

        if (loginUsername === 'user' && loginPassword === 'password123') {
            alert('Login Success!');
            if (rememberLogin) {
                localStorage.setItem('username', loginUsername);
                localStorage.setItem('remember', 'true');
            } else {
                localStorage.removeItem('username');
                localStorage.removeItem('remember');
            }
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                window.location.href = '/pinentry';
            }, 500);
        } else if (loginUsername === 'admin' && loginPassword === 'password123') {
            alert('Login Success!');
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                window.location.href = '/admin'; // Redirect to admin page
            }, 500);
        } else {
            alert('Invalid Username or Password!');
        }
    };

    const handleRegisterSubmit = (event) => {
        event.preventDefault(); 
        
        if (registerPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        // In a real app, you'd send this data to a backend for registration
        alert(`Register attempt for username: ${registerUsername}. (Registration not implemented)`);
        // Optionally, switch to login form after "registration"
        // setIsLoginFormActive(true);
    };

    const handleForgotPasswordClick = (event) => {
        event.preventDefault(); 
        const email = prompt('Donate 1 Jack to recover your password?');

        if (email) {
            alert(`Recovery link has been sent to ${email}`);
        } else {
            alert('Please enter your email');
        }
    };

    const handleToggleToRegister = () => {
        setIsLoginFormActive(false);
    };

    const handleToggleToLogin = () => {
        setIsLoginFormActive(true);
    };

   
    const handleAnchorClick = (event) => {
        if (event.target.tagName === 'A' && event.target.href) {
            event.preventDefault(); 
            setIsLoading(true); 
            setTimeout(() => {
                window.location.href = event.target.href; 
            }, 500);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleAnchorClick);
        return () => {
            document.removeEventListener('click', handleAnchorClick);
        };
    }, []);

    return (
        <>
            {isLoading && (
                <div id="loading" className={`loading ${isLoading ? '' : 'hidden'}`}>
                    <img src="./src/assets/aroundtheworld.gif" alt="Loading..." className="loading-gif" />
                </div>
            )}

            {/* Main Content Wrapper */}
            <div className="login-vh">
                <div className="wrapper">
                {/* Login Form */}
                <form
                    id="loginForm"
                    className={isLoginFormActive ? 'active' : ''}
                    onSubmit={handleLoginSubmit}
                >
                    <h1>Log in</h1>
                    <div className="input_box">
                        <input
                            type="text"
                            placeholder="Username"
                            id="login-username"
                            required
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                        />
                        <i className='bx bx-user'></i>
                    </div>
                    <div className="input_box">
                        <input
                            type="password"
                            placeholder="Password"
                            id="login-password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <i className='bx bx-lock'></i>
                    </div>
                    <div className="remember_forgot">
                        <label>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberLogin}
                                onChange={(e) => setRememberLogin(e.target.checked)}
                            /> Remember login
                        </label>
                        <a href="#" id="forgotPassword" onClick={handleForgotPasswordClick}>Forgot password?</a>
                    </div>
                    <button type="submit" className="btn">Log in</button>
                    <div className="register_link">
                        <span className="toggle-link" onClick={handleToggleToRegister}>Don't have an account? Register</span>
                    </div>
                </form>

                {/* Register Form */}
                <form
                    id="register-form"
                    className={!isLoginFormActive ? 'active' : ''}
                    onSubmit={handleRegisterSubmit}
                >
                    <h1>Register</h1>
                    <div className="input_box">
                        <input
                            type="text"
                            placeholder="Username"
                            id="register-username"
                            required
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                        />
                        <i className='bx bx-user'></i>
                    </div>
                    <div className="input_box">
                        <input
                            type="password"
                            placeholder="Password"
                            id="register-password"
                            required
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                        <i className='bx bx-lock'></i>
                    </div>
                    <div className="input_box">
                        <input
                            type="password"
                            placeholder="Confirm password"
                            id="confirm-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <i className='bx bx-lock'></i>
                    </div>
                    <button type="submit" className="btn">Register</button>
                    <div className="register_link">
                        <span className="toggle-link" onClick={handleToggleToLogin}>Already have an account? Login</span>
                    </div>
                </form>
            </div>
            </div>
            
        </>
    );
}

export default LoginPage;
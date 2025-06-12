import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './css/login_reg.css';
import StorageHelper from '@/utils/StorageHelper';

function LoginPage() {
    const navigate = useNavigate();
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberLogin, setRememberLogin] = useState(false);
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoginFormActive, setIsLoginFormActive] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [userPIN, setUserPIN] = useState('');

    useEffect(() => {
        if (StorageHelper.isAdmin()) {
            navigate('/admin', { replace: true });
        } else if (StorageHelper.isTokenValid()) {
            navigate('/pinentry', { replace: true });
        }

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

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword,
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || 'Login failed');
            };

            const { token, role, expiration } = await response.json();

            const storage = localStorage;
            storage.setItem('token', token);
            storage.setItem('role', role);
            storage.setItem('expiration', expiration);

            if (rememberLogin) {
                localStorage.setItem('username', loginUsername);
                localStorage.setItem('remember', 'true');
            } else {
                localStorage.removeItem('username');
                localStorage.removeItem('remember');
            }

            // redirect based on role
            setIsLoading(false);
            if (role === 'USER') {
                navigate('/pinentry', { replace: true });
            } else if (role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }

        } catch (err) {
            setIsLoading(false);
            alert(err.message);
        }
    };


    const handleRegisterSubmit = async (event) => {
        event.preventDefault();

        if (registerPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerUsername,
                    password: registerPassword,
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || 'Login failed');
            };

            setIsLoading(false);
            alert('Successfully registered, please login now.');
        } catch {
            setIsLoading(false);
            alert(err.message);
        }
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
                                placeholder="Enter PIN (4 Digits)"
                                id="register-pin"
                                required
                                value={userPIN}
                                maxLength={4} 
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(/[^0-9]/g, '');

                                    const limitedValue = numericValue.slice(0, 4);

                                    setUserPIN(limitedValue);
                                }}
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
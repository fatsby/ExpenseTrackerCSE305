import React from 'react';
import './css/navbar.css';

function NavBar({ activeTab, onTabChange, userName }) {
    return (
        <div className="navbar-body">
            <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <i className="fas fa-chart-line"></i>
                    <span className="logo-text"></span>
                </div>
                
                <ul className="nav-links">
                    <li>
                        <a 
                            href="#dashboard" 
                            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => onTabChange('dashboard')}
                        >
                            <i className="fas fa-tachometer-alt"></i>
                            <span className="link-text">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#income" 
                            className={`nav-link ${activeTab === 'income' ? 'active' : ''}`}
                            onClick={() => onTabChange('income')}
                        >
                            <i className="fas fa-dollar-sign"></i>
                            <span className="link-text">Income</span>
                        </a>
                    </li>
                </ul>
                
                <div className="user-section">
                    <span className="user-greeting">Hello, {userName}!</span>
                    <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
                </div>
            </div>
        </nav>
        </div>
    );
}

export default NavBar;
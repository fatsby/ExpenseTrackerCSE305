import React, { useState, useEffect, useRef, useCallback } from 'react';
// Import Lucide icons you are using
import {
    Shield, Users, Settings, Activity, UserMinus, UserPlus, Plus, Trash2,
    Server, Database, Bell, Mail, Save, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

// Import your existing CSS file
import './css/admindashboard.css';
import StorageHelper from '@/utils/StorageHelper';
// --- Custom Notification Component ---
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    let iconComponent;
    switch (type) {
        case 'success':
            iconComponent = <CheckCircle size={18} />;
            break;
        case 'error':
            iconComponent = <XCircle size={18} />;
            break;
        case 'warning':
            iconComponent = <AlertCircle size={18} />;
            break;
        default:
            iconComponent = <AlertCircle size={18} />;
    }

    return (
        <div className={`notification ${type} show`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {iconComponent}
                {message}
            </div>
            {/* You could add a close button here if desired */}
        </div>
    );
};

// --- Custom Confirmation Modal Component ---
const ConfirmModal = ({ message, onConfirm, onCancel, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="adm-btn btn-danger" onClick={onConfirm}>Confirm</button>
                    <button className="adm-btn btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

function AdminDashboard() {
    // --- State Management ---
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joinDate: '2024-01-15' },
        { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'Active', joinDate: '2024-02-10' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Active', joinDate: '2024-01-20' },
        { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'User', status: 'Inactive', joinDate: '2024-03-05' }
    ]);
    const nextUserId = useRef(5); // Use useRef for mutable ID counter

    const [systemConfig, setSystemConfig] = useState({
        maxUsers: 1000,
        dataRetention: 365,
        backupFrequency: 'daily',
        maintenance: false,
        notifications: true,
        autoBackup: true,
        emailNotifications: false
    });

    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'config'

    // Add User Form States
    const [addUserName, setAddUserName] = useState('');
    const [addUserEmail, setAddUserEmail] = useState('');
    const [addUserRole, setAddUserRole] = useState('');
    const [isAddUserLoading, setIsAddUserLoading] = useState(false);

    // Config Form States
    const [configMaxUsers, setConfigMaxUsers] = useState(systemConfig.maxUsers);
    const [configDataRetention, setConfigDataRetention] = useState(systemConfig.dataRetention);
    const [configBackupFrequency, setConfigBackupFrequency] = useState(systemConfig.backupFrequency);
    const [isConfigSaving, setIsConfigSaving] = useState(false);

    // Notification State
    const [notification, setNotification] = useState({ message: '', type: '' });
    const notificationTimeoutRef = useRef(null);

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isVisible: false,
        message: '',
        onConfirm: () => { },
        onCancel: () => { }
    });

    // --- Helper Functions ---

    // Notification system
    const showNotification = useCallback((message, type = 'success') => {
        // Clear any existing timeout
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }
        setNotification({ message, type });
        notificationTimeoutRef.current = setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    }, []);

    // Email validation
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Update statistics (derived state, but useful as a function for clarity)
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const inactiveUsers = users.filter(u => u.status === 'Inactive').length;

    // Update system status (simulated)
    const updateSystemStatus = useCallback(() => {
        const status = systemConfig.maintenance ? 'Maintenance' : 'Online';
        // These would typically be updated from an actual backend or system metrics
        const storageUsed = (users.length * 0.6).toFixed(1);
        const now = new Date();
        const lastBackup = new Date(now.getTime() - (Math.floor(Math.random() * 5) + 1) * 60 * 60 * 1000);
        const hoursAgo = Math.floor((now - lastBackup) / (1000 * 60 * 60));

        setSystemConfig(prevConfig => ({
            ...prevConfig,
            systemStatus: status, // Add these as temporary fields if not in initial config
            totalStorage: `${storageUsed} GB`,
            lastBackup: `${hoursAgo} hours ago`
        }));
    }, [systemConfig.maintenance, users.length]);

    // --- useEffect Hooks ---

    // Initialize/Update stats and system status when users or config changes
    useEffect(() => {
        updateSystemStatus();
    }, [users, systemConfig.maintenance, updateSystemStatus]);

    // Auto-refresh system stats every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            updateSystemStatus();
        }, 30000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, [updateSystemStatus]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '1') {
                e.preventDefault();
                setActiveTab('users');
            }
            if ((e.ctrlKey || e.metaKey) && e.key === '2') {
                e.preventDefault();
                setActiveTab('config');
            }
            if (e.key === 'Escape') {
                document.activeElement.blur();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Smooth scrolling for internal links (if using hash links)
    useEffect(() => {
        const handleAnchorClick = (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };
        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    // Show welcome message on initial load
    // useEffect(() => {
    //     const welcomeTimer = setTimeout(() => {
    //         showNotification('Welcome to the Admin Dashboard!', 'success');
    //     }, 500);
    //     return () => clearTimeout(welcomeTimer);
    // }, [showNotification]);


    // --- Event Handlers ---

    // Tab switching
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    // Add new user form handling
    const handleAddUserSubmit = (e) => {
        e.preventDefault();

        // Clear previous error states (CSS classes)
        // In React, you'd typically manage error states via useState for each input
        // For simplicity, I'm skipping direct DOM manipulation for error classes here,
        // but you'd implement it by adding a state like `isNameInvalid` etc.

        let hasError = false;
        if (!addUserName.trim()) {
            hasError = true;
            // You'd set a state for input error here
        }
        if (!addUserEmail.trim() || !isValidEmail(addUserEmail)) {
            showNotification('Please enter a valid email address', 'error');
            hasError = true;
        }
        if (!addUserRole) {
            hasError = true;
        }

        if (hasError) {
            showNotification('Please fill in all required fields correctly', 'error');
            return;
        }

        if (users.some(user => user.email.toLowerCase() === addUserEmail.toLowerCase())) {
            showNotification('A user with this email already exists', 'error');
            return;
        }

        if (users.length >= systemConfig.maxUsers) {
            showNotification(`Maximum user limit of ${systemConfig.maxUsers} reached`, 'warning');
            return;
        }

        setIsAddUserLoading(true);

        setTimeout(() => {
            const newUser = {
                id: nextUserId.current++,
                name: addUserName,
                email: addUserEmail,
                role: addUserRole,
                status: 'Active',
                joinDate: new Date().toISOString().split('T')[0]
            };

            setUsers(prevUsers => [...prevUsers, newUser]);

            // Clear form
            setAddUserName('');
            setAddUserEmail('');
            setAddUserRole('');

            setIsAddUserLoading(false);
            showNotification(`User ${addUserName} added successfully!`, 'success');
        }, 1000);
    };

    // Remove user
    const handleRemoveUser = (id) => {
        const userToRemove = users.find(u => u.id === id);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        showNotification(`User ${userToRemove.name} removed successfully`, 'success');
    };

    // Toggle user status
    const handleToggleUserStatus = (id) => {
        setUsers(prevUsers =>
            prevUsers.map(user => {
                if (user.id === id) {
                    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
                    const action = newStatus === 'Active' ? 'activated' : 'deactivated';
                    showNotification(`User ${user.name} ${action} successfully`, 'success');
                    return { ...user, status: newStatus };
                }
                return user;
            })
        );
    };

    // Toggle switches functionality
    const handleToggleSwitch = (setting) => {
        setSystemConfig(prevConfig => {
            const newConfig = { ...prevConfig, [setting]: !prevConfig[setting] };
            // If maintenance mode changed, update system status immediately
            if (setting === 'maintenance') {
                // This will trigger the useEffect for updateSystemStatus
            }
            return newConfig;
        });
    };

    // Configuration form handling
    const handleConfigSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (configMaxUsers < 1 || configMaxUsers > 10000) {
            showNotification('Maximum users must be between 1 and 10,000', 'error');
            return;
        }
        if (configDataRetention < 30 || configDataRetention > 3650) {
            showNotification('Data retention must be between 30 and 3,650 days', 'error');
            return;
        }

        setIsConfigSaving(true);

        setTimeout(() => {
            setSystemConfig(prevConfig => ({
                ...prevConfig,
                maxUsers: configMaxUsers,
                dataRetention: configDataRetention,
                backupFrequency: configBackupFrequency,
                // Toggles are already updated via handleToggleSwitch
            }));
            setIsConfigSaving(false);
            showNotification('Configuration saved successfully!', 'success');
            console.log('System Configuration:', systemConfig);
        }, 1500);
    };

    return (
        <>
            <div className="admindashboard-body">
                {/* Notification Component */}
                <Notification message={notification.message} type={notification.type} />

                {/* Confirmation Modal */}
                <ConfirmModal
                    isVisible={confirmModal.isVisible}
                    message={confirmModal.message}
                    onConfirm={confirmModal.onConfirm}
                    onCancel={confirmModal.onCancel}
                />

                {/* Header */}
                <div className="header">
                    <div className="header-content">
                        <div className="header-left">
                            <div className="logo">
                                <Shield size={24} /> {/* Lucide Icon */}
                            </div>
                            <div className="header-title">
                                <h1>Admin Dashboard</h1>
                                <p>Expense Tracker Management</p>
                            </div>
                        </div>
                        <div className="header-right">
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Hello, Admin!</span>
                            <div className="user-avatar">A</div>
                            <div className="logout-btn">
                                <button type="submit" className="admin-logout" onClick={() => { window.location.href = 'homepage'; StorageHelper.clearStorage();}}>Log out</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Container */}
                <div className="container">
                    {/* Navigation Tabs */}
                    <div className="nav-tabs">
                        <button
                            className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => handleTabClick('users')}
                            data-tab="users"
                        >
                            <Users size={18} /> {/* Lucide Icon */}
                            User Management
                        </button>
                        <button
                            className={`nav-tab ${activeTab === 'config' ? 'active' : ''}`}
                            onClick={() => handleTabClick('config')}
                            data-tab="config"
                        >
                            <Settings size={18} /> {/* Lucide Icon */}
                            System Config
                        </button>
                    </div>

                    {/* User Management Tab */}
                    <div id="users-tab" className={`tab-content ${activeTab !== 'users' ? 'hidden' : ''}`}>
                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card blue">
                                <div className="stat-info">
                                    <h3>Total Users</h3>
                                    <p id="total-users">{totalUsers}</p>
                                </div>
                                <Users size={24} /> {/* Lucide Icon */}
                            </div>
                            <div className="stat-card green">
                                <div className="stat-info">
                                    <h3>Active Users</h3>
                                    <p id="active-users">{activeUsers}</p>
                                </div>
                                <Activity size={24} /> {/* Lucide Icon */}
                            </div>
                            <div className="stat-card red">
                                <div className="stat-info">
                                    <h3>Inactive Users</h3>
                                    <p id="inactive-users">{inactiveUsers}</p>
                                </div>
                                <UserMinus size={24} /> {/* Lucide Icon */}
                            </div>
                        </div>

                        {/* Add User Form */}
                        <div className="card">
                            <div className="card-header">
                                <UserPlus size={18} style={{ color: '#3b82f6' }} /> {/* Lucide Icon */}
                                <h3 className="card-title">Add New User</h3>
                            </div>
                            <form id="add-user-form" onSubmit={handleAddUserSubmit}>
                                <div className="form-grid">
                                    <input
                                        type="text"
                                        id="user-name"
                                        className="form-input"
                                        placeholder="Full Name"
                                        required
                                        value={addUserName}
                                        onChange={(e) => setAddUserName(e.target.value)}
                                    />
                                    <input
                                        type="email"
                                        id="user-email"
                                        className="form-input"
                                        placeholder="Email Address"
                                        required
                                        value={addUserEmail}
                                        onChange={(e) => setAddUserEmail(e.target.value)}
                                    />
                                    <select
                                        id="user-role"
                                        className="form-select"
                                        required
                                        value={addUserRole}
                                        onChange={(e) => setAddUserRole(e.target.value)}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                    <button type="submit" className={`adm-btn btn-primary ${isAddUserLoading ? 'loading' : ''}`} disabled={isAddUserLoading}>
                                        {isAddUserLoading ? 'Adding...' : <><Plus size={18} /> Add User</>}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Users Table */}
                        <div className="card">
                            <div className="card-header">
                                <Users size={18} style={{ color: '#3b82f6' }} /> {/* Lucide Icon */}
                                <h3 className="card-title">User Management</h3>
                            </div>
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Join Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="users-table-body">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center" style={{ padding: '48px', color: '#6b7280' }}>
                                                    <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                                    <p>No users found. Add your first user to get started!</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map(user => (
                                                <tr key={user.id}>
                                                    <td style={{ fontWeight: 500, color: '#000000' }}>{user.name}</td>
                                                    <td style={{ color: '#6b7280' }}>{user.email}</td>
                                                    <td>
                                                        <span className={`badge ${user.role === 'User' ? 'badge-yellow' : user.role === 'Admin' ? 'badge-purple' : 'badge-blue'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${user.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ color: '#6b7280' }}>{user.joinDate}</td>
                                                    <td>
                                                        <button
                                                            className={`adm-btn btn-small ${user.status === 'Active' ? 'btn-warning' : 'btn-success-small'}`}
                                                            onClick={() => handleToggleUserStatus(user.id)}
                                                            title={user.status === 'Active' ? 'Deactivate user' : 'Activate user'}
                                                        >
                                                            {user.status === 'Active' ? <UserMinus size={18} /> : <UserPlus size={18} />}
                                                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button
                                                            className="adm-btn btn-small btn-danger"
                                                            onClick={() => handleRemoveUser(user.id)}
                                                            style={{ marginLeft: '8px' }}
                                                            title="Remove user"
                                                        >
                                                            <Trash2 size={18} />
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* System Configuration Tab */}
                    <div id="config-tab" className={`tab-content ${activeTab !== 'config' ? 'hidden' : ''}`}>
                        {/* System Stats */}
                        <div className="stats-grid">
                            <div className="stat-card green">
                                <div className="stat-info">
                                    <h3>System Status</h3>
                                    <p id="system-status">{systemConfig.systemStatus}</p>
                                </div>
                                <Server size={24} /> {/* Lucide Icon */}
                            </div>
                            <div className="stat-card cyan">
                                <div className="stat-info">
                                    <h3>Total Storage</h3>
                                    <p id="total-storage">{systemConfig.totalStorage}</p>
                                </div>
                                <Database size={24} /> {/* Lucide Icon */}
                            </div>
                            <div className="stat-card purple">
                                <div className="stat-info">
                                    <h3>Last Backup</h3>
                                    <p id="last-backup">{systemConfig.lastBackup}</p>
                                </div>
                                <Shield size={24} /> {/* Lucide Icon */}
                            </div>
                        </div>

                        {/* Configuration Settings */}
                        <div className="card">
                            <div className="card-header">
                                <Settings size={18} style={{ color: '#3b82f6' }} /> {/* Lucide Icon */}
                                <h3 className="card-title">System Configuration</h3>
                            </div>

                            <form id="config-form" onSubmit={handleConfigSubmit}>
                                <div className="config-grid">
                                    <div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="max-users">Maximum Users</label>
                                            <input
                                                type="number"
                                                id="max-users"
                                                className="form-input"
                                                value={configMaxUsers}
                                                onChange={(e) => setConfigMaxUsers(parseInt(e.target.value) || 0)}
                                                min="1"
                                                max="10000"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" htmlFor="data-retention">Data Retention (days)</label>
                                            <input
                                                type="number"
                                                id="data-retention"
                                                className="form-input"
                                                value={configDataRetention}
                                                onChange={(e) => setConfigDataRetention(parseInt(e.target.value) || 0)}
                                                min="30"
                                                max="3650"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" htmlFor="backup-frequency">Backup Frequency</label>
                                            <select
                                                id="backup-frequency"
                                                className="form-select"
                                                value={configBackupFrequency}
                                                onChange={(e) => setConfigBackupFrequency(e.target.value)}
                                            >
                                                <option value="hourly">Hourly</option>
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="form-group">
                                            <label className="form-label">System Settings</label>

                                            <div className="toggle-item">
                                                <div className="toggle-label">
                                                    <Settings size={18} /> {/* Lucide Icon */}
                                                    Maintenance Mode
                                                </div>
                                                <div
                                                    className={`toggle-switch ${systemConfig.maintenance ? 'active' : ''}`}
                                                    data-setting="maintenance"
                                                    onClick={() => handleToggleSwitch('maintenance')}
                                                >
                                                    <div className="toggle-handle"></div>
                                                </div>
                                            </div>

                                            <div className="toggle-item">
                                                <div className="toggle-label">
                                                    <Bell size={18} /> {/* Lucide Icon */}
                                                    Push Notifications
                                                </div>
                                                <div
                                                    className={`toggle-switch ${systemConfig.notifications ? 'active' : ''}`}
                                                    data-setting="notifications"
                                                    onClick={() => handleToggleSwitch('notifications')}
                                                >
                                                    <div className="toggle-handle"></div>
                                                </div>
                                            </div>

                                            <div className="toggle-item">
                                                <div className="toggle-label">
                                                    <Database size={18} /> {/* Lucide Icon */}
                                                    Auto Backup
                                                </div>
                                                <div
                                                    className={`toggle-switch ${systemConfig.autoBackup ? 'active' : ''}`}
                                                    data-setting="autoBackup"
                                                    onClick={() => handleToggleSwitch('autoBackup')}
                                                >
                                                    <div className="toggle-handle"></div>
                                                </div>
                                            </div>

                                            <div className="toggle-item">
                                                <div className="toggle-label">
                                                    <Mail size={18} /> {/* Lucide Icon */}
                                                    Email Notifications
                                                </div>
                                                <div
                                                    className={`toggle-switch ${systemConfig.emailNotifications ? 'active' : ''}`}
                                                    data-setting="emailNotifications"
                                                    onClick={() => handleToggleSwitch('emailNotifications')}
                                                >
                                                    <div className="toggle-handle"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-end">
                                    <button type="submit" className={`adm-btn btn-success ${isConfigSaving ? 'loading' : ''}`} disabled={isConfigSaving}>
                                        {isConfigSaving ? 'Saving...' : <><Save size={18} /> Save Configuration</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;
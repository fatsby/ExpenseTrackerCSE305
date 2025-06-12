import React from 'react';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const expiration = localStorage.getItem('expiration');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (expiration && new Date(expiration) < new Date()) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('expiration');
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/homepage" replace />; 
    }

    return children;
};

export default ProtectedRoute;

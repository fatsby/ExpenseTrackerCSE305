import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, requiresPinVerification = false }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const expiration = localStorage.getItem('expiration');
    const pinVerified = sessionStorage.getItem('pinVerified'); // Add PIN verification check

    // Check if token exists
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check if token is expired
    if (expiration && new Date(expiration) < new Date()) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('expiration');
        sessionStorage.removeItem('pinVerified'); // Clear PIN verification on token expiry
        return <Navigate to="/login" replace />;
    }

    // Check role requirements
    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/homepage" replace />; 
    }

    // Check PIN verification requirement
    if (requiresPinVerification && pinVerified !== 'true') {
        return <Navigate to="/pinentry" replace />;
    }

    return children;
};

export default ProtectedRoute;

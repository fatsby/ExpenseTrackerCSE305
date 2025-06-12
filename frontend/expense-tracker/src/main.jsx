import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HomePage from './components/HomePage';
import PinEntry from './components/PinEntry';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import FullDashBoard from './components/FullDashBoard';
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from './utils/ProtectedRoute.jsx';

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/homepage", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/pinentry",
    element: (
      <ProtectedRoute> {/* Only requires authentication, not PIN */}
        <PinEntry />
      </ProtectedRoute>
    )
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiresPinVerification={true}> {/* Requires PIN verification */}
        <FullDashBoard />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="ADMIN"> {/* Requires both ADMIN role and PIN */}
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

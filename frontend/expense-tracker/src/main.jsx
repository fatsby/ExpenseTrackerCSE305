import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HomePage from './components/HomePage';
import PinEntry from './components/PinEntry';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import FullDashBoard from './components/FullDashBoard';
import {createBrowserRouter, RouterProvider} from "react-router";

const router = createBrowserRouter([
  {path:"/", element: <App/>},
  {path:"/homepage", element: <HomePage/>},
  {path:"/login", element:<LoginPage/>},
  {path: "/admin", element:<AdminDashboard/>},
  {path:"/pinentry", element:<PinEntry/>},
  {path:"/dashboard", element:<FullDashBoard/>},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>
)

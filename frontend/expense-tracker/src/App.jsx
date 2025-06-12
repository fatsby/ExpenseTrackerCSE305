import React from 'react';
import HomePage from './components/HomePage';
import AdminDashboard from './components/AdminDashboard';
import PinEntry from './components/PinEntry';
import StorageHelper from './utils/StorageHelper';

function App() {
  
  
  if (StorageHelper.isAdmin()) {
    return <AdminDashboard />;
  } else if (StorageHelper.isTokenValid()) {
    return <PinEntry />;
  }
  return <HomePage />;
}

export default App;
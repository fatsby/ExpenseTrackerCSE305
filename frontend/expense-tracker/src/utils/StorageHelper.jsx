const StorageHelper = {
  isTokenValid: () => {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const now = new Date();

    if (!token) {
      return false;
    }

    if (expiration && new Date(expiration) < now) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('expiration');
      return false;
    }

    return true;
  },

  isAdmin: () => {
    if (!StorageHelper.isTokenValid()) {
      return false;
    }
    return localStorage.getItem('role') === 'ADMIN';
  },

  clearStorage: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('expiration');
    sessionStorage.removeItem('pinVerified');
  },
};

export default StorageHelper;

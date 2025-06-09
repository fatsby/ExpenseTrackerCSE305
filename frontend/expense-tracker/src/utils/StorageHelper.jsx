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

    return true;   // explicit success
  },

  isAdmin: () => {
    if (!StorageHelper.isTokenValid()) {
      return false;
    }
    return localStorage.getItem('role') === 'ADMIN';
  },
};

export default StorageHelper;

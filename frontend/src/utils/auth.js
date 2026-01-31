// Authentication utility functions

export const authUtils = {
  // Store user data in localStorage
  setUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  // Get user data from localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const user = this.getUser();
    return user !== null;
  },

  // Clear user data (logout)
  logout() {
    localStorage.removeItem('user');
    // You might also want to clear other auth-related data
    console.log('User logged out');
  },

  // Get user ID
  getUserId() {
    const user = this.getUser();
    return user?.id || user?._id;
  },

  // Get user email
  getUserEmail() {
    const user = this.getUser();
    return user?.email;
  },

  // Get user name
  getUserName() {
    const user = this.getUser();
    return user?.username || user?.fullName;
  }
};

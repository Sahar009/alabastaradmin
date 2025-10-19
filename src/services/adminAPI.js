// Admin API Service
const API_BASE_URL = 'http://localhost:8000/api/admin';

class AdminAPI {
  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('adminToken');
  }

  // Get admin info from localStorage
  getAdminInfo() {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo ? JSON.parse(adminInfo) : null;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // User management methods
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async updateUserStatus(userId, status) {
    return this.request(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Provider management methods
  async getProviders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/providers${queryString ? `?${queryString}` : ''}`);
  }

  async verifyProvider(providerId, isVerified) {
    return this.request(`/providers/${providerId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ isVerified }),
    });
  }

  // Booking management methods
  async getBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/bookings${queryString ? `?${queryString}` : ''}`);
  }

  async updateBookingStatus(bookingId, status) {
    return this.request(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Review management methods
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews${queryString ? `?${queryString}` : ''}`);
  }

  async updateReviewStatus(reviewId, status) {
    return this.request(`/reviews/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Notification methods
  async sendNotification(notificationData) {
    return this.request('/notifications/send', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // Admin management methods (Super Admin only)
  async createAdmin(adminData) {
    return this.request('/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  // ==================== USER MANAGEMENT ====================
  
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async updateUserStatus(userId, status) {
    return this.request(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== PROVIDER MANAGEMENT ====================
  
  async getProviders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/providers${queryString ? `?${queryString}` : ''}`);
  }

  async getProviderById(providerId) {
    return this.request(`/providers/${providerId}`);
  }

  async updateProviderVerification(providerId, isVerified) {
    return this.request(`/providers/${providerId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ isVerified }),
    });
  }

  async updateProviderStatus(providerId, status) {
    return this.request(`/providers/${providerId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== BOOKINGS MANAGEMENT ====================

  async getBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/bookings${queryString ? `?${queryString}` : ''}`);
  }

  async getBookingById(bookingId) {
    return this.request(`/bookings/${bookingId}`);
  }

  async updateBookingStatus(bookingId, status) {
    return this.request(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updateBookingPaymentStatus(bookingId, paymentStatus) {
    return this.request(`/bookings/${bookingId}/payment-status`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus }),
    });
  }

  // Logout method
  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
}

// Create and export a singleton instance
const adminAPI = new AdminAPI();
export default adminAPI;

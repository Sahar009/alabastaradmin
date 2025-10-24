// Admin API Service
const API_BASE_URL = 'http://localhost:8000/api/admin';
// const API_BASE_URL = 'https://alabastar-backend.onrender.com/api/admin';

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

  // Admin-specific profile methods (aliases for consistency)
  async getAdminProfile() {
    return this.getProfile();
  }

  async updateAdminProfile(profileData) {
    return this.updateProfile(profileData);
  }

  async changeAdminPassword(passwordData) {
    return this.changePassword(passwordData.currentPassword, passwordData.newPassword);
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

  async updateReviewVisibility(reviewId, isVisible) {
    return this.request(`/reviews/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isVisible }),
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Notification methods
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications${queryString ? `?${queryString}` : ''}`);
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

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

  // ==================== SERVICE CATEGORIES MANAGEMENT ====================

  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/categories${queryString ? `?${queryString}` : ''}`);
  }

  async getCategoryById(categoryId) {
    return this.request(`/categories/${categoryId}`);
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(categoryId, categoryData) {
    return this.request(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(categoryId) {
    return this.request(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // ==================== SERVICES MANAGEMENT ====================

  async getServices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/services${queryString ? `?${queryString}` : ''}`);
  }

  async getServiceById(serviceId) {
    return this.request(`/services/${serviceId}`);
  }

  async updateServiceStatus(serviceId, isActive) {
    return this.request(`/services/${serviceId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  // ==================== SUBSCRIPTION PLANS MANAGEMENT ====================

  async getSubscriptionPlans(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/subscription-plans${queryString ? `?${queryString}` : ''}`);
  }

  async getSubscriptionPlanById(planId) {
    return this.request(`/subscription-plans/${planId}`);
  }

  async createSubscriptionPlan(planData) {
    return this.request('/subscription-plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async updateSubscriptionPlan(planId, planData) {
    return this.request(`/subscription-plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  }

  async deleteSubscriptionPlan(planId) {
    return this.request(`/subscription-plans/${planId}`, {
      method: 'DELETE',
    });
  }

  // ==================== PROVIDER SUBSCRIPTIONS MANAGEMENT ====================

  async getSubscriptions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/subscriptions${queryString ? `?${queryString}` : ''}`);
  }

  async getSubscriptionById(subscriptionId) {
    return this.request(`/subscriptions/${subscriptionId}`);
  }

  async updateSubscriptionStatus(subscriptionId, status) {
    return this.request(`/subscriptions/${subscriptionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updateSubscriptionAutoRenew(subscriptionId, autoRenew) {
    return this.request(`/subscriptions/${subscriptionId}/auto-renew`, {
      method: 'PUT',
      body: JSON.stringify({ autoRenew }),
    });
  }

  // ==================== SUBSCRIPTION PLAN STATUS TOGGLE ====================

  async toggleSubscriptionPlanStatus(planId, isActive) {
    return this.request(`/subscription-plans/${planId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
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

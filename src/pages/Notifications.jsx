import { useState, useEffect } from 'react';
import { Bell, Send, Plus, Search, Filter, CheckCircle, XCircle, RefreshCw, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import adminAPI from '../services/adminAPI';
import SendNotificationModal from '../components/SendNotificationModal';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showSendModal, setShowSendModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, filterType]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };

      // Add filter for notification type/category
      if (filterType !== 'all') {
        if (['booking_created', 'booking_confirmed', 'booking_cancelled', 'booking_completed', 'booking_reminder'].includes(filterType)) {
          params.type = filterType;
        } else if (['transaction', 'booking', 'message', 'account', 'marketing', 'system'].includes(filterType)) {
          params.category = filterType;
        }
      }

      const response = await adminAPI.getNotifications(params);
      
      if (response.success && response.data) {
        setNotifications(response.data.notifications);
        setTotalPages(response.data.pagination.totalPages);
        setTotalNotifications(response.data.pagination.totalNotifications);
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notification.body?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleMarkAsRead = async (notificationId) => {
    try {
      await adminAPI.markNotificationAsRead(notificationId);
      
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId ? { ...notification, isRead: true, readAt: new Date() } : notification
      ));
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await adminAPI.deleteNotification(notificationId);
        
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
        setTotalNotifications(prev => prev - 1);
        
        toast.success('Notification deleted successfully');
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error('Failed to delete notification');
      }
    }
  };

  const handleSendNotification = () => {
    setShowSendModal(true);
  };

  const handleNotificationSent = () => {
    fetchNotifications();
  };

  const getTypeBadge = (type, category) => {
    const typeClasses = {
      // Booking types
      booking_created: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      booking_confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      booking_cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      booking_completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      booking_reminder: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      // Payment types
      payment_received: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      payment_failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      // Other types
      review_received: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      message_received: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      account_update: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      promotion: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      system_alert: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    
    const displayType = type || category || 'general';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeClasses[displayType] || typeClasses.general}`}>
        {displayType.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage system notifications ({totalNotifications} total notifications)
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={fetchNotifications}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button onClick={handleSendNotification} className="btn-primary flex items-center space-x-2">
            <Send size={20} />
            <span>Send Notification</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <optgroup label="Booking">
                <option value="booking_created">Booking Created</option>
                <option value="booking_confirmed">Booking Confirmed</option>
                <option value="booking_cancelled">Booking Cancelled</option>
                <option value="booking_completed">Booking Completed</option>
                <option value="booking_reminder">Booking Reminder</option>
              </optgroup>
              <optgroup label="Payment">
                <option value="payment_received">Payment Received</option>
                <option value="payment_failed">Payment Failed</option>
              </optgroup>
              <optgroup label="Other">
                <option value="review_received">Review Received</option>
                <option value="message_received">Message Received</option>
                <option value="account_update">Account Update</option>
                <option value="promotion">Promotion</option>
                <option value="system_alert">System Alert</option>
                <option value="general">General</option>
              </optgroup>
              <optgroup label="Categories">
                <option value="transaction">Transaction</option>
                <option value="booking">Booking</option>
                <option value="message">Message</option>
                <option value="account">Account</option>
                <option value="marketing">Marketing</option>
                <option value="system">System</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-xl border ${
              !notification.isRead 
                ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800' 
                : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Bell size={16} className="text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                    {getTypeBadge(notification.type, notification.category)}
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-2">{notification.body}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                    {notification.User && (
                      <span>
                        To: {notification.User.fullName} ({notification.User.role})
                      </span>
                    )}
                    {notification.priority && notification.priority !== 'normal' && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notification.priority}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle size={14} />
                      <span>Mark Read</span>
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
              <span>
                Showing page {currentPage} of {totalPages} ({totalNotifications} total notifications)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      <SendNotificationModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSent={handleNotificationSent}
      />
    </div>
  );
};

export default Notifications;





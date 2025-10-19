import { useState, useEffect } from 'react';
import { Bell, Send, Plus, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications = [
        { id: 1, title: 'New User Registration', message: 'John Doe has registered as a new user', type: 'user', status: 'unread', date: '2024-01-20' },
        { id: 2, title: 'Provider Verification', message: 'Sarah Johnson has completed provider verification', type: 'provider', status: 'read', date: '2024-01-21' },
        { id: 3, title: 'Payment Received', message: 'Payment of ₦15,000 received from Mike Wilson', type: 'payment', status: 'unread', date: '2024-01-22' },
        { id: 4, title: 'Service Booking', message: 'New booking for House Cleaning service', type: 'booking', status: 'read', date: '2024-01-23' }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleMarkAsRead = async (notificationId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId ? { ...notification, status: 'read' } : notification
      ));
      
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleSendNotification = () => {
    toast.success('Notification sent successfully');
  };

  const getTypeBadge = (type) => {
    const typeClasses = {
      user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      provider: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      payment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      booking: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeClasses[type]}`}>
        {type}
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
          <p className="text-slate-600 dark:text-slate-400">Manage system notifications</p>
        </div>
        <button onClick={handleSendNotification} className="btn-primary flex items-center space-x-2">
          <Send size={20} />
          <span>Send Notification</span>
        </button>
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
              <option value="user">User</option>
              <option value="provider">Provider</option>
              <option value="payment">Payment</option>
              <option value="booking">Booking</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-xl border ${
              notification.status === 'unread' 
                ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800' 
                : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Bell size={16} className="text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                    {getTypeBadge(notification.type)}
                    {notification.status === 'unread' && (
                      <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-2">{notification.message}</p>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(notification.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {notification.status === 'unread' && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle size={14} />
                      <span>Mark Read</span>
                    </button>
                  )}
                  <button className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    <XCircle size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;





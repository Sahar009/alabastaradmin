import { useState } from 'react';
import { X, Send, Users, Target, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import adminAPI from '../services/adminAPI';

const SendNotificationModal = ({ isOpen, onClose, onSent }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetUsers, setTargetUsers] = useState('all');
  const [targetRoles, setTargetRoles] = useState([]);
  const [type, setType] = useState('general');
  const [priority, setPriority] = useState('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notificationTypes = [
    { value: 'general', label: 'General', icon: '📢' },
    { value: 'booking_created', label: 'Booking Created', icon: '📅' },
    { value: 'booking_confirmed', label: 'Booking Confirmed', icon: '✅' },
    { value: 'booking_cancelled', label: 'Booking Cancelled', icon: '❌' },
    { value: 'booking_completed', label: 'Booking Completed', icon: '🎉' },
    { value: 'payment_received', label: 'Payment Received', icon: '💰' },
    { value: 'payment_failed', label: 'Payment Failed', icon: '⚠️' },
    { value: 'review_received', label: 'Review Received', icon: '⭐' },
    { value: 'message_received', label: 'Message Received', icon: '💬' },
    { value: 'account_update', label: 'Account Update', icon: '⚙️' },
    { value: 'promotion', label: 'Promotion', icon: '🎁' },
    { value: 'system_alert', label: 'System Alert', icon: '🚨' }
  ];

  const handleRoleChange = (role) => {
    setTargetRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    if (targetUsers === 'specific_roles' && targetRoles.length === 0) {
      toast.error('Please select at least one role');
      return;
    }

    setIsSubmitting(true);
    try {
      const notificationData = {
        title: title.trim(),
        message: message.trim(),
        type,
        priority,
        targetUsers,
        targetRoles: targetUsers === 'specific_roles' ? targetRoles : []
      };

      const response = await adminAPI.sendNotification(notificationData);

      if (response.success) {
        const sentMessage = response.data.totalUsers 
          ? `Notification sent to ${response.data.sentTo} of ${response.data.totalUsers} users` 
          : `Notification sent to ${response.data.sentTo} users`;
        toast.success(sentMessage);
        // Reset form
        setTitle('');
        setMessage('');
        setTargetUsers('all');
        setTargetRoles([]);
        setType('general');
        setPriority('normal');
        onSent();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error(error.message || 'Failed to send notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
              <Send className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Send Notification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              maxLength={100}
            />
            <p className="mt-1 text-xs text-slate-500">{title.length}/100 characters</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              required
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-slate-500">{message.length}/500 characters</p>
          </div>

          {/* Target Users */}
          <div>
            <div className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Target Audience
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="all"
                  checked={targetUsers === 'all'}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                />
                <Users className="w-5 h-5 text-slate-500" />
                <span className="text-slate-700 dark:text-slate-300">All Users</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="specific_roles"
                  checked={targetUsers === 'specific_roles'}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                />
                <Target className="w-5 h-5 text-slate-500" />
                <span className="text-slate-700 dark:text-slate-300">Specific Roles</span>
              </label>

              {targetUsers === 'specific_roles' && (
                <div className="ml-7 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-2">
                  {['customer', 'provider'].map(role => (
                    <label key={role} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={targetRoles.includes(role)}
                        onChange={() => handleRoleChange(role)}
                        className="w-4 h-4 text-pink-600 focus:ring-pink-500 rounded"
                      />
                      <span className="text-slate-700 dark:text-slate-300 capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Notification Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              {notificationTypes.map(nt => (
                <option key={nt.value} value={nt.value}>
                  {nt.icon} {nt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Priority
            </label>
            <div className="flex gap-3">
              {['normal', 'high', 'urgent'].map(p => (
                <label key={p} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    value={p}
                    checked={priority === p}
                    onChange={(e) => setPriority(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-center font-medium text-slate-700 dark:text-slate-300 peer-checked:border-pink-600 peer-checked:bg-pink-50 dark:peer-checked:bg-pink-900/20 peer-checked:text-pink-600 dark:peer-checked:text-pink-400 transition-all capitalize">
                    {p}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Warning */}
          {targetUsers === 'all' && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                This notification will be sent to all users in the system. Make sure the content is appropriate for everyone.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Notification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationModal;


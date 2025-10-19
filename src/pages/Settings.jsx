import { useState } from 'react';
import { Save, User, Bell, Shield, Globe, Database, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'Alabastar',
    siteDescription: 'Your trusted service provider platform',
    adminEmail: 'admin@alabastar.com',
    supportEmail: 'support@alabastar.com',
    enableNotifications: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    enableReviews: true,
    enableRatings: true,
    commissionRate: 10,
    currency: 'NGN',
    timezone: 'Africa/Lagos'
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'database', label: 'Database', icon: Database }
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Admin Email
          </label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => handleInputChange('adminEmail', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleInputChange('siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Currency
          </label>
          <select
            value={settings.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="NGN">Nigerian Naira (NGN)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Commission Rate (%)
          </label>
          <input
            type="number"
            value={settings.commissionRate}
            onChange={(e) => handleInputChange('commissionRate', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Site Features</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
              className="mr-3 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Allow new user registration</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableReviews}
              onChange={(e) => handleInputChange('enableReviews', e.target.checked)}
              className="mr-3 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Enable customer reviews</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
              className="mr-3 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Maintenance mode</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
              className="mr-3 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Enable push notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableEmailNotifications}
              onChange={(e) => handleInputChange('enableEmailNotifications', e.target.checked)}
              className="mr-3 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Enable email notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableSMSNotifications}
              onChange={(e) => handleInputChange('enableSMSNotifications', e.target.checked)}
              className="mr-3 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Enable SMS notifications</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Security Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.requireEmailVerification}
              onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
              className="mr-3 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Require email verification</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Support Email
          </label>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => handleInputChange('supportEmail', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="Africa/Lagos">Africa/Lagos</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Database Management</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
          These operations are irreversible. Please proceed with caution.
        </p>
        <div className="flex space-x-3">
          <button className="btn-secondary">Backup Database</button>
          <button className="btn-secondary">Export Data</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'email':
        return renderEmailSettings();
      case 'database':
        return renderDatabaseSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your application settings</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
          <Save size={20} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50 dark:bg-pink-900/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;





import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building, MapPin, FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import adminAPI from '../services/adminAPI';

const CreateProviderModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    category: '',
    subcategories: [],
    bio: '',
    locationCity: '',
    locationState: '',
    sendEmail: true,
    completedSteps: {
      step1: true,  // Basic Info
      step2: true,  // Business Details
      step3: true,  // Documents & Verification
      step4: true,  // Services & Pricing
      step5: false  // Payment (optional - can be skipped for cash payments)
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await adminAPI.getCategories();
        if (response.success && response.data) {
          setCategories(response.data.categories || []);
        } else {
          // Fallback to hardcoded categories if API fails
          setCategories([
            { id: 'cleaning', name: 'Cleaning', slug: 'cleaning' },
            { id: 'plumbing', name: 'Plumbing', slug: 'plumbing' },
            { id: 'electrical', name: 'Electrical', slug: 'electrical' },
            { id: 'hvac', name: 'HVAC', slug: 'hvac' },
            { id: 'landscaping', name: 'Landscaping', slug: 'landscaping' },
            { id: 'gardening', name: 'Gardening', slug: 'gardening' },
            { id: 'painting', name: 'Painting', slug: 'painting' },
            { id: 'carpentry', name: 'Carpentry', slug: 'carpentry' },
            { id: 'other', name: 'Other', slug: 'other' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded categories
        setCategories([
          { id: 'cleaning', name: 'Cleaning', slug: 'cleaning' },
          { id: 'plumbing', name: 'Plumbing', slug: 'plumbing' },
          { id: 'electrical', name: 'Electrical', slug: 'electrical' },
          { id: 'hvac', name: 'HVAC', slug: 'hvac' },
          { id: 'landscaping', name: 'Landscaping', slug: 'landscaping' },
          { id: 'gardening', name: 'Gardening', slug: 'gardening' },
          { id: 'painting', name: 'Painting', slug: 'painting' },
          { id: 'carpentry', name: 'Carpentry', slug: 'carpentry' },
          { id: 'other', name: 'Other', slug: 'other' }
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const subcategoryOptions = {
    cleaning: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Post-Construction Cleaning'],
    plumbing: ['Pipe Repair', 'Drain Cleaning', 'Water Heater', 'Bathroom Installation'],
    electrical: ['Light Fixtures', 'Generator', 'Circuit Breaker', 'Outlet Installation', 'Wiring'],
    hvac: ['AC Repair', 'Heating', 'Ventilation', 'Duct Cleaning'],
    landscaping: ['Lawn Care', 'Tree Trimming', 'Garden Design', 'Irrigation'],
    gardening: ['Lawn Care', 'Plant Care', 'Garden Maintenance', 'Landscaping'],
    painting: ['Interior Painting', 'Exterior Painting', 'Wallpaper', 'Touch-ups'],
    carpentry: ['Furniture Repair', 'Cabinet Making', 'Door Installation', 'Custom Work'],
    other: ['General Services', 'Consultation', 'Maintenance']
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'subcategories') {
      const selectedSubcategories = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, subcategories: selectedSubcategories }));
    } else if (name.startsWith('step')) {
      // Handle individual step checkboxes
      const stepName = name;
      
      if (stepName === 'step5' && checked) {
        // If Step 5 (Payment) is checked, automatically complete all steps
        setFormData(prev => ({
          ...prev,
          completedSteps: {
            step1: true,
            step2: true,
            step3: true,
            step4: true,
            step5: true
          }
        }));
      } else {
        // Normal step handling
        setFormData(prev => ({
          ...prev,
          completedSteps: {
            ...prev.completedSteps,
            [stepName]: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Service category is required';
    }

    if (!formData.locationCity.trim()) {
      newErrors.locationCity = 'City is required';
    }

    if (!formData.locationState.trim()) {
      newErrors.locationState = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await adminAPI.createProvider(formData);
      
      if (response.success) {
        toast.success('Provider created successfully!');
        onSuccess();
        handleClose();
      } else {
        throw new Error(response.message || 'Failed to create provider');
      }
    } catch (error) {
      console.error('Error creating provider:', error);
      const errorMessage = error.message || 'Failed to create provider';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      businessName: '',
      category: '',
      subcategories: [],
      bio: '',
      locationCity: '',
      locationState: '',
      sendEmail: true,
      completedSteps: {
        step1: true,  // Basic Info
        step2: true,  // Business Details
        step3: true,  // Documents & Verification
        step4: true,  // Services & Pricing
        step5: false  // Payment (optional - can be skipped for cash payments)
      }
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Create New Provider
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5" />
              Business Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.businessName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter business name"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={categoriesLoading}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } ${categoriesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select service category'}
                  </option>
                  {categories.map(category => (
                    <option key={category.id || category.slug} value={category.slug || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {formData.category && subcategoryOptions[formData.category] && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subcategories
                </label>
                <select
                  name="subcategories"
                  multiple
                  value={formData.subcategories}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size="4"
                >
                  {subcategoryOptions[formData.category].map(subcategory => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Hold Ctrl/Cmd to select multiple subcategories
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter business description"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="locationCity"
                  value={formData.locationCity}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.locationCity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter city"
                />
                {errors.locationCity && (
                  <p className="text-red-500 text-xs mt-1">{errors.locationCity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="locationState"
                  value={formData.locationState}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.locationState ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter state"
                />
                {errors.locationState && (
                  <p className="text-red-500 text-xs mt-1">{errors.locationState}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email Notification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5" />
              Email Notification
            </h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="sendEmail"
                checked={formData.sendEmail}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Send welcome email with login credentials to the provider
              </label>
            </div>
          </div>

          {/* Registration Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Registration Steps Completion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select which registration steps to mark as completed. This prevents the frontend from redirecting providers to complete these steps.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="step1"
                    checked={formData.completedSteps.step1}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Step 1:</span> Basic Information
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="step2"
                    checked={formData.completedSteps.step2}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Step 2:</span> Business Details
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="step3"
                    checked={formData.completedSteps.step3}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Step 3:</span> Documents & Verification
                  </label>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="step4"
                    checked={formData.completedSteps.step4}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Step 4:</span> Services & Pricing
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="step5"
                    checked={formData.completedSteps.step5}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Step 5:</span> Payment Setup
                    <span className="text-xs text-gray-500 ml-1">(Checking this completes all steps)</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Status indicator */}
            {formData.completedSteps.step5 && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>✅ All Steps Completed:</strong> Payment confirmed - Provider has completed full registration and can access dashboard immediately.
                </p>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Tip:</strong> Steps 1-4 are typically completed by default. Checking Step 5 (Payment) will automatically complete all steps, indicating the provider has paid and completed registration.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Create Provider
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProviderModal;

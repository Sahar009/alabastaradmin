import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Save,
  X,
  Grid3X3,
  List,
  Users,
  Crown,
  Star,
  Zap,
  Shield,
  CreditCard,
  Settings,
  RotateCcw,
  Pause,
  Play,
  Info,
  TrendingUp,
  Activity,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ShieldCheck,
  ShieldX,
  Check,
  X as XIcon,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import adminAPI from '../services/adminAPI';

const SubscriptionsPage = () => {
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('plans');
  
  // Plan states
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    price: '',
    interval: 'monthly',
    benefits: [],
    features: {
      maxPhotos: 5,
      maxVideos: 0,
      videoMaxDuration: 0,
      topListingDays: 14,
      rewardsAccess: ['monthly'],
      promotionChannels: ['youtube'],
      promotionEvents: ['special'],
      priority: 1
    },
    isActive: true
  });
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isViewingPlan, setIsViewingPlan] = useState(false);
  const [newBenefit, setNewBenefit] = useState('');

  // Subscription states
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [intervalFilter, setIntervalFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (activeTab === 'plans') {
      fetchPlans();
    } else {
      fetchSubscriptions();
    }
  }, [activeTab, currentPage, itemsPerPage, searchTerm, statusFilter, intervalFilter, sortBy, sortOrder]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        isActive: statusFilter,
        interval: intervalFilter,
        sortBy,
        sortOrder
      };

      const response = await adminAPI.getSubscriptionPlans(params);
      
      if (response.success && response.data) {
        setPlans(response.data.plans);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      } else {
        throw new Error('Failed to fetch subscription plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load subscription plans');
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder
      };

      const response = await adminAPI.getSubscriptions(params);
      
      if (response.success && response.data) {
        setSubscriptions(response.data.subscriptions);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      } else {
        throw new Error('Failed to fetch subscriptions');
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to load subscriptions');
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingPlan) {
        const response = await adminAPI.updateSubscriptionPlan(selectedPlan.id, planFormData);
        if (response.success) {
          toast.success('Subscription plan updated successfully');
          fetchPlans();
        }
      } else {
        const response = await adminAPI.createSubscriptionPlan(planFormData);
        if (response.success) {
          toast.success('Subscription plan created successfully');
          fetchPlans();
        }
      }
      setShowPlanModal(false);
      resetPlanForm();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save subscription plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    setItemToDelete({ id: planId, type: 'plan' });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      if (itemToDelete.type === 'plan') {
        const response = await adminAPI.deleteSubscriptionPlan(itemToDelete.id);
        if (response.success) {
          toast.success('Subscription plan deleted successfully');
          fetchPlans();
        }
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePlanStatus = async (planId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await adminAPI.toggleSubscriptionPlanStatus(planId, newStatus);
      if (response.success) {
        toast.success(`Subscription plan ${newStatus ? 'activated' : 'deactivated'} successfully`);
        fetchPlans();
      }
    } catch (error) {
      console.error('Error toggling plan status:', error);
      toast.error('Failed to toggle plan status');
    }
  };

  const handleUpdateSubscriptionStatus = async (subscriptionId, status) => {
    try {
      const response = await adminAPI.updateSubscriptionStatus(subscriptionId, status);
      if (response.success) {
        toast.success(`Subscription ${status} successfully`);
        fetchSubscriptions();
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
      toast.error('Failed to update subscription status');
    }
  };

  const handleUpdateAutoRenew = async (subscriptionId, autoRenew) => {
    try {
      const response = await adminAPI.updateSubscriptionAutoRenew(subscriptionId, autoRenew);
      if (response.success) {
        toast.success(`Auto-renewal ${autoRenew ? 'enabled' : 'disabled'} successfully`);
        fetchSubscriptions();
      }
    } catch (error) {
      console.error('Error updating auto-renewal:', error);
      toast.error('Failed to update auto-renewal setting');
    }
  };

  const resetPlanForm = () => {
    setPlanFormData({
      name: '',
      price: '',
      interval: 'monthly',
      benefits: [],
      features: {
        maxPhotos: 5,
        maxVideos: 0,
        videoMaxDuration: 0,
        topListingDays: 14,
        rewardsAccess: ['monthly'],
        promotionChannels: ['youtube'],
        promotionEvents: ['special'],
        priority: 1
      },
      isActive: true
    });
    setIsEditingPlan(false);
    setSelectedPlan(null);
    setNewBenefit('');
  };

  const openPlanModal = (plan = null) => {
    if (plan) {
      setSelectedPlan(plan);
      setPlanFormData({
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        benefits: plan.benefits || [],
        features: plan.features || {
          maxPhotos: 5,
          maxVideos: 0,
          videoMaxDuration: 0,
          topListingDays: 14,
          rewardsAccess: ['monthly'],
          promotionChannels: ['youtube'],
          promotionEvents: ['special'],
          priority: 1
        },
        isActive: plan.isActive
      });
      setIsEditingPlan(true);
      setIsViewingPlan(false);
    } else {
      resetPlanForm();
      setIsViewingPlan(false);
    }
    setShowPlanModal(true);
  };

  const viewPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setIsViewingPlan(true);
    setIsEditingPlan(false);
    setShowPlanModal(true);
  };

  const openSubscriptionModal = async (subscriptionId) => {
    try {
      const response = await adminAPI.getSubscriptionById(subscriptionId);
      if (response.success && response.data) {
        setSelectedSubscription(response.data);
        setShowSubscriptionModal(true);
      }
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      toast.error('Failed to load subscription details');
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setPlanFormData({
        ...planFormData,
        benefits: [...planFormData.benefits, newBenefit.trim()]
      });
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    const updatedBenefits = planFormData.benefits.filter((_, i) => i !== index);
    setPlanFormData({
      ...planFormData,
      benefits: updatedBenefits
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getPlanStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  const getSubscriptionStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      past_due: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
      cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
      expired: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: Clock }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const getIntervalBadge = (interval) => {
    const colors = {
      monthly: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      yearly: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[interval] || colors.monthly}`}>
        <Calendar className="w-3 h-3 mr-1" />
        {interval?.charAt(0).toUpperCase() + interval?.slice(1)}
      </span>
    );
  };

  // Loading skeleton components
  const PlanCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

  const SubscriptionCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        </div>
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage subscription plans and provider subscriptions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={() => activeTab === 'plans' ? fetchPlans() : fetchSubscriptions()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'plans'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Plans</span>
              <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {totalItems}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'subscriptions'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Subscriptions</span>
              <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {totalItems}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {activeTab === 'plans' ? (
                  <>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </>
                ) : (
                  <>
                    <option value="active">Active</option>
                    <option value="past_due">Past Due</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </>
                )}
              </select>
            </div>
            {activeTab === 'plans' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interval
                </label>
                <select
                  value={intervalFilter}
                  onChange={(e) => setIntervalFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">All Intervals</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="createdAt">Created Date</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="updatedAt">Updated Date</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            activeTab === 'plans' ? <PlanCardSkeleton key={index} /> : <SubscriptionCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => activeTab === 'plans' ? fetchPlans() : fetchSubscriptions()}
            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <>
              {/* Add Plan Button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openPlanModal()}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-200 shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plan
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {plans.length} of {totalItems} plans
                </div>
              </div>

              {/* Plans Grid */}
              {plans.length === 0 ? (
                <div className="text-center py-12">
                  <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Plans Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first subscription plan'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => openPlanModal()}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Plan
                    </button>
                  )}
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {plans.map((plan, index) => (
                    <div
                      key={plan.id}
                      className={`group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden ${
                        viewMode === 'list' ? 'p-6' : 'p-6'
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      {/* Gradient Background Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-orange-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Premium Badge */}
                      {plan.price > 50000 && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>PREMIUM</span>
                          </div>
                        </div>
                      )}

                      <div className={`relative z-10 ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}>
                        <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'flex items-center justify-between mb-6'}`}>
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-orange-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                              <Crown className="w-8 h-8" />
                            </div>
                            {/* Floating particles effect */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                          </div>
                          {viewMode === 'grid' && (
                            <div className="flex items-center space-x-2">
                              {getPlanStatusBadge(plan.isActive)}
                            </div>
                          )}
                        </div>
                        
                        <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : ''}`}>
                          <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
                              {plan.name}
                            </h3>
                            {viewMode === 'list' && (
                              <div className="flex items-center space-x-2">
                                {getPlanStatusBadge(plan.isActive)}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2">
                            <div className="flex items-baseline space-x-2">
                              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(plan.price)}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                /{plan.interval}
                              </span>
                            </div>
                            <div className="flex items-center mt-2 space-x-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {plan.activeSubscriptions || 0} active subscriptions
                              </span>
                            </div>
                          </div>

                          {/* Features Preview */}
                          {plan.features && plan.features.length > 0 && (
                            <div className="mt-4">
                              <div className="flex flex-wrap gap-2">
                                {plan.features.slice(0, 3).map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 text-pink-700 dark:text-pink-300 text-xs font-medium rounded-full"
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    {feature}
                                  </span>
                                ))}
                                {plan.features.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                                    +{plan.features.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className={`mt-6 ${viewMode === 'list' ? 'flex items-center space-x-2' : 'flex items-center justify-between'}`}>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openPlanModal(plan)}
                                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => viewPlanDetails(plan)}
                                className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>
                            </div>
                            
                            <button
                              onClick={() => togglePlanStatus(plan.id, plan.isActive)}
                              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                plan.isActive 
                                  ? 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20' 
                                  : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20'
                              }`}
                              title={plan.isActive ? 'Deactivate Plan' : 'Activate Plan'}
                            >
                              {plan.isActive ? (
                                <ToggleRight className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-pink-200 dark:group-hover:border-pink-800 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {subscriptions.length} of {totalItems} subscriptions
                </div>
              </div>

              {/* Subscriptions Grid */}
              {subscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Subscriptions Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? 'Try adjusting your search criteria' : 'No subscriptions available at the moment'}
                  </p>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 ${
                        viewMode === 'list' ? 'p-6' : 'p-6'
                      }`}
                    >
                      <div className={`${viewMode === 'list' ? 'flex items-start space-x-4' : ''}`}>
                        <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'flex items-start justify-between mb-4'}`}>
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          {viewMode === 'grid' && (
                            <div className="flex items-center space-x-2">
                              {getSubscriptionStatusBadge(subscription.status)}
                            </div>
                          )}
                        </div>
                        
                        <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : ''}`}>
                          <div className={`${viewMode === 'list' ? 'flex items-start justify-between' : ''}`}>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {subscription.SubscriptionPlan?.name || 'Unknown Plan'}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <Users className="w-4 h-4 mr-1" />
                                {subscription.ProviderProfile?.businessName || subscription.ProviderProfile?.User?.fullName || 'Unknown Provider'}
                              </div>
                            </div>
                            {viewMode === 'list' && (
                              <div className="flex items-center space-x-2">
                                {getSubscriptionStatusBadge(subscription.status)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">₦</span>
                              {formatCurrency(subscription.SubscriptionPlan?.price || 0)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              {getIntervalBadge(subscription.SubscriptionPlan?.interval)}
                            </div>
                          </div>
                          
                          <div className={`${viewMode === 'list' ? 'flex items-center justify-between mt-4' : 'flex justify-between items-center mt-4'}`}>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="w-4 h-4 mr-1" />
                              Expires: {formatDate(subscription.currentPeriodEnd)}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openSubscriptionModal(subscription.id)}
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateAutoRenew(subscription.id, !subscription.autoRenew)}
                                className={`p-2 transition-colors ${
                                  subscription.autoRenew
                                    ? 'text-gray-400 hover:text-orange-600 dark:hover:text-orange-400'
                                    : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                                }`}
                                title={subscription.autoRenew ? 'Disable Auto-renew' : 'Enable Auto-renew'}
                              >
                                {subscription.autoRenew ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 px-6 py-4">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <span>
                  Showing page {currentPage} of {totalPages} ({totalItems} total items)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPlanModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handlePlanSubmit}>
                <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {isViewingPlan ? 'View Subscription Plan' : isEditingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPlanModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Plan Name *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isViewingPlan}
                          value={planFormData.name}
                          onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})}
                          className={`w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent ${isViewingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="Enter plan name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price *
                        </label>
                        <input
                          type="number"
                          required
                          disabled={isViewingPlan}
                          step="0.01"
                          min="0"
                          value={planFormData.price}
                          onChange={(e) => setPlanFormData({...planFormData, price: parseFloat(e.target.value)})}
                          className={`w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent ${isViewingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Billing Interval *
                      </label>
                      <select
                        required
                        value={planFormData.interval}
                        onChange={(e) => setPlanFormData({...planFormData, interval: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Benefits
                      </label>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newBenefit}
                            onChange={(e) => setNewBenefit(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Add benefit..."
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                          />
                          <button
                            type="button"
                            onClick={addBenefit}
                            className="px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {planFormData.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 px-3 py-2 rounded-lg">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                              <button
                                type="button"
                                onClick={() => removeBenefit(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={planFormData.isActive}
                        onChange={(e) => setPlanFormData({...planFormData, isActive: e.target.checked})}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {!isViewingPlan && (
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-base font-medium text-white hover:from-pink-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isEditingPlan ? 'Update Plan' : 'Create Plan'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  >
                    {isViewingPlan ? 'Close' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Details Modal */}
      {showSubscriptionModal && selectedSubscription && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowSubscriptionModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Subscription Details
                  </h3>
                  <button
                    onClick={() => setShowSubscriptionModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Subscription Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedSubscription.SubscriptionPlan?.name || 'Unknown Plan'}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2">
                        {getSubscriptionStatusBadge(selectedSubscription.status)}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">₦</span>
                          {formatCurrency(selectedSubscription.SubscriptionPlan?.price || 0)}
                        </div>
                        {getIntervalBadge(selectedSubscription.SubscriptionPlan?.interval)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subscription Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Subscription Information</h5>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Period Start:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {formatDate(selectedSubscription.currentPeriodStart)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Period End:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {formatDate(selectedSubscription.currentPeriodEnd)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <RotateCcw className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Auto-renewal:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {selectedSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Provider Information</h5>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Business:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {selectedSubscription.ProviderProfile?.businessName || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {selectedSubscription.ProviderProfile?.User?.email || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ShieldCheck className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {selectedSubscription.ProviderProfile?.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Plan Benefits */}
                  {selectedSubscription.SubscriptionPlan?.benefits && selectedSubscription.SubscriptionPlan.benefits.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Plan Benefits</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedSubscription.SubscriptionPlan.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleUpdateAutoRenew(selectedSubscription.id, !selectedSubscription.autoRenew)}
                  className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 ${
                    selectedSubscription.autoRenew
                      ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  {selectedSubscription.autoRenew ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Disable Auto-renewal
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Enable Auto-renewal
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Delete {itemToDelete?.type === 'plan' ? 'Subscription Plan' : 'Item'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this {itemToDelete?.type === 'plan' ? 'subscription plan' : 'item'}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default SubscriptionsPage;

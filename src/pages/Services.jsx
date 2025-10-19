import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Tag,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Settings,
  AlertCircle,
  Save,
  X,
  Grid3X3,
  List,
  Star,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  ShieldCheck,
  ShieldX,
  Zap,
  Info,
  TrendingUp,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminAPI from '../services/adminAPI';

const ServicesPage = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('categories');
  
  // Category states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    icon: '',
    isActive: true
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  // Service states
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    } else {
      fetchServices();
    }
  }, [activeTab, currentPage, itemsPerPage, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        isActive: statusFilter,
        sortBy,
        sortOrder
      };

      const response = await adminAPI.getCategories(params);
      
      if (response.success && response.data) {
        setCategories(response.data.categories);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        isActive: statusFilter,
        sortBy,
        sortOrder
      };

      const response = await adminAPI.getServices(params);
      
      if (response.success && response.data) {
        setServices(response.data.services);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      } else {
        throw new Error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingCategory) {
        const response = await adminAPI.updateCategory(selectedCategory.id, categoryFormData);
        if (response.success) {
          toast.success('Category updated successfully');
          fetchCategories();
        }
      } else {
        const response = await adminAPI.createCategory(categoryFormData);
        if (response.success) {
          toast.success('Category created successfully');
          fetchCategories();
        }
      }
      setShowCategoryModal(false);
      resetCategoryForm();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await adminAPI.deleteCategory(categoryId);
        if (response.success) {
          toast.success('Category deleted successfully');
          fetchCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleUpdateServiceStatus = async (serviceId, isActive) => {
    try {
      const response = await adminAPI.updateServiceStatus(serviceId, isActive);
      if (response.success) {
        toast.success(`Service ${isActive ? 'activated' : 'deactivated'} successfully`);
        fetchServices();
      }
    } catch (error) {
      console.error('Error updating service status:', error);
      toast.error('Failed to update service status');
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      description: '',
      icon: '',
      isActive: true
    });
    setIsEditingCategory(false);
    setSelectedCategory(null);
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setCategoryFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        isActive: category.isActive
      });
      setIsEditingCategory(true);
    } else {
      resetCategoryForm();
    }
    setShowCategoryModal(true);
  };

  const openServiceModal = async (serviceId) => {
    try {
      const response = await adminAPI.getServiceById(serviceId);
      if (response.success && response.data) {
        setSelectedService(response.data);
        setShowServiceModal(true);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
      toast.error('Failed to load service details');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryStatusBadge = (isActive) => {
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

  const getServiceStatusBadge = (isActive) => {
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

  const getPricingTypeBadge = (pricingType) => {
    const colors = {
      fixed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      hourly: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      negotiable: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[pricingType] || colors.fixed}`}>
        <DollarSign className="w-3 h-3 mr-1" />
        {pricingType?.charAt(0).toUpperCase() + pricingType?.slice(1)}
      </span>
    );
  };

  // Loading skeleton components
  const CategoryCardSkeleton = () => (
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

  const ServiceCardSkeleton = () => (
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage service categories and individual services
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
            onClick={() => activeTab === 'categories' ? fetchCategories() : fetchServices()}
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
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'categories'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Grid3X3 className="w-4 h-4" />
              <span>Categories</span>
              <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {totalItems}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'services'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <List className="w-4 h-4" />
              <span>Services</span>
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
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
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
                <option value="updatedAt">Updated Date</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            activeTab === 'categories' ? <CategoryCardSkeleton key={index} /> : <ServiceCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => activeTab === 'categories' ? fetchCategories() : fetchServices()}
            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <>
              {/* Add Category Button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openCategoryModal()}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-200 shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
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
                  Showing {categories.length} of {totalItems} categories
                </div>
              </div>

              {/* Categories Grid */}
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Categories Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first category'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => openCategoryModal()}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Category
                    </button>
                  )}
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 ${
                        viewMode === 'list' ? 'p-6' : 'p-6'
                      }`}
                    >
                      <div className={`${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}>
                        <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'flex items-center justify-between mb-4'}`}>
                          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xl">
                            {category.icon || '📁'}
                          </div>
                          {viewMode === 'grid' && (
                            <div className="flex items-center space-x-2">
                              {getCategoryStatusBadge(category.isActive)}
                            </div>
                          )}
                        </div>
                        
                        <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : ''}`}>
                          <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {category.name}
                            </h3>
                            {viewMode === 'list' && (
                              <div className="flex items-center space-x-2">
                                {getCategoryStatusBadge(category.isActive)}
                              </div>
                            )}
                          </div>
                          
                          {category.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                          
                          <div className={`${viewMode === 'list' ? 'flex items-center justify-between mt-4' : 'flex justify-between items-center mt-4'}`}>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Tag className="w-4 h-4 mr-1" />
                              {category.serviceCount || 0} services
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openCategoryModal(category)}
                                className="p-2 text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openCategoryModal(category)}
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
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

          {/* Services Tab */}
          {activeTab === 'services' && (
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
                  Showing {services.length} of {totalItems} services
                </div>
              </div>

              {/* Services Grid */}
              {services.length === 0 ? (
                <div className="text-center py-12">
                  <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Services Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? 'Try adjusting your search criteria' : 'No services available at the moment'}
                  </p>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 ${
                        viewMode === 'list' ? 'p-6' : 'p-6'
                      }`}
                    >
                      <div className={`${viewMode === 'list' ? 'flex items-start space-x-4' : ''}`}>
                        <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'flex items-start justify-between mb-4'}`}>
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          {viewMode === 'grid' && (
                            <div className="flex items-center space-x-2">
                              {getServiceStatusBadge(service.isActive)}
                            </div>
                          )}
                        </div>
                        
                        <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : ''}`}>
                          <div className={`${viewMode === 'list' ? 'flex items-start justify-between' : ''}`}>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {service.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <Tag className="w-4 h-4 mr-1" />
                                {service.Category?.name || 'Uncategorized'}
                              </div>
                            </div>
                            {viewMode === 'list' && (
                              <div className="flex items-center space-x-2">
                                {getServiceStatusBadge(service.isActive)}
                              </div>
                            )}
                          </div>
                          
                          {service.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                              {service.description}
                            </p>
                          )}
                          
                          <div className={`${viewMode === 'list' ? 'flex items-center justify-between mt-4' : 'flex justify-between items-center mt-4'}`}>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <DollarSign className="w-4 h-4 mr-1" />
                                ₦{parseFloat(service.basePrice).toLocaleString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                {getPricingTypeBadge(service.pricingType)}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openServiceModal(service.id)}
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateServiceStatus(service.id, !service.isActive)}
                                className={`p-2 transition-colors ${
                                  service.isActive
                                    ? 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                                    : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                                }`}
                                title={service.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {service.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCategoryModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCategorySubmit}>
                <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {isEditingCategory ? 'Edit Category' : 'Create New Category'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter category name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={categoryFormData.description}
                        onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter category description"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Icon (Emoji)
                      </label>
                      <input
                        type="text"
                        value={categoryFormData.icon}
                        onChange={(e) => setCategoryFormData({...categoryFormData, icon: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="📁 (emoji)"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={categoryFormData.isActive}
                        onChange={(e) => setCategoryFormData({...categoryFormData, isActive: e.target.checked})}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-base font-medium text-white hover:from-pink-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowServiceModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Service Details
                  </h3>
                  <button
                    onClick={() => setShowServiceModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Service Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedService.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2">
                        {getServiceStatusBadge(selectedService.isActive)}
                        {getPricingTypeBadge(selectedService.pricingType)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Service Information</h5>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Tag className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Category:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {selectedService.Category?.name || 'Uncategorized'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Price:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            ₦{parseFloat(selectedService.basePrice).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Created:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {formatDate(selectedService.createdAt)}
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
                            {selectedService.Provider?.businessName || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {selectedService.Provider?.User?.email || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ShieldCheck className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-medium">
                            {selectedService.Provider?.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {selectedService.description && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Description</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {selectedService.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Photos */}
                  {selectedService.photos && selectedService.photos.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Photos</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedService.photos.map((photo, index) => (
                          <div key={index} className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                            <img
                              src={photo}
                              alt={`Service photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleUpdateServiceStatus(selectedService.id, !selectedService.isActive)}
                  className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 ${
                    selectedService.isActive
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  {selectedService.isActive ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Deactivate Service
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate Service
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
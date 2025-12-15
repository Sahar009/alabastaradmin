import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldX,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Star,
  Clock,
  UserPlus,
  Edit,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminAPI from '../services/adminAPI';
import CreateAdminModal from '../components/CreateAdminModal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [isEditingRegistration, setIsEditingRegistration] = useState(false);
  const [editUserData, setEditUserData] = useState({});
  const [editProviderData, setEditProviderData] = useState({});
  const [editRegistrationData, setEditRegistrationData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
        sortBy,
        sortOrder
      };

      const response = await adminAPI.getUsers(params);
      
      if (response.success && response.data) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const response = await adminAPI.getUserById(userId);
      if (response.success && response.data) {
        setSelectedUser(response.data);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      const response = await adminAPI.updateUserStatus(userId, newStatus);
      if (response.success) {
        toast.success('User status updated successfully');
        fetchUsers(); // Refresh the list
        if (selectedUser && selectedUser.user.id === userId) {
          setSelectedUser(prev => ({
            ...prev,
            user: { ...prev.user, status: newStatus }
          }));
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setEditUserData({
        fullName: selectedUser.user.fullName || '',
        email: selectedUser.user.email || '',
        phone: selectedUser.user.phone || '',
        alternativePhone: selectedUser.user.alternativePhone || '',
        role: selectedUser.user.role || 'customer',
        status: selectedUser.user.status || 'active',
        isEmailVerified: selectedUser.user.isEmailVerified || false,
        isPhoneVerified: selectedUser.user.isPhoneVerified || false
      });
      setIsEditingUser(true);
    }
  };

  const handleEditProvider = () => {
    if (selectedUser && selectedUser.providerProfile) {
      setEditProviderData({
        businessName: selectedUser.providerProfile.businessName || '',
        category: selectedUser.providerProfile.category || '',
        subcategories: selectedUser.providerProfile.subcategories || [],
        bio: selectedUser.providerProfile.bio || '',
        verificationStatus: selectedUser.providerProfile.verificationStatus || 'pending',
        locationCity: selectedUser.providerProfile.locationCity || '',
        locationState: selectedUser.providerProfile.locationState || '',
        latitude: selectedUser.providerProfile.latitude || '',
        longitude: selectedUser.providerProfile.longitude || ''
      });
      setIsEditingProvider(true);
    }
  };

  const handleEditRegistration = () => {
    if (selectedUser && selectedUser.providerRegistrationProgress) {
      setEditRegistrationData({
        currentStep: selectedUser.providerRegistrationProgress.currentStep || 1,
        stepData: selectedUser.providerRegistrationProgress.stepData || {}
      });
      setIsEditingRegistration(true);
    }
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    setIsSaving(true);
    try {
      const response = await adminAPI.updateUser(selectedUser.user.id, editUserData);
      if (response.success) {
        toast.success('User updated successfully');
        setSelectedUser(prev => ({
          ...prev,
          user: { ...prev.user, ...editUserData }
        }));
        setIsEditingUser(false);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProvider = async () => {
    if (!selectedUser) return;
    
    setIsSaving(true);
    try {
      const response = await adminAPI.updateProviderProfile(selectedUser.user.id, editProviderData);
      if (response.success) {
        toast.success('Provider profile updated successfully');
        setSelectedUser(prev => ({
          ...prev,
          providerProfile: { ...prev.providerProfile, ...editProviderData }
        }));
        setIsEditingProvider(false);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating provider profile:', error);
      toast.error('Failed to update provider profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRegistration = async () => {
    if (!selectedUser) return;
    
    setIsSaving(true);
    try {
      const response = await adminAPI.updateProviderRegistrationProgress(selectedUser.user.id, editRegistrationData);
      if (response.success) {
        toast.success('Registration progress updated successfully');
        setSelectedUser(prev => ({
          ...prev,
          providerRegistrationProgress: { ...prev.providerRegistrationProgress, ...editRegistrationData }
        }));
        setIsEditingRegistration(false);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating registration progress:', error);
      toast.error('Failed to update registration progress');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingUser(false);
    setIsEditingProvider(false);
    setIsEditingRegistration(false);
    setEditUserData({});
    setEditProviderData({});
    setEditRegistrationData({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: UserCheck },
      inactive: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: UserX },
      suspended: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: UserX }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      customer: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      provider: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      admin: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
    };
    
    const config = roleConfig[role] || roleConfig.customer;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {role}
      </span>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="flex gap-4">
          <div className="h-10 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor all platform users</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateAdminModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Create Admin
          </button>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button> */}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                showFilters
                  ? 'text-primary border-primary bg-primary/10'
                  : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="fullName">Name</option>
                  <option value="email">Email</option>
                  <option value="lastLoginAt">Last Login</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="DESC">Descending</option>
                  <option value="ASC">Ascending</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleFilterChange}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Users ({totalItems})
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                          {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.fullName || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {user.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <ShieldCheck className="w-3 h-3" />
                          Email
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <ShieldX className="w-3 h-3" />
                          Email
                        </span>
                      )}
                      {user.isPhoneVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <ShieldCheck className="w-3 h-3" />
                          Phone
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <ShieldX className="w-3 h-3" />
                          Phone
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUserClick(user.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'text-white bg-primary'
                            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  User Details - {selectedUser.user.fullName}
                </h2>
                <div className="flex items-center gap-2">
                  {!isEditingUser && !isEditingProvider && !isEditingRegistration && (
                    <>
                      <button
                        onClick={handleEditUser}
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit User
                      </button>
                      {selectedUser.providerProfile && (
                        <button
                          onClick={handleEditProvider}
                          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Provider
                        </button>
                      )}
                      {selectedUser.providerRegistrationProgress && (
                        <button
                          onClick={handleEditRegistration}
                          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Registration
                        </button>
                      )}
                    </>
                  )}
                  {(isEditingUser || isEditingProvider || isEditingRegistration) && (
                    <>
                      <button
                        onClick={
                          isEditingUser ? handleSaveUser : 
                          isEditingProvider ? handleSaveProvider : 
                          handleSaveRegistration
                        }
                        disabled={isSaving}
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/30 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setShowUserModal(false);
                      handleCancelEdit();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Statistics Overview - Only show for non-admin users */}
              {selectedUser.statistics && selectedUser.user.role !== 'admin' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedUser.statistics.totalBookings}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Total Bookings</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">₦{selectedUser.statistics.totalSpent?.toLocaleString() || '0'}</div>
                    <div className="text-sm text-green-600 dark:text-green-400">Total Spent</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">₦{selectedUser.statistics.totalEarned?.toLocaleString() || '0'}</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Total Earned</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{selectedUser.statistics.averageRating || '0'}</div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">Avg Rating</div>
                  </div>
                </div>
              )}

              {/* User Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                      {isEditingUser ? (
                        <input
                          type="text"
                          value={editUserData.fullName}
                          onChange={(e) => setEditUserData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.user.fullName || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      {isEditingUser ? (
                        <input
                          type="email"
                          value={editUserData.email}
                          onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.user.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                      {isEditingUser ? (
                        <input
                          type="tel"
                          value={editUserData.phone}
                          onChange={(e) => setEditUserData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.user.phone || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alternative Phone</label>
                      {isEditingUser ? (
                        <input
                          type="tel"
                          value={editUserData.alternativePhone}
                          onChange={(e) => setEditUserData(prev => ({ ...prev, alternativePhone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.user.alternativePhone || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                      {isEditingUser ? (
                        <select
                          value={editUserData.role}
                          onChange={(e) => setEditUserData(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="customer">Customer</option>
                          <option value="provider">Provider</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <div className="mt-1">{getRoleBadge(selectedUser.user.role)}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provider</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedUser.user.provider || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Status</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      {isEditingUser ? (
                        <select
                          value={editUserData.status}
                          onChange={(e) => setEditUserData(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      ) : (
                        <div className="mt-1">{getStatusBadge(selectedUser.user.status)}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Verified</label>
                      {isEditingUser ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editUserData.isEmailVerified}
                            onChange={(e) => setEditUserData(prev => ({ ...prev, isEmailVerified: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {editUserData.isEmailVerified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1">
                          {selectedUser.user.isEmailVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <ShieldX className="w-3 h-3" />
                              Not Verified
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Verified</label>
                      {isEditingUser ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editUserData.isPhoneVerified}
                            onChange={(e) => setEditUserData(prev => ({ ...prev, isPhoneVerified: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {editUserData.isPhoneVerified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1">
                          {selectedUser.user.isPhoneVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <ShieldX className="w-3 h-3" />
                              Not Verified
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joined Date</label>
                      <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedUser.user.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedUser.user.lastLoginAt ? formatDate(selectedUser.user.lastLoginAt) : 'Never'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Profile - Only show for customer users */}
              {selectedUser.customerProfile && selectedUser.user.role === 'customer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Profile</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.customerProfile.emergencyContact || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Phone</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.customerProfile.emergencyPhone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Language</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedUser.customerProfile.preferredLanguage || 'English'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notification Settings</label>
                        <div className="flex gap-2 mt-1">
                          {selectedUser.customerProfile.notificationSettings?.email && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">Email</span>
                          )}
                          {selectedUser.customerProfile.notificationSettings?.sms && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">SMS</span>
                          )}
                          {selectedUser.customerProfile.notificationSettings?.push && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs">Push</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Provider Profile - Only show for provider users */}
              {selectedUser.user.role === 'provider' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Provider Profile</h3>
                  
                  {selectedUser.providerProfile ? (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
                        {isEditingProvider ? (
                          <input
                            type="text"
                            value={editProviderData.businessName}
                            onChange={(e) => setEditProviderData(prev => ({ ...prev, businessName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white">{selectedUser.providerProfile.businessName || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Category</label>
                        {isEditingProvider ? (
                          <input
                            type="text"
                            value={editProviderData.category}
                            onChange={(e) => setEditProviderData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white">{selectedUser.providerProfile.category || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location City</label>
                        {isEditingProvider ? (
                          <input
                            type="text"
                            value={editProviderData.locationCity}
                            onChange={(e) => setEditProviderData(prev => ({ ...prev, locationCity: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white">{selectedUser.providerProfile.locationCity || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location State</label>
                        {isEditingProvider ? (
                          <input
                            type="text"
                            value={editProviderData.locationState}
                            onChange={(e) => setEditProviderData(prev => ({ ...prev, locationState: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white">{selectedUser.providerProfile.locationState || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Status</label>
                        {isEditingProvider ? (
                          <select
                            value={editProviderData.verificationStatus}
                            onChange={(e) => setEditProviderData(prev => ({ ...prev, verificationStatus: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        ) : (
                          <div className="mt-1">
                            {selectedUser.providerProfile.verificationStatus === 'verified' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <ShieldCheck className="w-3 h-3" />
                                Verified
                              </span>
                            ) : selectedUser.providerProfile.verificationStatus === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                <ShieldX className="w-3 h-3" />
                                Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        {isEditingProvider ? (
                          <textarea
                            value={editProviderData.bio}
                            onChange={(e) => setEditProviderData(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-white">{selectedUser.providerProfile.bio || 'N/A'}</p>
                        )}
                      </div>
                      {/* Referral Information */}
                      <div className="md:col-span-2">
                        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Referral Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedUser.providerProfile.referralCode && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Referral Code</label>
                              <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                {selectedUser.providerProfile.referralCode}
                              </p>
                            </div>
                          )}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Referrals</label>
                            <p className="text-sm text-gray-900 dark:text-white font-semibold">
                              {selectedUser.providerProfile.totalReferrals || 0}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Commissions Earned</label>
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                              ₦{parseFloat(selectedUser.providerProfile.totalCommissionsEarned || 0).toLocaleString()}
                            </p>
                          </div>
                          {selectedUser.providerProfile.referredBy && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Referred By</label>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {selectedUser.providerProfile.referredBy}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Provider Profile</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          This provider hasn't completed their profile setup yet.
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Provider profile will appear here once they complete the registration process.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Provider Portfolio - Only show for provider users */}
              {selectedUser.providerProfile && selectedUser.providerProfile.portfolio && selectedUser.user.role === 'provider' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio</h3>
                  
                  {/* Brand Images */}
                  {selectedUser.providerProfile.portfolio.brandImages && selectedUser.providerProfile.portfolio.brandImages.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Brand Images ({selectedUser.providerProfile.portfolio.brandImages.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedUser.providerProfile.portfolio.brandImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Brand Image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow cursor-pointer"
                              onClick={() => window.open(image.url, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                              {image.type?.replace('_', ' ').toUpperCase() || 'Brand Image'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {selectedUser.providerProfile.portfolio.documents && selectedUser.providerProfile.portfolio.documents.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Documents ({selectedUser.providerProfile.portfolio.documents.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedUser.providerProfile.portfolio.documents.map((doc, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {doc.type === 'id_card' ? (
                                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {doc.type?.replace('_', ' ').toUpperCase() || 'Document'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {doc.name || 'Document'}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <button
                                  onClick={() => window.open(doc.url, '_blank')}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                  title="View Document"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Portfolio Items */}
                  {(!selectedUser.providerProfile.portfolio.brandImages || selectedUser.providerProfile.portfolio.brandImages.length === 0) && 
                   (!selectedUser.providerProfile.portfolio.documents || selectedUser.providerProfile.portfolio.documents.length === 0) && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No portfolio items available</p>
                    </div>
                  )}
                </div>
              )}

              {/* Provider Registration Progress - Only show for provider users */}
              {selectedUser.user.role === 'provider' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Registration Progress</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Role: {selectedUser.user.role} | Has Progress: {selectedUser.providerRegistrationProgress ? 'Yes' : 'No'}
                    </div>
                  </div>
                  
                  {selectedUser.providerRegistrationProgress ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Steps</label>
                          {isEditingRegistration && (
                            <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                              ✓ Checkboxes enabled - click to update steps
                            </span>
                          )}
                        </div>
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5].map((step) => {
                            const currentStep = isEditingRegistration ? editRegistrationData.currentStep : selectedUser.providerRegistrationProgress.currentStep;
                            const isCompleted = step <= currentStep;
                            const isCurrentStep = step === currentStep;
                            
                            return (
                              <div key={step} className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                                isCompleted 
                                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                                  : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                              } ${isCurrentStep ? 'ring-2 ring-orange-500' : ''}`}>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isCompleted}
                                    disabled={!isEditingRegistration}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEditRegistrationData(prev => ({ 
                                          ...prev, 
                                          currentStep: Math.max(prev.currentStep, step)
                                        }));
                                      } else {
                                        setEditRegistrationData(prev => ({ 
                                          ...prev, 
                                          currentStep: Math.min(prev.currentStep, step - 1)
                                        }));
                                      }
                                    }}
                                    className={`w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
                                      !isEditingRegistration ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-sm font-medium ${
                                      isCompleted 
                                        ? 'text-green-800 dark:text-green-200' 
                                        : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                      Step {step}
                                    </span>
                                    {isCurrentStep && (
                                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full">
                                        Current
                                      </span>
                                    )}
                                    {isCompleted && !isCurrentStep && (
                                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                                        Completed
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-xs ${
                                    isCompleted 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-gray-500 dark:text-gray-500'
                                  }`}>
                                    {step === 1 && 'Account Creation'}
                                    {step === 2 && 'Business Information'}
                                    {step === 3 && 'Service Details'}
                                    {step === 4 && 'Verification Documents'}
                                    {step === 5 && 'Payment & Completion'}
                                  </p>
                                </div>
                                {isCompleted && (
                                  <div className="text-green-600 dark:text-green-400">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Progress Percentage</label>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{Math.round((selectedUser.providerRegistrationProgress.currentStep / 5) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(selectedUser.providerRegistrationProgress.currentStep / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>


                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(selectedUser.providerRegistrationProgress.lastUpdated)}
                        </p>
                      </div>
                    </div>
                  </div>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Registration Progress</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          This provider hasn't started the registration process yet.
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Registration progress will appear here once the provider begins the onboarding process.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Section - Only show for non-admin users */}
              {selectedUser.bookings && selectedUser.bookings.length > 0 && selectedUser.user.role !== 'admin' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bookings ({selectedUser.bookings.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedUser.bookings.map((booking) => (
                      <div key={booking.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {booking.providerProfile?.businessName || booking.customer?.fullName || 'Unknown Service'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {booking.providerProfile?.category || 'N/A'} • {formatDate(booking.scheduledAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              booking.status === 'requested' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {booking.status === 'requested' ? 'Pending' : booking.status}
                            </span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                              ₦{parseFloat(booking.totalAmount).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Payment: {booking.paymentStatus} • Escrow: {booking.escrowStatus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments Section - Only show for non-admin users */}
              {selectedUser.payments && selectedUser.payments.length > 0 && selectedUser.user.role !== 'admin' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment History ({selectedUser.payments.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedUser.payments.map((payment) => (
                      <div key={payment.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {payment.Booking?.providerProfile?.businessName || 'Payment'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {payment.paymentType} • {payment.paymentMethod} • {formatDate(payment.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'successful' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {payment.status}
                            </span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                              ₦{parseFloat(payment.amount).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {payment.reference && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Ref: {payment.reference}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section - Only show for non-admin users */}
              {selectedUser.reviews && (selectedUser.reviews.given?.length > 0 || selectedUser.reviews.received?.length > 0) && selectedUser.user.role !== 'admin' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reviews</h3>
                  
                  {selectedUser.reviews.given?.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Given Reviews ({selectedUser.reviews.given.length})</h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {selectedUser.reviews.given.map((review) => (
                          <div key={review.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {review.Booking?.providerProfile?.businessName || 'Unknown'}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">{review.comment}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedUser.reviews.received?.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Received Reviews ({selectedUser.reviews.received.length})</h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {selectedUser.reviews.received.map((review) => (
                          <div key={review.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {review.User?.fullName || 'Anonymous'}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">{review.comment}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Section - Only show for non-admin users */}
              {selectedUser.notifications && selectedUser.notifications.length > 0 && selectedUser.user.role !== 'admin' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Notifications ({selectedUser.notifications.length})</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedUser.notifications.map((notification) => (
                      <div key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.isRead ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {notification.isRead ? 'Read' : 'Unread'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{notification.body}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                <div className="flex gap-2">
                  {selectedUser.user.status === 'active' ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedUser.user.id, 'inactive')}
                        className="px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 dark:bg-orange-900 dark:text-orange-200 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedUser.user.id, 'suspended')}
                        className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      >
                        Suspend
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(selectedUser.user.id, 'active')}
                      className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={showCreateAdminModal}
        onClose={() => setShowCreateAdminModal(false)}
        onSuccess={() => {
          fetchUsers(); // Refresh the users list
          setShowCreateAdminModal(false);
        }}
      />
    </div>
  );
};

export default UsersPage;
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Star,
  CreditCard,
  MessageSquare,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminAPI from '../services/adminAPI';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    fetchBookings();
  }, [currentPage, itemsPerPage, sortBy, sortOrder]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
        dateFrom: dateFromFilter,
        dateTo: dateToFilter,
        sortBy,
        sortOrder
      };

      const response = await adminAPI.getBookings(params);
      
      if (response.success) {
        setBookings(response.data.bookings);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      } else {
        throw new Error(response.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = async (booking) => {
    try {
      const response = await adminAPI.getBookingById(booking.id);
      if (response.success) {
        setSelectedBooking(response.data);
        setShowBookingModal(true);
      } else {
        throw new Error(response.message || 'Failed to fetch booking details');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to load booking details');
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const response = await adminAPI.updateBookingStatus(bookingId, status);
      if (response.success) {
        toast.success('Booking status updated successfully');
        fetchBookings(); // Refresh the list
        if (selectedBooking && selectedBooking.booking.id === bookingId) {
          // Update the selected booking in modal
          setSelectedBooking(prev => ({
            ...prev,
            booking: { ...prev.booking, status }
          }));
        }
      } else {
        throw new Error(response.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchBookings();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      requested: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Pending' },
      accepted: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Accepted' },
      in_progress: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.requested;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {status === 'requested' && <Clock className="w-3 h-3" />}
        {status === 'accepted' && <CheckCircle className="w-3 h-3" />}
        {status === 'in_progress' && <Clock className="w-3 h-3" />}
        {status === 'completed' && <CheckCircle className="w-3 h-3" />}
        {status === 'cancelled' && <XCircle className="w-3 h-3" />}
        {config.label}
      </span>
    );
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

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor all service bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button> */}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="requested">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Apply Filters Button */}
          <button
            onClick={handleFilterChange}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
            <input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
            <input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt-DESC">Newest First</option>
              <option value="createdAt-ASC">Oldest First</option>
              <option value="scheduledAt-DESC">Scheduled Date (Latest)</option>
              <option value="scheduledAt-ASC">Scheduled Date (Earliest)</option>
              <option value="totalAmount-DESC">Amount (High to Low)</option>
              <option value="totalAmount-ASC">Amount (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'requested').length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'completed').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.id.substring(0, 8)}...
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(booking.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                          {booking.customer?.fullName?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.customer?.fullName || 'Unknown Customer'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.customer?.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                          {booking.providerProfile?.User?.fullName?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.providerProfile?.businessName || booking.providerProfile?.User?.fullName || 'Unknown Provider'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.providerProfile?.category || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {booking.providerProfile?.category || 'N/A'}
                    </div>
                    {booking.locationCity && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {booking.locationCity}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(booking.scheduledAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewBooking(booking)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                </span>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
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

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Booking Details - {selectedBooking.booking.id.substring(0, 8)}...
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Booking Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatDate(selectedBooking.booking.scheduledAt)}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">Scheduled Date</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {selectedBooking.booking.status}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Status</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₦{parseFloat(selectedBooking.booking.totalAmount).toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Total Amount</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {selectedBooking.booking.paymentStatus}
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Payment Status</div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Booking Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Booking ID</label>
                      <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedBooking.booking.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedBooking.booking.status)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escrow Status</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking.escrowStatus}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking.currency}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service ID</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking.serviceId || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
                      <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedBooking.booking.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
                      <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedBooking.booking.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location & Service</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Category</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.providerProfile?.category || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategories</label>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {selectedBooking.providerProfile?.subcategories && selectedBooking.providerProfile.subcategories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedBooking.providerProfile.subcategories.map((subcat, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                                {subcat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span>Not specified</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location Address</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking.locationAddress || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location City</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking.locationCity || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location State</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking.locationState || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Coordinates</label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedBooking.booking.latitude && selectedBooking.booking.longitude 
                          ? `${selectedBooking.booking.latitude}, ${selectedBooking.booking.longitude}`
                          : 'Not specified'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking.notes && selectedBooking.booking.notes.trim() ? selectedBooking.booking.notes : 'No notes provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Provider Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer ID</label>
                        <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedBooking.booking?.customer?.id || 'Not available'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.fullName || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.email || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.phone || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alternative Phone</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.alternativePhone && selectedBooking.booking.customer.alternativePhone.trim() ? selectedBooking.booking.customer.alternativePhone : 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.role || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.status || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Verified</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.isEmailVerified ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Verified</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.isPhoneVerified ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joined Date</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.createdAt ? formatDate(selectedBooking.booking.customer.createdAt) : 'Not available'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.customer?.lastLoginAt ? formatDate(selectedBooking.booking.customer.lastLoginAt) : 'Never'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Provider Information</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provider ID</label>
                        <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedBooking.booking?.providerProfile?.id || 'Not available'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.businessName || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.User?.fullName || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.User?.email || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.User?.phone || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alternative Phone</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.User?.alternativePhone && selectedBooking.booking.providerProfile.User.alternativePhone.trim() ? selectedBooking.booking.providerProfile.User.alternativePhone : 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Category</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.category || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategories</label>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {selectedBooking.booking?.providerProfile?.subcategories && selectedBooking.booking.providerProfile.subcategories.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedBooking.booking.providerProfile.subcategories.map((subcat, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                                  {subcat}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span>Not specified</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.bio && selectedBooking.booking.providerProfile.bio.trim() ? selectedBooking.booking.providerProfile.bio : 'No bio provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedBooking.booking?.providerProfile?.locationCity && selectedBooking.booking.providerProfile?.locationState 
                            ? `${selectedBooking.booking.providerProfile.locationCity}, ${selectedBooking.booking.providerProfile.locationState}`
                            : 'Not specified'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Status</label>
                        <div className="mt-1">
                          {selectedBooking.booking?.providerProfile?.verificationStatus === 'verified' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verified At</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.verifiedAt ? formatDate(selectedBooking.booking.providerProfile.verifiedAt) : 'Not verified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Referral Code</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.referralCode || 'Not assigned'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Referrals</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.totalReferrals || 0}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Commissions Earned</label>
                        <p className="text-sm text-gray-900 dark:text-white">₦{parseFloat(selectedBooking.booking?.providerProfile?.totalCommissionsEarned || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio</label>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {selectedBooking.booking?.providerProfile?.portfolio && selectedBooking.booking.providerProfile.portfolio.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedBooking.booking.providerProfile.portfolio.map((item, index) => (
                                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                                  {typeof item === 'string' ? item : JSON.stringify(item)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span>No portfolio items</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provider Created</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.createdAt ? formatDate(selectedBooking.booking.providerProfile.createdAt) : 'Not available'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.booking?.providerProfile?.updatedAt ? formatDate(selectedBooking.booking.providerProfile.updatedAt) : 'Not available'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment History ({selectedBooking.payments?.length || 0})</h3>
                {selectedBooking.payments && selectedBooking.payments.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedBooking.payments.map((payment) => (
                      <div key={payment.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {payment.paymentType} • {payment.paymentMethod}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(payment.createdAt)}
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
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No payment history available for this booking</p>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reviews ({selectedBooking.reviews?.length || 0})</h3>
                {selectedBooking.reviews && selectedBooking.reviews.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedBooking.reviews.map((review) => (
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
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No reviews available for this booking</p>
                  </div>
                )}
              </div>

              {/* Notifications Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Related Notifications ({selectedBooking.notifications?.length || 0})</h3>
                {selectedBooking.notifications && selectedBooking.notifications.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedBooking.notifications.map((notification) => (
                      <div key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.isRead ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {notification.isRead ? 'Read' : 'Unread'}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                              {notification.type}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{notification.body}</p>
                        {notification.meta && (
                          <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                            <strong>Meta:</strong>
                            <div className="ml-2 mt-1">
                              {notification.meta.bookingId && (
                                <div>Booking ID: {notification.meta.bookingId}</div>
                              )}
                              {notification.meta.serviceId && (
                                <div>Service ID: {notification.meta.serviceId}</div>
                              )}
                              {notification.meta.providerId && (
                                <div>Provider ID: {notification.meta.providerId}</div>
                              )}
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Created: {formatDate(notification.createdAt)} | Updated: {formatDate(notification.updatedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No notifications available for this booking</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                <div className="flex gap-2">
                  {/* Status Update Buttons */}
                  {selectedBooking.booking.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.booking.id, 'completed')}
                      className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                  {selectedBooking.booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.booking.id, 'cancelled')}
                      className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
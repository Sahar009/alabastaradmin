import { useState, useEffect } from 'react';
import { Search, Star, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReviews = [
        { id: 1, customer: 'John Doe', provider: 'James Clean', rating: 5, comment: 'Excellent service! Very professional and thorough.', date: '2024-01-20', status: 'approved' },
        { id: 2, customer: 'Sarah Johnson', provider: 'Sarah Fix', rating: 4, comment: 'Good work, arrived on time and fixed the issue quickly.', date: '2024-01-21', status: 'approved' },
        { id: 3, customer: 'Mike Wilson', provider: 'Mike Paint', rating: 3, comment: 'Average service, could be better.', date: '2024-01-22', status: 'pending' },
        { id: 4, customer: 'Emily Brown', provider: 'Emily Garden', rating: 5, comment: 'Amazing work! My garden looks beautiful now.', date: '2024-01-23', status: 'approved' }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, status: newStatus } : review
      ));
      
      toast.success(`Review ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status}
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage customer reviews and ratings</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{review.customer}</h3>
                    <span className="text-slate-500 dark:text-slate-400">reviewed</span>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{review.provider}</h4>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">{review.comment}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(review.status)}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(review.id, 'approved')}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <ThumbsUp size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(review.id, 'rejected')}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <ThumbsDown size={14} />
                      <span>Reject</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                      <Flag size={14} />
                      <span>Flag</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;





import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockServices = [
        { id: 1, name: 'House Cleaning', category: 'Cleaning', price: '₦15,000', providers: 25, bookings: 156 },
        { id: 2, name: 'Plumbing', category: 'Repair', price: '₦25,000', providers: 18, bookings: 89 },
        { id: 3, name: 'Painting', category: 'Home Improvement', price: '₦45,000', providers: 12, bookings: 67 },
        { id: 4, name: 'Gardening', category: 'Outdoor', price: '₦20,000', providers: 15, bookings: 45 },
        { id: 5, name: 'Electrical', category: 'Repair', price: '₦30,000', providers: 20, bookings: 78 }
      ];
      
      setServices(mockServices);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Services</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage available services</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{service.name}</h3>
                <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400 rounded-full text-xs">
                  {service.category}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Price:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Providers:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{service.providers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Bookings:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{service.bookings}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-secondary text-sm">Edit</button>
                <button className="flex-1 btn-primary text-sm">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;





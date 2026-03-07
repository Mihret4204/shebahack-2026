import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isVendor } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not vendor
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isVendor()) {
      navigate('/');
    }
  }, [user, isVendor, navigate]);

  // Mock data for vendor dashboard
  const stats = {
    totalOrders: 156,
    totalEarnings: 45600,
    activeListings: 12
  };

  const mockProducts = [
    { id: 1, name: 'Traditional Coffee Set', price: 850, stock: 15, status: 'active', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Handwoven Basket', price: 450, stock: 8, status: 'active', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Spice Mix Collection', price: 280, stock: 25, status: 'active', image: 'https://via.placeholder.com/100' },
    { id: 4, name: 'Handmade Jewelry', price: 380, stock: 12, status: 'active', image: 'https://via.placeholder.com/100' }
  ];

  const mockServices = [
    { id: 1, name: 'Professional Laundry Service', price: 150, bookings: 45, status: 'active' },
    { id: 2, name: 'Event Catering', price: 5000, bookings: 12, status: 'active' },
    { id: 3, name: 'Home Cooking Service', price: 400, bookings: 28, status: 'active' }
  ];

  const orders = [
    { id: '001', productName: 'Traditional Coffee Set', customer: 'Dawit Kebede', quantity: 2, total: 1700, status: 'pending', date: '2024-03-05' },
    { id: '002', productName: 'Handwoven Basket', customer: 'Meron Haile', quantity: 1, total: 450, status: 'completed', date: '2024-03-04' },
    { id: '003', productName: 'Spice Mix Collection', customer: 'Sara Mulugeta', quantity: 3, total: 840, status: 'pending', date: '2024-03-03' },
    { id: '004', productName: 'Handmade Jewelry', customer: 'Bethlehem Tadesse', quantity: 1, total: 380, status: 'completed', date: '2024-03-02' }
  ];

  if (!user || !isVendor()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Orders</p>
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Earnings</p>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats.totalEarnings} ETB</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Active Listings</p>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats.activeListings}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {['overview', 'products', 'services', 'orders'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-semibold capitalize transition ${
                    activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                <div className="space-y-4">
                  {orders.slice(0, 3).map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Manage Products</h2>
                  <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold">
                    + Add Product
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProducts.map(product => (
                    <div key={product.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-3" />
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-primary font-bold">{product.price} ETB</span>
                        <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition">
                          Edit
                        </button>
                        <button className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Manage Services</h2>
                  <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold">
                    + Add Service
                  </button>
                </div>
                <div className="space-y-4">
                  {mockServices.map(service => (
                    <div key={service.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                          <p className="text-gray-600">Total Bookings: {service.bookings}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{service.price} ETB</p>
                          <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {service.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                          Edit Service
                        </button>
                        <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                          Delete Service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">All Orders</h2>
                <div className="space-y-4">
                  {orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

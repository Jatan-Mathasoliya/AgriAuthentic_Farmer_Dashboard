import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, User, MapPin, Phone, Mail, ShoppingBag, Truck, Star } from 'lucide-react';
import axios from 'axios';

function MarketPlace() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch farmers data from API
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get('https://agriauthenic-poc-backend.onrender.com/farmer');
        const farmersData = response.data
        setFarmers(farmersData);
        setLoading(false);
        console.log(response)
      } catch (error) {
        console.error('Error fetching farmers data:', error);
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  
  const categories = ['all', 'dairy', 'produce', 'livestock', 'grains', 'organic'];

  return (
    <div className="bg-green-50 min-h-screen">
      {/* Header */}
      <header className="bg-green-800 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Farmer's Marketplace</h1>
          <p className="mt-2 text-green-100">Connect with local farmers and discover fresh products</p>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto p-4 mt-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search farmers, products, or locations..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : farmers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-700">No farmers found</h2>
            <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers?.map((farmer) => (
              <div key={farmer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {farmer.image ? (
                    <img 
                      src={farmer.image} 
                      alt={farmer.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-green-100">
                      <ShoppingBag size={64} className="text-green-300" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {farmer.category}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800">{farmer.farmerEmail}</h2>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="ml-1 text-sm font-medium">{farmer.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{
                      farmer.farmAddress?.map((address)=>(
                        <div key={address._id}>
                          {address.city}
                        </div>
                      ))
                      }</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors">
                      Contact
                    </button>
                    <button className="px-4 py-2 bg-transparent text-green-600 border border-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className="max-w-6xl mx-auto p-4 mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Farmers</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-4 rounded-full">
                <User size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Join Our Community</h3>
                <p className="text-sm text-gray-600 mt-1">Connect with other farmers and share resources</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Truck size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Expand Your Market</h3>
                <p className="text-sm text-gray-600 mt-1">Reach more customers and grow your business</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Farmer's Marketplace</h3>
              <p className="text-green-100 text-sm">Connecting farmers with each other and consumers for a sustainable agricultural future.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-green-100 text-sm">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-green-100 text-sm">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>123 Farm Road, Countryside</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>+1 234 567 890</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <span>info@farmersmarketplace.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-green-700 text-center text-green-100 text-sm">
            <p>&copy; {new Date().getFullYear()} Farmer's Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MarketPlace;
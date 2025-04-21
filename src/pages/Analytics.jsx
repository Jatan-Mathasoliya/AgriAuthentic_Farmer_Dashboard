import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Clock, Info, MapPin, Phone, Mail } from 'lucide-react';

function Analytics() {
  const [timeRange, setTimeRange] = useState('Daily');

  // Mock data for the chart and statistics
  const revenueData = {
    labels: ['3/12/2025', '3/13/2025', '3/14/2025', '3/15/2025', '3/16/2025', '3/17/2025', '3/18/2025'],
    values: [3500000, 3800000, 2700000, 3500000, 3000000, 3700000, 3900000]
  };

  const summaryData = [
    { title: 'Total Earnings', value: '₹4,50,000.00', icon: '₹', bgColor: 'bg-blue-100' },
    { title: 'Pending Payouts', value: '₹25,000.00', icon: <Clock size={18} />, bgColor: 'bg-yellow-100' },
    { title: 'Crop Yield Growth', value: '+12.5%', icon: <ArrowUp size={18} className="text-green-500" />, bgColor: 'bg-green-100' },
    { title: 'Total Orders', value: '450', icon: '📦', bgColor: 'bg-purple-100' }
  ];

  const marketPriceData = [
    {
      crop: 'Wheat',
      price: '₹2,450',
      unit: 'per quintal',
      prediction: '₹2,650',
      days: 30,
      trend: '+7.2%',
      trendDirection: 'up',
      bestTimeToSell: '23 Apr'
    },
    {
      crop: 'Rice',
      price: '₹2,450',
      unit: 'per quintal',
      prediction: '₹2,650',
      days: 30,
      trend: '7.2%',
      trendDirection: 'down',
      bestTimeToSell: 'Now'
    },
    {
      crop: 'Tomatoes',
      price: '₹2,450',
      unit: 'per quintal',
      prediction: '₹2,650',
      days: 30,
      trend: '+17.2%',
      trendDirection: 'up',
      bestTimeToSell: '15 Apr'
    }
  ];

  return (
    <>

      <div className="bg-green-50 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Revenue Overview Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
              <select
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            {/* Revenue Chart */}
            <div className="h-64 w-full relative">
              {/* Chart background */}
              <div className="absolute inset-0">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-300/60 to-blue-50/20 rounded-lg"></div>
                </div>
              </div>

              {/* Chart grid lines */}
              <div className="absolute inset-0 grid grid-cols-6 gap-0">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="border-r border-dashed border-gray-300 h-full"></div>
                ))}
              </div>
              <div className="absolute inset-0 grid grid-rows-6 gap-0">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="border-b border-dashed border-gray-300 w-full"></div>
                ))}
              </div>

              {/* Chart labels */}
              <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-500 px-2">
                {revenueData.labels.map((label, index) => (
                  <div key={index} className="text-center">{label}</div>
                ))}
              </div>
              <div className="absolute left-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2">
                <div>₹4,000,000</div>
                <div>₹3,500,000</div>
                <div>₹3,000,000</div>
                <div>₹2,500,000</div>
                <div>₹2,000,000</div>
                <div>₹0</div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {summaryData.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center">
                <div className={`${item.bgColor} w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
                  {typeof item.icon === 'string' ? (
                    <span className="text-lg">{item.icon}</span>
                  ) : (
                    item.icon
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Market Price Prediction */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Market Price Prediction</h2>

            <div className="space-y-4">
              {marketPriceData.map((crop, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{crop.crop}</h3>
                    <span className={`flex items-center ${crop.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {crop.trendDirection === 'up' ? (
                        <ArrowUp size={16} className="mr-1" />
                      ) : (
                        <ArrowDown size={16} className="mr-1" />
                      )}
                      {crop.trend}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{crop.price}</span>
                    <span className="text-sm text-gray-500 ml-2">{crop.unit}</span>
                  </div>

                  <div className="text-sm text-gray-500 mt-2">
                    Predicted in {crop.days} days: {crop.prediction}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-blue-600">Best time to sell</span>
                    <span className={`text-sm px-2 py-1 rounded ${crop.bestTimeToSell === 'Now' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {crop.bestTimeToSell}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insight */}
          <div className="bg-blue-100 rounded-lg p-4 flex items-start">
            <div className="bg-blue-200 rounded-full p-2 mr-3">
              <Info size={20} className="text-blue-700" />
            </div>
            <div>
              <p className="text-blue-800">
                <span className="font-semibold">Market Insight:</span> Wheat prices expected to rise due to export policy changes. Consider holding your stock for 3-4 weeks.
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-green-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Farmer's Analytics</h3>
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
            <p>&copy; {new Date().getFullYear()} AgriAuthentic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Analytics;
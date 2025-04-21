import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, Calendar, Package, Truck, CheckCircle } from 'lucide-react';
import axios from 'axios';

const OrdersComponent = () => {
  // Sample data - would be replaced with API data
  const [orders, setOrders] = useState([]);

  const farmerId = '64b50c9e1c9d440000a1b2d5';

  // State to track which order is expanded
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Function to toggle order expansion
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to determine status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'Shipped':
        return <Truck size={16} className="text-blue-600" />;
      case 'Processing':
        return <Package size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:4009/order/farmer/${farmerId}`);
        console.log(response)
        setOrders(response.data.data)
      } catch (error) {
        console.error(error);
      }
    }

    fetchOrders();
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-800 mt-2">My Orders</h1>
        </div>
      </div>

      {/* Orders Container */}
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              {/* Order Header - Always visible */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${order.status === 'Delivered' ? 'bg-green-50' : order.status === 'Shipped' ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{order.id}</h3>
                      {order.orders.map((ord) => (
                        <div key={ord.consumer_id}>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ord.orderDetail.deliveryStatus)}`}>
                            <span>
                              {ord.orderDetail.deliveryStatus}
                            </span>
                          </span>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar size={14} />
                            <span>Ordered on {ord.orderDetail.orderTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {order.orders.map((ord) => (
                      <div key={ord.consumer_id}>
                        <p className="font-semibold text-gray-900">₹{ord.orderDetail.orderAmount}</p>
                      </div>
                    ))}
                    {/* <p className="text-sm text-gray-500">{order.items.length} items</p> */}
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform ${expandedOrder === order.consumerId ? 'transform rotate-180' : ''}`}
                  />
                </div>
              </div>

              {/* Order Details - Visible when expanded */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-100">
                  {/* Unique expanding card design - slides out from the right */}
                  <div className="relative overflow-hidden transition-all duration-300">
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
                      {/* Order Timeline */}


                      {/* Order Items with animation */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.orders.map((ord) => (
                            <div
                              key={ord.consumer_id}
                              className="flex justify-between items-center p-3 rounded-lg bg-white border border-gray-100 shadow-sm hover:border-indigo-200 transition-all"
                            >
                              <div className="flex items-center gap-3">

                                <div>
                                  <p className="font-medium text-gray-800">{ord.orderDetail.orderedProducts.map((item) => (
                                    <div key={item.item._id}>
                                      <div>
                                        {item.item.productName}
                                      </div>
                                      <p className="text-sm text-gray-500">
                                        {item.item.stock} {item.item.productPrice}
                                      </p>
                                      <p className="font-medium text-gray-800">₹{item.item.productPrice * item.item.stock}</p>
                                    </div>
                                  ))}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h4>
                          {order.orders.map((ord)=>(
                            <div key={ord.consumer_id}>
                              <p className="text-sm text-gray-500">{ord.consumer_address}</p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                          {/* <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                            {order.paymentMethod}
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
            <p className="text-gray-500 mb-4">Looks like you haven't placed any orders yet.</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersComponent;
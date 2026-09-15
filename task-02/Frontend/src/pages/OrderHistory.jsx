import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    setCartCount(cartService.getCartCount());
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrders();
        setOrders(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleBuyAgain = (item) => {
    cartService.addToCart(item, 1);
    setCartCount(cartService.getCartCount());
    navigate('/cart');
  };

  const handleCancelOrder = (order) => {
    navigate('/cancel', {
      state: {
        orderId: order.order_id,
        items: order.items,
        total: order.total
      }
    });
  };

  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(o => (o.status || '').toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <Navbar cartCount={cartCount} />
      
      <div className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-8">
        {/* Page Title & Status Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-600 mt-1">Track your recent purchases, view product details, or request cancellations & refunds.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'Paid', 'Pending', 'Cancelled', 'Expired', 'Failed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  statusFilter === status 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-200">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold text-base">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📦
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No {statusFilter !== 'All' ? statusFilter : ''} Orders Found</h3>
            <p className="text-sm text-gray-500 mb-6">You have not placed any orders matching this status yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const formattedTotal = Number(order.total || order.total_amount || 0).toLocaleString();
              const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'Recent';

              return (
                <div key={order.order_id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Order Card Header */}
                  <div className="bg-slate-800 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-lg text-blue-300">Order #{order.order_id}</span>
                      <span className="text-xs text-gray-300 font-medium">Placed on: {orderDate}</span>
                      {order.payment_method && (
                        <span className="text-xs bg-slate-700 text-gray-200 px-2 py-0.5 rounded">
                          {order.payment_method.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total Amount</span>
                        <span className="font-extrabold text-base text-yellow-400">Rs. {formattedTotal} LKR</span>
                      </div>
                      <OrderStatusBadge status={order.status || 'Pending'} />
                    </div>
                  </div>

                  {/* Order Items List — Matching View Item Design */}
                  <div className="p-6 divide-y divide-gray-100">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => {
                        const itemName = typeof item === 'string' ? item : item.name;
                        const itemQty = typeof item === 'string' ? '' : `x${item.quantity || 1}`;
                        const itemPrice = typeof item === 'string' ? '' : `Rs. ${Number(item.price || 0).toLocaleString()} LKR`;
                        const itemImg = typeof item === 'object' && item.image_url 
                          ? item.image_url 
                          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&h=300&q=80';
                        const itemDesc = typeof item === 'object' && item.description
                          ? item.description
                          : 'High quality item purchased from FastSpace Online Store.';

                        return (
                          <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start">
                            {/* Product Image Thumbnail */}
                            <img 
                              src={itemImg} 
                              alt={itemName} 
                              className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-200 shrink-0 cursor-pointer hover:opacity-90"
                              onClick={() => item.product_id && navigate(`/item/${item.product_id}`)}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=300&q=80'; }}
                            />

                            {/* Item Details */}
                            <div className="flex-1">
                              <h4 
                                onClick={() => item.product_id && navigate(`/item/${item.product_id}`)}
                                className="font-bold text-lg text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                              >
                                {itemName}
                              </h4>
                              
                              <p className="text-sm font-semibold text-blue-700 mt-1">
                                {itemPrice} {itemQty && <span className="text-gray-500 font-normal">({itemQty})</span>}
                              </p>

                              <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                                {itemDesc}
                              </p>
                            </div>

                            {/* Item Quick Actions */}
                            <div className="flex sm:flex-col gap-2 shrink-0 self-center sm:self-auto">
                              {item.product_id && (
                                <button
                                  onClick={() => navigate(`/item/${item.product_id}`)}
                                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-bold transition-all border border-blue-200"
                                >
                                  View Item
                                </button>
                              )}
                              <button
                                onClick={() => handleBuyAgain(typeof item === 'object' ? item : { name: itemName, price: order.total, product_id: 1 })}
                                className="px-3 py-1.5 bg-slate-100 text-gray-800 hover:bg-slate-200 rounded-md text-xs font-bold transition-all border border-gray-300"
                              >
                                Buy Again
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 py-2">No item details available for this order.</p>
                    )}
                  </div>

                  {/* Order Bottom Actions Bar */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-xs">
                    <span className="text-gray-500">FastSpace Order Verification ID: <strong>FS-{order.order_id}</strong></span>

                    <div className="flex gap-3">
                      {(order.status === 'Paid' || order.status === 'Reserved' || order.status === 'Pending') && (
                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 border border-red-300 rounded font-semibold transition-all"
                        >
                          Cancel / Refund Order
                        </button>
                      )}
                      <button
                        onClick={() => navigate('/')}
                        className="px-3 py-1 text-blue-600 hover:underline font-semibold"
                      >
                        Shop More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default OrderHistory;

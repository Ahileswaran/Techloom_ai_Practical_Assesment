import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(cartService.getCartCount());
    orderService.getOrderHistory().then(res => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <Navbar cartCount={cartCount} />
      
      <div className="flex-1 w-full max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-center py-8">No orders found</p>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total (LKR)</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.order_id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">#{order.order_id}</td>
                    <td className="p-3 truncate max-w-xs">{order.items.join(', ')}</td>
                    <td className="p-3 font-semibold">{order.total.toLocaleString()}</td>
                    <td className="p-3">{order.created_at}</td>
                    <td className="p-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="p-3">
                      <a href="#" className="text-blue-600 hover:underline">View Details</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default OrderHistory;

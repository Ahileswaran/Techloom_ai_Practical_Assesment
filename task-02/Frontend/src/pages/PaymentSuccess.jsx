import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [redirectSeconds, setRedirectSeconds] = useState(300);

  // Extract from state with safe fallbacks
  const state = location.state || {};
  let rawItems = state.items;
  let rawTotal = state.total;
  let rawPaymentMethod = state.paymentMethod;
  let rawPaymentDetails = state.paymentDetails;
  let rawUserDetails = state.userDetails;
  let orderId = state.orderId;

  // Fallback: If page refreshed without location.state, recover latest local order
  if (!rawItems || rawItems.length === 0) {
    try {
      const localOrders = orderService.getLocalOrders();
      if (localOrders && localOrders.length > 0) {
        const latest = localOrders[0];
        rawItems = latest.items || [];
        rawTotal = latest.total || 0;
        rawPaymentMethod = latest.payment_method || 'Online Payment';
        orderId = latest.order_id;
        rawUserDetails = latest.userDetails || {};
      }
    } catch (e) {
      console.warn('Fallback recovery error:', e);
    }
  }

  const items = Array.isArray(rawItems) ? rawItems : [];
  const total = Number(rawTotal || 0);
  const paymentMethod = rawPaymentMethod || 'Online Payment';
  const paymentDetails = rawPaymentDetails || {};
  const userDetails = rawUserDetails || {};

  // Save to local orders once on mount
  useEffect(() => {
    try {
      cartService.clearCart();
    } catch (e) {
      console.warn('Cart clear error:', e);
    }

    if (items.length > 0) {
      try {
        orderService.saveLocalOrder({
          order_id: orderId || Math.floor(Math.random() * 900000) + 100000,
          items: items.map(i => ({
            product_id: i.product_id || Math.floor(Math.random() * 10000),
            name: i.name || 'Purchased Item',
            price: parseFloat(i.price) || 0,
            quantity: i.quantity || 1,
            image_url: i.image_url || '',
            description: i.description || ''
          })),
          total: total,
          status: 'Paid',
          created_at: new Date().toISOString().slice(0, 10),
          payment_method: paymentMethod,
          userDetails
        });
      } catch (e) {
        console.error('Error saving local order:', e);
      }
    }
  }, []);

  // Countdown redirect timer
  useEffect(() => {
    if (redirectSeconds <= 0) {
      navigate('/orders');
      return;
    }
    const timer = setInterval(() => {
      setRedirectSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [redirectSeconds, navigate]);

  const mins = Math.floor(redirectSeconds / 60);
  const secs = String(redirectSeconds % 60).padStart(2, '0');

  const getMethodLabel = () => {
    if (paymentMethod === 'card') return '💳 Credit / Debit Card (VISA)';
    if (paymentMethod === 'bank_transfer' || paymentMethod === 'bank') {
      return `🏦 Bank Transfer (${paymentDetails?.bank || 'Sri Lanka Bank'})`;
    }
    if (paymentMethod === 'cash_on_delivery' || paymentMethod === 'cod') return '🚚 Cash on Delivery';
    return paymentMethod || 'Online Payment';
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-blue-800 p-8 rounded-xl max-w-md w-full text-center shadow-2xl border border-blue-700">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl font-bold border border-green-500/40">
          ✓
        </div>
        <h1 className="text-green-400 text-2xl font-bold tracking-wide">Your Payment Success</h1>
        <p className="text-blue-200 text-xs mt-1">Thank you for ordering with FastSpace!</p>

        {orderId && (
          <div className="mt-2 inline-block bg-blue-900/60 text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-600">
            Order #{orderId}
          </div>
        )}

        <h3 className="text-white font-semibold mt-4 mb-2 text-left text-sm uppercase tracking-wider">Order Summary</h3>
        <div className="bg-white rounded-lg p-4 text-left mb-4 text-sm text-gray-800 shadow">
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="font-semibold text-xs text-gray-500 uppercase">Payment Method:</span>
            <p className="font-bold text-blue-700">{getMethodLabel()}</p>
            {userDetails?.name && (
              <p className="text-xs text-gray-600 mt-1">
                Delivering to: <strong className="text-gray-800">{userDetails.name}</strong>
                {userDetails?.address ? ` (${userDetails.address})` : ''}
              </p>
            )}
          </div>

          <div className="max-h-40 overflow-y-auto pr-1 mb-2">
            {items.length === 0 ? (
              <p className="text-gray-500 text-xs italic">Order items processed.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <li key={item.product_id || idx} className="py-1.5 flex justify-between items-center text-xs">
                    <span className="text-gray-700 font-medium truncate max-w-[200px]">
                      {item.name || 'Product'} <span className="text-gray-400">×{item.quantity || 1}</span>
                    </span>
                    <span className="font-semibold text-gray-900">
                      Rs. {((parseFloat(item.price) || 0) * (item.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
            <span className="font-bold text-gray-700">Total Paid:</span>
            <span className="font-extrabold text-base text-green-700">
              Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LKR
            </span>
          </div>
        </div>

        <div className="bg-blue-700/80 border border-blue-600 p-3 rounded-lg mb-6 text-center">
          <p className="text-red-300 font-semibold text-sm">
            Redirecting to My Orders in <span className="font-bold text-white bg-red-600/60 px-2 py-0.5 rounded">{mins}:{secs}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <span>📦</span> View My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow transition-all duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;

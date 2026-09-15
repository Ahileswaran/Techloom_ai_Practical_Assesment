import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [redirectSeconds, setRedirectSeconds] = useState(300); // Wait, prompt says 300, maybe it means 5 minutes? Usually success redirect is fast, but let's stick to state: redirectSeconds(300)

  const { items = [], total = 0, paymentMethod = '', paymentDetails = {}, userDetails = {} } = location.state || {};

  useEffect(() => {
    if (items.length > 0) {
      orderService.saveLocalOrder({
        order_id: location.state?.orderId || Math.floor(Math.random() * 900000) + 100000,
        items: items.map(i => ({
          product_id: i.product_id,
          name: i.name,
          price: parseFloat(i.price) || 0,
          quantity: i.quantity || 1,
          image_url: i.image_url,
          description: i.description
        })),
        total: Number(total || 0),
        status: 'Paid',
        created_at: new Date().toISOString().slice(0, 10),
        payment_method: paymentMethod,
        userDetails
      });
    }
  }, []);

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
      return `🏦 Bank Transfer (${paymentDetails.bank || 'Sri Lanka Bank'})`;
    }
    if (paymentMethod === 'cash_on_delivery' || paymentMethod === 'cod') return '🚚 Cash on Delivery';
    return 'Online Payment';
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-blue-800 p-8 rounded max-w-md w-full text-center shadow-xl">
        <h1 className="text-green-400 text-2xl font-bold">Your Payment Success</h1>
        
        <h3 className="text-white font-semibold mt-4 mb-2 text-left">Order Summary</h3>
        <div className="bg-white rounded p-4 text-left mb-4 text-sm text-gray-800">
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="font-semibold text-xs text-gray-500 uppercase">Payment Method:</span>
            <p className="font-bold text-blue-700">{getMethodLabel()}</p>
            {userDetails.name && (
              <p className="text-xs text-gray-600 mt-0.5">Delivering to: <strong>{userDetails.name}</strong> ({userDetails.address})</p>
            )}
          </div>
          <ul className="list-disc pl-5 mb-2">
            {items.map(item => (
              <li key={item.product_id}>{item.name} x{item.quantity}</li>
            ))}
          </ul>
          <p className="font-bold border-t pt-2 text-base">Total {Number(total).toFixed(2)} LKR</p>
        </div>
        
        <div className="bg-blue-700 p-3 rounded mb-6">
          <p className="text-red-400 font-bold">You will be redirected in {mins}:{secs}</p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => navigate('/orders')}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-bold text-sm shadow transition-all"
          >
            View My Orders
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-bold text-sm shadow transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [redirectSeconds, setRedirectSeconds] = useState(300); // Wait, prompt says 300, maybe it means 5 minutes? Usually success redirect is fast, but let's stick to state: redirectSeconds(300)

  const { items = [], total = 0 } = location.state || {};

  useEffect(() => {
    if (redirectSeconds <= 0) {
      navigate('/');
      return;
    }
    const timer = setInterval(() => {
      setRedirectSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [redirectSeconds, navigate]);

  const mins = Math.floor(redirectSeconds / 60);
  const secs = String(redirectSeconds % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-blue-800 p-8 rounded max-w-md w-full text-center shadow-xl">
        <h1 className="text-green-400 text-2xl font-bold">Your Payment Success</h1>
        
        <h3 className="text-white font-semibold mt-4 mb-2 text-left">Order Summary</h3>
        <div className="bg-white rounded p-4 text-left mb-4">
          <ul className="list-disc pl-5 mb-2">
            {items.map(item => (
              <li key={item.product_id}>{item.name} x{item.quantity}</li>
            ))}
          </ul>
          <p className="font-bold border-t pt-2">Total {(total).toFixed(2)} LKR</p>
        </div>
        
        <div className="bg-blue-700 p-3 rounded mb-6">
          <p className="text-red-400 font-bold">You will be redirected to home in {mins}:{secs}</p>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;

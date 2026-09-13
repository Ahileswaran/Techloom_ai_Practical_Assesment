import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = 0 } = location.state || {};
  const [redirectSeconds, setRedirectSeconds] = useState(300);

  useEffect(() => {
    if (redirectSeconds <= 0) {
      navigate('/');
      return;
    }
    const interval = setInterval(() => {
      setRedirectSeconds(s => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [redirectSeconds, navigate]);

  const min = Math.floor(redirectSeconds / 60);
  const sec = redirectSeconds % 60;
  const timeStr = `${min}:${sec.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-sky-100 p-8 rounded shadow-lg max-w-md w-full">
        <h1 className="text-green-600 text-2xl font-bold text-center mb-6">Your Payment Success</h1>
        
        <h3 className="font-bold text-lg mb-2 text-slate-800">Order Summary</h3>
        <div className="bg-white p-4 rounded mb-4 shadow border border-blue-200">
          <ul className="list-disc pl-5 mb-4 text-black">
            {items.map((item, idx) => (
              <li key={idx}>{item.quantity}x {item.name}</li>
            ))}
          </ul>
          <div className="font-bold text-black border-t pt-2">
            Total {total.toFixed(2)} LKR
          </div>
        </div>
        
        <div className="bg-white p-4 rounded mb-6 text-center shadow border border-blue-200">
          <p className="text-red-600 font-bold">You will be redirected to home in {timeStr}</p>
        </div>
        
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

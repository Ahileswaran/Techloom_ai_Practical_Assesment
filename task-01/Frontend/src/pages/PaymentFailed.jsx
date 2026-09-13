import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = 0, reason = '' } = location.state || {};

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-sky-100 p-8 rounded shadow-lg max-w-md w-full">
        <h1 className="text-red-600 text-2xl font-bold text-center mb-6">Your Payment Failed</h1>
        
        <h3 className="font-bold text-lg mb-2 text-slate-800">Order Summary</h3>
        <div className="bg-white p-4 rounded mb-4 shadow border border-red-200">
          <ul className="list-disc pl-5 mb-4 text-black">
            {items.map((item, idx) => (
              <li key={idx}>{item.quantity}x {item.name}</li>
            ))}
          </ul>
          <div className="font-bold text-black border-t pt-2">
            Total {total.toFixed(2)} LKR
          </div>
        </div>
        
        <div className="bg-white p-4 rounded mb-6 text-center shadow border border-red-200">
          <p className="text-red-600 font-bold text-sm">
            Payment method failed {reason ? `(${reason})` : ''}.<br/>
            Your reserved stock has been released.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded font-bold text-sm"
            onClick={() => navigate('/cancel')}
          >
            Cancel Order
          </button>
          <button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold text-sm"
            onClick={() => navigate('/checkout', { state: { items, total } })}
          >
            Update Payment method
          </button>
        </div>
      </div>
    </div>
  );
}

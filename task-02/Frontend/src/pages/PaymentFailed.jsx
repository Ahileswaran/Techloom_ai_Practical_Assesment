import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = 0 } = location.state || {};

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-blue-800 p-8 rounded max-w-md w-full text-center shadow-xl">
        <h1 className="text-red-500 text-2xl font-bold">Your Payment Failed</h1>
        
        <h3 className="text-white font-semibold mt-4 mb-2 text-left">Order Summary</h3>
        <div className="bg-white rounded p-4 text-left mb-4">
          <ul className="list-disc pl-5 mb-2">
            {items.map(item => (
              <li key={item.product_id}>{item.name} x{item.quantity}</li>
            ))}
          </ul>
          <p className="font-bold border-t pt-2">Total {Number(total || 0).toFixed(2)} LKR</p>
        </div>
        
        <div className="bg-blue-700 p-3 rounded mb-6 text-center">
          <p className="text-red-400 font-bold">Payment method failed. Your reserved stock has been released.</p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => navigate('/cart')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold"
          >
            Update Payment method
          </button>
          <button 
            onClick={() => navigate('/cancel', { state: { items, total, ...location.state } })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailed;

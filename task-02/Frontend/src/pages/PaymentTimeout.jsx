import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentTimeout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-blue-800 p-8 rounded max-w-md w-full text-center shadow-xl">
        <h1 className="text-orange-400 text-2xl font-bold mb-4">Payment Request Timed Out</h1>
        
        <p className="text-white mb-8">
          Your payment session has expired. Your reservation has been released and stock is now available again.
        </p>
        
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

export default PaymentTimeout;

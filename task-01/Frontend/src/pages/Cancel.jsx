import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cancel() {
  const [reason, setReason] = useState('');
  const [cancelled, setCancelled] = useState(false);
  const [refundMethod, setRefundMethod] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col p-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Order Cancellation</h1>
      
      <div className="flex gap-8 max-w-5xl mx-auto w-full">
        {/* LEFT Panel */}
        <div className="flex-1 bg-blue-200 rounded p-6 shadow">
          <h2 className="font-bold text-xl mb-4">Item Details</h2>
          <div className="h-32 w-40 bg-gray-400 rounded mb-4 flex items-center justify-center text-white">
            Image Placeholder
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-bold mb-1">Reason for cancellation</label>
              <input 
                type="text"
                className="w-full p-2 rounded border"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason..."
              />
            </div>
            
            <div>
              <label className="block font-bold mb-1">Category</label>
              <select className="w-full p-2 rounded border bg-white">
                <option>Customer Request</option>
                <option>Payment Failed</option>
                <option>Out of Stock</option>
                <option>Other</option>
              </select>
            </div>
            
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded font-bold mt-2"
              onClick={() => setCancelled(true)}
            >
              Cancel Order
            </button>
            
            {cancelled && (
              <div className="text-green-600 font-bold mt-2">
                Order cancelled successfully
              </div>
            )}
            
            <button 
              className="mt-4 text-sm text-slate-600 underline"
              onClick={() => navigate('/')}
            >
              Return to Dashboard
            </button>
          </div>
        </div>

        {/* RIGHT Panel */}
        <div className="flex-1 bg-white border border-gray-200 rounded p-6 shadow">
          <h3 className="font-bold text-xl mb-6">Refund Methods</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-4 border rounded hover:bg-blue-50">
              <span className="font-bold">Card</span>
              <button 
                className={`px-4 py-2 rounded text-white ${refundMethod === 'Card' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={() => setRefundMethod('Card')}
              >
                {refundMethod === 'Card' ? 'Selected' : 'Select'}
              </button>
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded hover:bg-blue-50">
              <span className="font-bold">Bank Transfer</span>
              <button 
                className={`px-4 py-2 rounded text-white ${refundMethod === 'Bank Transfer' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={() => setRefundMethod('Bank Transfer')}
              >
                {refundMethod === 'Bank Transfer' ? 'Selected' : 'Select'}
              </button>
            </div>
            
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded font-bold mt-6 disabled:opacity-50"
              disabled={!refundMethod || !cancelled}
              onClick={() => alert(`Refund initiated via ${refundMethod}`)}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

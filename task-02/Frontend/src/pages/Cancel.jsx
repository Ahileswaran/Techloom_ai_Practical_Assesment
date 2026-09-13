import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { refundService } from '../services/refundService';

function Cancel() {
  const [reason, setReason] = useState('');
  const [refundMethod, setRefundMethod] = useState('');
  const [cancelled, setCancelled] = useState(false);
  const [refundProcessed, setRefundProcessed] = useState(false);

  const handleCancel = () => {
    setCancelled(true);
  };

  const handleRefund = async () => {
    if (!refundMethod) return;
    await refundService.createRefund(Date.now(), refundMethod);
    setRefundProcessed(true);
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <Navbar cartCount={0} />
      
      <div className="flex-1 w-full max-w-5xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Order Cancellation</h1>
        
        <div className="flex gap-8">
          <div className="flex-1 bg-blue-200 rounded p-6">
            <div className="h-32 w-40 bg-gray-400 rounded mb-4"></div>
            <h3 className="font-bold mb-2">Item Details</h3>
            
            <input 
              type="text" 
              placeholder="Reason for cancellation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mb-2 p-2 rounded"
            />
            
            <select className="w-full mb-4 p-2 rounded">
              <option value="">Select Reason</option>
              <option value="Customer Request">Customer Request</option>
              <option value="Payment Failed">Payment Failed</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Other">Other</option>
            </select>
            
            <button 
              onClick={handleCancel}
              disabled={cancelled}
              className={`w-full py-2 rounded text-white font-bold ${cancelled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Cancel Order
            </button>
            
            {cancelled && <p className="text-green-600 font-bold mt-4 text-center">Order cancelled successfully ✓</p>}
          </div>
          
          <div className="flex-1 bg-white border rounded p-6 shadow">
            <h3 className="font-bold text-lg mb-4">Refund Methods</h3>
            
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <span>Card</span>
              <button 
                onClick={() => setRefundMethod('card')}
                className={`px-4 py-1 rounded text-white ${refundMethod === 'card' ? 'bg-green-500' : 'bg-slate-400'}`}
              >Select</button>
            </div>
            
            <div className="flex justify-between items-center border-b pb-2 mb-6">
              <span>Bank transfer</span>
              <button 
                onClick={() => setRefundMethod('bank')}
                className={`px-4 py-1 rounded text-white ${refundMethod === 'bank' ? 'bg-green-500' : 'bg-slate-400'}`}
              >Select</button>
            </div>
            
            <button 
              onClick={handleRefund}
              disabled={!cancelled || refundProcessed}
              className={`w-full py-2 rounded text-white font-bold ${!cancelled || refundProcessed ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Proceed
            </button>
            
            {refundProcessed && <p className="text-green-600 font-bold mt-4 text-center">Refund initiated successfully ✓</p>}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Cancel;

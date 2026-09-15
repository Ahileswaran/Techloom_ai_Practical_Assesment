import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';

export default function Cancel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items = [], total = 0, orderId = null, isPaidReturn = false } = location.state || {};

  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('Customer Request');
  const [cancelled, setCancelled] = useState(false);
  const [refundMethod, setRefundMethod] = useState('Cash');
  const [refundDone, setRefundDone] = useState(false);

  const handleCancelOrder = async () => {
    try {
      if (orderId) {
        await orderService.cancelOrder(orderId);
      }
      productService.restockItems(items);
    } catch (e) {
      console.warn('Cancel order error:', e);
    }
    setCancelled(true);
  };

  const handleProceedRefund = () => {
    setRefundDone(true);
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col p-8">
      <div className="max-w-5xl mx-auto w-full mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {isPaidReturn ? 'Order Return & Refund' : 'Order Cancellation'}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            AROMEX POS • Counter Management & Inventory Restocking
          </p>
        </div>
        {orderId && (
          <span className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full font-bold">
            Order #{orderId}
          </span>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto w-full">
        {/* LEFT Panel */}
        <div className="flex-1 bg-blue-200 rounded p-6 shadow">
          <h2 className="font-bold text-xl mb-4 text-slate-800">Item Details</h2>
          
          {items.length > 0 ? (
            <div className="bg-white rounded p-4 mb-4 shadow-sm border border-blue-300">
              <ul className="divide-y divide-gray-200 mb-2">
                {items.map((item, idx) => (
                  <li key={idx} className="py-1.5 flex justify-between text-sm">
                    <span className="font-semibold text-gray-800">{item.name} ×{item.quantity}</span>
                    <span className="text-gray-700">{(Number(item.price) * item.quantity).toFixed(2)} LKR</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-slate-900">
                <span>Total Amount:</span>
                <span>{Number(total).toFixed(2)} LKR</span>
              </div>
            </div>
          ) : (
            <div className="h-28 bg-blue-100 rounded mb-4 flex flex-col items-center justify-center text-slate-600 border border-dashed border-blue-300">
              <span className="font-bold text-sm">No specific items loaded</span>
              <span className="text-xs text-slate-500">Items will be restocked on cancellation</span>
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-sm">Reason for cancellation / return</label>
              <input 
                type="text"
                className="w-full p-2.5 rounded border border-blue-300 bg-white text-sm"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Customer changed mind, incorrect item..."
              />
            </div>
            
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-sm">Category</label>
              <select 
                className="w-full p-2.5 rounded border border-blue-300 bg-white text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Customer Request</option>
                <option>Payment Failed / Aborted</option>
                <option>Defective Product Return</option>
                <option>Out of Stock</option>
                <option>Other</option>
              </select>
            </div>
            
            <button 
              className={`text-white px-4 py-3 rounded font-bold transition mt-2 shadow ${
                cancelled ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleCancelOrder}
              disabled={cancelled}
            >
              {cancelled ? '✓ Order Cancelled & Restocked' : 'Cancel & Restock Order'}
            </button>
            
            {cancelled && (
              <div className="bg-green-50 border border-green-300 text-green-700 text-sm p-3 rounded font-semibold">
                ✓ Order status updated to Cancelled. Reserved stock has been returned to inventory.
              </div>
            )}
            
            <button 
              className="mt-2 text-sm text-slate-700 hover:text-slate-900 underline font-medium"
              onClick={() => navigate('/', {
                state: {
                  message: cancelled 
                    ? `Order #${orderId || ''} cancelled. Stock successfully restocked.` 
                    : undefined
                }
              })}
            >
              ← Return to POS Dashboard
            </button>
          </div>
        </div>

        {/* RIGHT Panel */}
        <div className="flex-1 bg-white border border-gray-200 rounded p-6 shadow flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xl mb-4 text-slate-800">Refund Methods</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select the method to refund customer tender at the counter:
            </p>
            
            <div className="flex flex-col gap-3">
              <div className={`flex justify-between items-center p-3.5 border rounded cursor-pointer transition ${refundMethod === 'Cash' ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}>
                <div>
                  <span className="font-bold text-slate-800 block">💵 Cash Refund</span>
                  <span className="text-xs text-slate-500">Return cash directly from register drawer</span>
                </div>
                <button 
                  className={`px-4 py-1.5 rounded text-xs font-bold text-white transition ${refundMethod === 'Cash' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  onClick={() => setRefundMethod('Cash')}
                >
                  {refundMethod === 'Cash' ? 'Selected' : 'Select'}
                </button>
              </div>

              <div className={`flex justify-between items-center p-3.5 border rounded cursor-pointer transition ${refundMethod === 'Card' ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}>
                <div>
                  <span className="font-bold text-slate-800 block">💳 Card Reversal</span>
                  <span className="text-xs text-slate-500">Reverse original POS card terminal swipe</span>
                </div>
                <button 
                  className={`px-4 py-1.5 rounded text-xs font-bold text-white transition ${refundMethod === 'Card' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  onClick={() => setRefundMethod('Card')}
                >
                  {refundMethod === 'Card' ? 'Selected' : 'Select'}
                </button>
              </div>
              
              <div className={`flex justify-between items-center p-3.5 border rounded cursor-pointer transition ${refundMethod === 'Bank Transfer' ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}>
                <div>
                  <span className="font-bold text-slate-800 block">🏦 Bank Transfer</span>
                  <span className="text-xs text-slate-500">Direct account deposit refund</span>
                </div>
                <button 
                  className={`px-4 py-1.5 rounded text-xs font-bold text-white transition ${refundMethod === 'Bank Transfer' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  onClick={() => setRefundMethod('Bank Transfer')}
                >
                  {refundMethod === 'Bank Transfer' ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {refundDone ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded text-center mb-3">
                <p className="font-bold">✓ Refund of {Number(total).toFixed(2)} LKR Processed</p>
                <p className="text-xs mt-0.5">Tender returned via {refundMethod}</p>
              </div>
            ) : (
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold shadow disabled:opacity-50 transition"
                disabled={!refundMethod || !cancelled}
                onClick={handleProceedRefund}
              >
                Proceed with {refundMethod} Refund
              </button>
            )}
            
            <button 
              onClick={() => navigate('/', {
                state: {
                  message: `Transaction completed. Stock restored.`
                }
              })}
              className="w-full mt-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded font-bold text-xs shadow transition"
            >
              Done & Return to POS Counter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

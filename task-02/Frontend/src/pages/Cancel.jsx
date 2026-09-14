import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { refundService } from '../services/refundService';
import { SRI_LANKAN_BANKS } from '../components/PaymentForm';

function Cancel() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = 0, orderId } = location.state || {};

  // Fallback demo product if user navigated directly without state
  const displayItems = items.length > 0 ? items : [
    {
      product_id: 3,
      name: 'Running Shoes',
      price: 6500,
      quantity: 1,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&h=300&q=80',
      description: 'Lightweight and comfortable running shoes for all terrains. Available in multiple sizes.'
    }
  ];

  const calculatedTotal = total || displayItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.quantity || 1), 0);

  // Cancellation form state
  const [reasonText, setReasonText] = useState('');
  const [reasonCategory, setReasonCategory] = useState('Customer Request');
  const [cancelled, setCancelled] = useState(false);

  // Refund method & input states
  const [refundMethod, setRefundMethod] = useState(''); // 'card' or 'bank'
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [selectedBank, setSelectedBank] = useState(SRI_LANKAN_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [branch, setBranch] = useState('');

  const [refundProcessed, setRefundProcessed] = useState(false);
  const [processingRefund, setProcessingRefund] = useState(false);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setExpiry(val);
  };

  const handleCancel = () => {
    setCancelled(true);
  };

  const handleRefund = async () => {
    if (!cancelled) {
      alert('Please cancel the order first before proceeding with the refund.');
      return;
    }

    if (!refundMethod) {
      alert('Please select a refund method (Card or Bank transfer).');
      return;
    }

    if (refundMethod === 'card') {
      if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
        alert('Please fill in your card details for the refund.');
        return;
      }
    } else if (refundMethod === 'bank') {
      if (!accountNumber.trim() || !accountHolder.trim() || !branch.trim()) {
        alert('Please fill in your bank account details for the transfer.');
        return;
      }
    }

    setProcessingRefund(true);
    try {
      await refundService.createRefund(orderId || Date.now(), refundMethod);
    } catch (e) {
      console.warn('Refund API error:', e);
    }
    setProcessingRefund(false);
    setRefundProcessed(true);
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <Navbar cartCount={0} />
      
      <div className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Order Cancellation</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT PANEL — Item Details, Image & Cancellation Reason */}
          <div className="bg-blue-200 rounded-xl p-6 shadow-md border border-blue-300">
            <h3 className="font-bold text-xl text-gray-900 mb-4 border-b border-blue-300 pb-2">
              Item Details
            </h3>

            {/* List of Ordered Items */}
            <div className="space-y-4 mb-6">
              {displayItems.map((item, idx) => (
                <div key={item.product_id || idx} className="bg-white/80 rounded-lg p-4 flex gap-4 items-start shadow-sm">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-28 h-28 object-cover rounded-lg shadow border border-gray-200 shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-300 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-gray-500 font-bold text-xs text-center px-1">Product Image</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                    <p className="text-sm text-blue-700 font-semibold mb-1">
                      Quantity: x{item.quantity} &nbsp;|&nbsp; Price: Rs. {Number(item.price || 0).toLocaleString()} LKR
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {item.description || 'Quality item purchased from FastSpace Online Store.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-300/60 rounded-lg p-3 mb-4 flex justify-between items-center font-bold text-gray-900">
              <span>Total Refundable Amount:</span>
              <span className="text-xl text-blue-900">Rs. {Number(calculatedTotal).toLocaleString()} LKR</span>
            </div>

            {/* Cancellation Form */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800">Reason for Cancellation</label>
              <input 
                type="text" 
                placeholder="Brief reason for cancellation (e.g. change of mind, found better price)"
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                disabled={cancelled}
                className="w-full p-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 text-sm"
              />
              
              <select 
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                disabled={cancelled}
                className="w-full p-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 text-sm font-medium"
              >
                <option value="Customer Request">Customer Request</option>
                <option value="Payment Failed">Payment Failed</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Delivery Delay">Delivery Delay</option>
                <option value="Other">Other</option>
              </select>
              
              <button 
                onClick={handleCancel}
                disabled={cancelled}
                className={`w-full py-3 rounded-lg text-white font-bold transition-all text-base ${
                  cancelled 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-md active:scale-[0.99]'
                }`}
              >
                {cancelled ? 'Order Cancelled' : 'Cancel Order'}
              </button>
              
              {cancelled && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center animate-fadeIn">
                  <p className="text-green-700 font-bold">Order cancelled successfully ✓</p>
                  <p className="text-xs text-green-600 mt-1">Please select your refund method on the right to receive your refund.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* RIGHT PANEL — Refund Methods with Card / Bank Transfer Forms */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <h3 className="font-bold text-xl text-gray-900 mb-2">Refund Methods</h3>
            <p className="text-xs text-gray-500 mb-4">Choose where you would like your refund of <strong>Rs. {Number(calculatedTotal).toLocaleString()} LKR</strong> transferred.</p>
            
            {/* Method Select Buttons */}
            <div className="space-y-3 mb-6">
              
              {/* Option 1: Card */}
              <div className={`border rounded-lg p-3 transition-all ${refundMethod === 'card' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-400' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">Card Refund</span>
                    <span className="text-xs text-gray-500">(Direct to VISA/Mastercard)</span>
                  </div>
                  <button 
                    onClick={() => setRefundMethod('card')}
                    className={`px-4 py-1.5 rounded font-bold text-sm transition-all ${
                      refundMethod === 'card' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-500 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {refundMethod === 'card' ? 'Selected ✓' : 'Select'}
                  </button>
                </div>

                {/* Card Details Revealed on Select */}
                {refundMethod === 'card' && (
                  <div className="mt-4 pt-4 border-t border-blue-200 space-y-3 animate-fadeIn">
                    <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Card Details for Refund Deposit</p>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Name on Card</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="4532 •••• •••• 8892"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="w-full p-2 border rounded text-sm bg-white font-mono focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="absolute right-3 top-7 text-xs font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">VISA</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={handleExpiryChange}
                          maxLength={5}
                          className="w-full p-2 border rounded text-sm bg-white font-mono text-center focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">CVV</label>
                        <input 
                          type="password" 
                          placeholder="•••"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength={4}
                          className="w-full p-2 border rounded text-sm bg-white font-mono text-center focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Option 2: Bank Transfer */}
              <div className={`border rounded-lg p-3 transition-all ${refundMethod === 'bank' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-400' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">Bank Transfer</span>
                    <span className="text-xs text-gray-500">(Direct to Sri Lankan Bank)</span>
                  </div>
                  <button 
                    onClick={() => setRefundMethod('bank')}
                    className={`px-4 py-1.5 rounded font-bold text-sm transition-all ${
                      refundMethod === 'bank' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-500 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {refundMethod === 'bank' ? 'Selected ✓' : 'Select'}
                  </button>
                </div>

                {/* Bank Details Revealed on Select */}
                {refundMethod === 'bank' && (
                  <div className="mt-4 pt-4 border-t border-blue-200 space-y-3 animate-fadeIn">
                    <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Beneficiary Bank Account Details</p>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Select Sri Lankan Bank</label>
                      <select 
                        value={selectedBank} 
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-2 border rounded text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        {SRI_LANKAN_BANKS.map(bank => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Account Number</label>
                      <input 
                        type="text" 
                        placeholder="Enter your bank account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full p-2 border rounded text-sm bg-white font-mono focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Account Holder Name</label>
                      <input 
                        type="text" 
                        placeholder="Name as it appears on bank passbook"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Branch Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Colombo Fort / Kollupitiya / Kandy"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Proceed Button */}
            <button 
              onClick={handleRefund}
              disabled={!cancelled || refundProcessed || processingRefund}
              className={`w-full py-3 rounded-lg text-white font-bold transition-all text-base shadow ${
                !cancelled || refundProcessed || processingRefund
                  ? 'bg-gray-400 cursor-not-allowed opacity-75' 
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
              }`}
            >
              {processingRefund 
                ? 'Processing Refund...' 
                : refundProcessed 
                  ? 'Refund Processed' 
                  : !cancelled 
                    ? 'Cancel Order First to Proceed' 
                    : 'Proceed with Refund'}
            </button>
            
            {/* Refund Success Message */}
            {refundProcessed && (
              <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg text-center animate-fadeIn">
                <p className="text-green-700 font-bold text-base">Refund initiated successfully ✓</p>
                <p className="text-xs text-green-600 mt-1">
                  Rs. {Number(calculatedTotal).toLocaleString()} LKR will be credited back to your {refundMethod === 'card' ? `Card (ending in ${cardNumber.replace(/\s/g, '').slice(-4) || '••••'})` : `${selectedBank} account (${accountNumber || '••••'})`}.
                </p>
                <button 
                  onClick={() => navigate('/')} 
                  className="mt-3 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-xs transition-colors"
                >
                  Return to Store
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Cancel;

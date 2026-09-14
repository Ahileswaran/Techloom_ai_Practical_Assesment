import React, { useState } from 'react';

export const SRI_LANKAN_BANKS = [
  'Commercial Bank of Ceylon',
  'Sampath Bank',
  'Bank of Ceylon (BOC)',
  "People's Bank",
  'Hatton National Bank (HNB)',
  'Nations Trust Bank (NTB)',
  'Seylan Bank',
  'National Development Bank (NDB)',
  'DFCC Bank',
  'Pan Asia Bank',
  'Union Bank of Colombo',
  'Standard Chartered Bank'
];

function PaymentForm({ paymentMethod, total, userDetails, onSubmit, onCancel, processing }) {
  // Card form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Bank transfer form state
  const [selectedBank, setSelectedBank] = useState(SRI_LANKAN_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [depositorName, setDepositorName] = useState('');
  const [branch, setBranch] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (processing) return;

    if (paymentMethod === 'card') {
      if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
        alert('Please fill all card details.');
        return;
      }
      onSubmit({
        method: 'card',
        cardName,
        cardNumber,
        expiry,
        cvv
      });
    } else if (paymentMethod === 'bank') {
      if (!accountNumber.trim() || !depositorName.trim() || !branch.trim()) {
        alert('Please fill the required bank transfer details (Account number, Depositor name, Branch).');
        return;
      }
      onSubmit({
        method: 'bank_transfer',
        bank: selectedBank,
        accountNumber,
        depositorName,
        branch,
        referenceNo: referenceNo || `REF-${Date.now().toString().slice(-6)}`
      });
    } else if (paymentMethod === 'cod') {
      onSubmit({
        method: 'cash_on_delivery'
      });
    }
  };

  if (!paymentMethod) {
    return (
      <div className="mt-4 p-4 bg-blue-700/60 rounded text-center text-sm border border-blue-400/40">
        <p className="text-blue-100 font-medium">Please select a payment method above to proceed.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      {/* 💳 CARD PAYMENT FORM */}
      {paymentMethod === 'card' && (
        <div className="flex flex-col gap-2.5 bg-blue-700/50 p-3 rounded border border-blue-400/40">
          <h5 className="font-bold text-sm text-yellow-300 flex items-center gap-1.5">
            <span>💳</span> Card Details
          </h5>
          <div>
            <label className="block text-xs mb-1 font-semibold text-blue-100">Name on Card *</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              disabled={processing}
              required
              className="w-full text-black px-2 py-1.5 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-xs mb-1 font-semibold text-blue-100">Card number *</label>
            <div className="flex bg-white rounded overflow-hidden pr-2 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400">
              <input 
                type="text" 
                placeholder="4551 2345 6789 0123"
                value={cardNumber}
                onChange={handleCardNumberChange}
                disabled={processing}
                maxLength={19}
                required
                className="flex-1 text-black px-2 py-1.5 text-sm outline-none"
              />
              <span className="text-blue-800 font-bold text-xs flex items-center italic tracking-wider">VISA</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs mb-1 font-semibold text-blue-100">Expiration date *</label>
              <input 
                type="text" 
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                disabled={processing}
                maxLength={5}
                required
                className="w-full text-black px-2 py-1.5 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="w-24">
              <label className="block text-xs mb-1 font-semibold text-blue-100">CVV *</label>
              <input 
                type="password" 
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                disabled={processing}
                maxLength={4}
                required
                className="w-full text-black px-2 py-1.5 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* 🏦 BANK TRANSFER FORM */}
      {paymentMethod === 'bank' && (
        <div className="flex flex-col gap-2.5 bg-blue-700/50 p-3 rounded border border-blue-400/40">
          <h5 className="font-bold text-sm text-yellow-300 flex items-center gap-1.5">
            <span>🏦</span> Sri Lanka Bank Transfer Details
          </h5>

          {/* Store Beneficiary Account Info */}
          <div className="bg-slate-900/80 p-2.5 rounded border border-blue-400/50 text-xs text-blue-100 flex flex-col gap-1">
            <p className="font-bold text-yellow-200">Transfer To FastSpace Store Account:</p>
            <p><span className="text-gray-400">Bank:</span> Commercial Bank of Ceylon</p>
            <p><span className="text-gray-400">Account:</span> <strong className="text-white">8009 2314 9021</strong></p>
            <p><span className="text-gray-400">Branch:</span> Colombo Main Branch</p>
            <p><span className="text-gray-400">Amount:</span> <strong className="text-green-400">{total.toFixed(2)} LKR</strong></p>
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold text-blue-100">Select Your Bank *</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              disabled={processing}
              className="w-full text-black px-2 py-1.5 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {SRI_LANKAN_BANKS.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold text-blue-100">Your Account Number *</label>
            <input 
              type="text" 
              placeholder="e.g. 100234819201"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              disabled={processing}
              required
              className="w-full text-black px-2 py-1.5 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs mb-1 font-semibold text-blue-100">Depositor Name *</label>
              <input 
                type="text" 
                placeholder="Name on slip / account"
                value={depositorName}
                onChange={(e) => setDepositorName(e.target.value)}
                disabled={processing}
                required
                className="w-full text-black px-2 py-1.5 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-1 font-semibold text-blue-100">Branch *</label>
              <input 
                type="text" 
                placeholder="e.g. Kandy / Fort"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                disabled={processing}
                required
                className="w-full text-black px-2 py-1.5 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold text-blue-100">Slip Ref / Txn ID (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. TXN-94812"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              disabled={processing}
              className="w-full text-black px-2 py-1.5 text-sm rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      )}

      {/* 🚚 CASH ON DELIVERY FORM */}
      {paymentMethod === 'cod' && (
        <div className="bg-blue-700/50 p-3 rounded border border-blue-400/40 text-sm flex flex-col gap-2">
          <h5 className="font-bold text-sm text-yellow-300 flex items-center gap-1.5">
            <span>💵</span> Cash on Delivery Confirmation
          </h5>
          <p className="text-xs text-blue-100">
            You will pay in cash upon receiving your order.
          </p>
          <div className="bg-slate-900/80 p-2.5 rounded border border-blue-400/40 text-xs flex flex-col gap-1">
            <p><span className="text-gray-400">Recipient:</span> <strong className="text-white">{userDetails.name || 'Not provided'}</strong></p>
            <p><span className="text-gray-400">Delivery Address:</span> <strong className="text-white">{userDetails.address || 'Not provided'}</strong></p>
            <p><span className="text-gray-400">Amount Due:</span> <strong className="text-green-400">{total.toFixed(2)} LKR</strong></p>
          </div>
          <p className="text-[11px] text-yellow-200">
            * Please keep the exact cash amount ready for the delivery courier.
          </p>
        </div>
      )}

      {/* 🚀 PROCEED TO PAY BUTTON */}
      <button 
        type="submit" 
        disabled={processing}
        className={`w-full py-2.5 rounded font-bold text-sm uppercase tracking-wide transition-all shadow-md ${
          processing 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-yellow-400 hover:bg-yellow-500 text-slate-900 hover:shadow-lg'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : paymentMethod === 'card' ? (
          `Proceed to Pay ${total.toFixed(2)} LKR`
        ) : paymentMethod === 'bank' ? (
          `Submit Transfer & Pay ${total.toFixed(2)} LKR`
        ) : (
          `Confirm & Place COD Order`
        )}
      </button>
      
      {/* CANCEL ORDER BUTTON */}
      <button 
        type="button" 
        onClick={onCancel}
        disabled={processing}
        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm transition-colors"
      >
        Cancel order
      </button>
    </form>
  );
}

export default PaymentForm;

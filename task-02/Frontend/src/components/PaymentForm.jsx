import React, { useState } from 'react';

function PaymentForm({ onSubmit, onCancel }) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submitted) {
      setSubmitted(true);
      onSubmit({ cardName, cardNumber, expiry, cvv });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      <div>
        <label className="block text-sm mb-1">Name on Card</label>
        <input 
          type="text" 
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          disabled={submitted}
          required
          className="w-full text-black px-2 py-1 rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm mb-1">Card number</label>
        <div className="flex bg-white rounded overflow-hidden pr-2">
          <input 
            type="text" 
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            disabled={submitted}
            required
            className="flex-1 text-black px-2 py-1 outline-none"
          />
          <span className="text-blue-800 font-bold flex items-center italic">VISA</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm mb-1">Expiration date</label>
          <input 
            type="text" 
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            disabled={submitted}
            required
            className="w-full text-black px-2 py-1 rounded"
          />
        </div>
        <div className="w-24">
          <label className="block text-sm mb-1">CVV</label>
          <input 
            type="text" 
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            disabled={submitted}
            required
            className="w-full text-black px-2 py-1 rounded"
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={submitted}
        className={`w-full py-2 mt-2 rounded font-bold ${submitted ? 'bg-gray-600' : 'bg-slate-800 hover:bg-slate-900'} text-white`}
      >
        USE THIS CARD
      </button>
      
      <button 
        type="button" 
        onClick={onCancel}
        disabled={submitted}
        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold mt-2"
      >
        Cancel order
      </button>
    </form>
  );
}

export default PaymentForm;

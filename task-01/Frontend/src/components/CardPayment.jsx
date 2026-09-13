import React, { useState } from 'react';

export default function CardPayment({ onDone, onCancel, disabled }) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleDone = () => {
    setSubmitted(true);
    onDone({ cardName, cardNumber, expiry, cvv, method: 'card' });
  };

  return (
    <div className="bg-blue-200 p-4 rounded text-black mt-4">
      <h3 className="font-bold text-lg mb-4">Pay with card</h3>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="font-bold">Scan Card</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Scan</button>
        </div>
        
        <input 
          type="text" 
          placeholder="Name on Card"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <span className="absolute right-2 top-2 font-bold text-blue-800 italic">VISA</span>
        </div>
        
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Expiration date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <input 
            type="text" 
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="w-24 p-2 border rounded"
          />
        </div>
        
        <button className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded font-bold">
          USE THIS CARD
        </button>

        <div className="flex gap-4 mt-2">
          <button 
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded" 
            onClick={onCancel}
            disabled={disabled || submitted}
          >
            Cancel
          </button>
          <button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            onClick={handleDone}
            disabled={disabled || submitted}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

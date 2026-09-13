import React, { useState } from 'react';

export default function CashPayment({ total, onDone, onCancel }) {
  const [paidAmount, setPaidAmount] = useState('');
  
  const parsedPaid = parseFloat(paidAmount || 0);
  const balance = Math.max(0, parsedPaid - total);

  return (
    <div className="bg-blue-200 p-4 rounded text-black">
      <h3 className="font-bold text-lg mb-4">Pay with cash</h3>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="font-bold w-1/3">Total</label>
          <input type="text" readOnly value={total.toFixed(2)} className="flex-1 p-2 border rounded bg-gray-100" />
        </div>
        
        <div className="flex justify-between items-center">
          <label className="font-bold w-1/3">Paid Amount</label>
          <input 
            type="number" 
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <label className="font-bold w-1/3">Balance</label>
          <input type="text" readOnly value={balance.toFixed(2)} className="flex-1 p-2 border rounded bg-gray-100" />
        </div>

        <div className="flex gap-4 mt-4">
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            onClick={() => onDone({ method: 'cash', paidAmount: parsedPaid })}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

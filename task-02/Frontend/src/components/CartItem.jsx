import React from 'react';

function CartItem({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-2">
      <div className="flex-1">
        <p className="font-bold text-gray-800">{item.name} (x{item.quantity})</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-semibold text-gray-800">{(item.price * item.quantity).toFixed(2)} LKR</p>
        <button 
          onClick={() => onRemove(item.product_id)}
          className="text-red-500 hover:text-red-700 font-bold px-2"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default CartItem;

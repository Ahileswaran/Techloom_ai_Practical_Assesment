import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';

function SimilarItems({ items }) {
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    cartService.addToCart(item, 1);
    alert('Added to cart!');
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-blue-600 p-4 rounded text-white">
      <h3 className="font-bold text-lg text-center mb-4">Similar Items</h3>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.product_id} className="flex items-center justify-between gap-2 border-b border-blue-500 pb-2 last:border-0">
            <div className="bg-orange-400 text-white px-2 py-1 rounded text-xs font-bold truncate w-24" title={item.name}>
              {item.name}
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={() => navigate('/item/' + item.product_id)}
                className="bg-white text-blue-600 text-xs px-2 py-1 rounded font-bold hover:bg-gray-200"
              >
                View
              </button>
              <button 
                onClick={() => handleAddToCart(item)}
                disabled={item.stock_quantity === 0}
                className={`text-xs px-2 py-1 rounded font-bold ${item.stock_quantity === 0 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-gray-200'}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarItems;

import React from 'react';

function ProductCard({ product, onAddToCart, onClick }) {
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="flex flex-col bg-white rounded overflow-hidden shadow cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow">
      <div 
        className="h-40 bg-blue-300 relative flex items-center justify-center"
        onClick={() => onClick(product.product_id)}
      >
        <span className="text-blue-800 font-bold opacity-50">Image Placeholder</span>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="text-red-600 font-bold text-xl">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="bg-white px-3 py-2 flex flex-col flex-1 justify-between">
        <div>
          <h3 
            className="font-bold text-gray-800 text-sm truncate mb-1" 
            title={product.name}
            onClick={() => onClick(product.product_id)}
          >
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm font-semibold mb-2">Rs. {product.price.toLocaleString()}</p>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={isOutOfStock}
          className={`w-full py-1 text-sm rounded text-white ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isOutOfStock ? 'Out of stock' : 'add to cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

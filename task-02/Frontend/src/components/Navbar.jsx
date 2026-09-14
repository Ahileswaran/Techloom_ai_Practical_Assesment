import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';

function Navbar({ onSearch, onCategorySelect, cartCount }) {
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  const handleSearch = () => {
    if (onSearch) onSearch(searchTerm);
  };

  const handleCategorySelect = (category) => {
    setShowCategories(false);
    if (onCategorySelect) onCategorySelect(category);
  };

  return (
    <nav className="w-full h-16 bg-slate-800 flex items-center justify-between px-6">
      <div className="text-white flex items-center cursor-pointer" onClick={() => navigate('/')}>
        <span className="font-bold text-2xl">FastSpace</span>
        <span className="ml-2 font-normal text-lg">online Store</span>
      </div>
      
      <div className="flex items-center space-x-2 relative">
        <button 
          onClick={() => setShowCategories(!showCategories)}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Category
        </button>
        {showCategories && (
          <div className="absolute top-12 left-0 w-48 bg-white text-black rounded shadow-lg z-50 py-2">
            <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleCategorySelect('')}>All</div>
            {categories.map(cat => (
              <div 
                key={cat.category_id || cat.name || cat} 
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleCategorySelect(cat.name || cat)}
              >
                {cat.name || cat}
              </div>
            ))}
          </div>
        )}
        
        <input 
          type="text" 
          placeholder="search items" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded w-64"
        />
        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/orders')} 
          className="text-white hover:text-blue-300 font-semibold text-sm transition-colors"
        >
          My Orders
        </button>

        <div className="flex items-center cursor-pointer" onClick={() => navigate('/cart')}>
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

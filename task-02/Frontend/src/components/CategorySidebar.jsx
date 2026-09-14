import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

function CategorySidebar({ selectedCategory, onCategorySelect, filters, onFilterChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);
  
  const handleMinChange = (e) => {
    onFilterChange({ ...filters, minPrice: e.target.value });
  };
  
  const handleMaxChange = (e) => {
    onFilterChange({ ...filters, maxPrice: e.target.value });
  };
  
  const handleStockChange = (e) => {
    onFilterChange({ ...filters, inStockOnly: e.target.checked });
  };

  return (
    <div className="w-56 bg-white p-4 rounded shadow sticky top-4 border-2 border-blue-200">
      <h3 className="font-bold text-black mb-4">Category</h3>
      <ul className="space-y-2 mb-6">
        <li 
          className={`cursor-pointer ${!selectedCategory ? 'font-bold' : ''}`}
          onClick={() => onCategorySelect('')}
        >
          All
        </li>
        {categories.map(cat => (
          <li 
            key={cat.category_id || cat.name || cat}
            className={`cursor-pointer ${selectedCategory === (cat.name || cat) ? 'font-bold' : ''}`}
            onClick={() => onCategorySelect(cat.name || cat)}
          >
            {cat.name || cat}
          </li>
        ))}
      </ul>
      
      <h3 className="font-bold text-black mb-2">Filter results</h3>
      <h4 className="text-gray-600 mb-2">category</h4>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">price range</label>
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            className="w-full border rounded p-1 text-sm"
            value={filters.minPrice}
            onChange={handleMinChange}
          />
          <input 
            type="number" 
            placeholder="Max" 
            className="w-full border rounded p-1 text-sm"
            value={filters.maxPrice}
            onChange={handleMaxChange}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm mb-1">availability</label>
        <label className="flex items-center space-x-2 text-sm cursor-pointer">
          <input 
            type="checkbox" 
            checked={filters.inStockOnly}
            onChange={handleStockChange}
          />
          <span>In stock only</span>
        </label>
      </div>
    </div>
  );
}

export default CategorySidebar;

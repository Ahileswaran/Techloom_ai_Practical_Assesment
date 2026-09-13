import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategorySidebar from '../components/CategorySidebar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', inStockOnly: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  
  const navigate = useNavigate();
  const itemsPerPage = 8;

  useEffect(() => {
    productService.getProducts({}).then(res => {
      setProducts(res.products); // the mock returns a slice, but let's actually just get all from mockProducts and filter locally since the prompt says "Filter effect: when searchTerm, selectedCategory, or filters change: Filter mockProducts"
      // Wait, mock returns sliced. Let's fetch all initially.
      import('../data/mockData').then(module => {
        setProducts(module.mockProducts);
        setFilteredProducts(module.mockProducts);
      });
    });
    setCartCount(cartService.getCartCount());
  }, []);

  useEffect(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice));
    }
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock_quantity > 0);
    }
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, filters, products]);

  const handleAddToCart = (product) => {
    cartService.addToCart(product, 1);
    setCartCount(cartService.getCartCount());
  };

  const handleViewProduct = (id) => {
    navigate('/item/' + id);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const pageProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <Navbar 
        onSearch={setSearchTerm} 
        onCategorySelect={setSelectedCategory} 
        cartCount={cartCount} 
      />
      
      <div className="flex flex-1 p-6 gap-6 max-w-7xl mx-auto w-full">
        <CategorySidebar 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          filters={filters}
          onFilterChange={setFilters}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pageProducts.map(product => (
              <ProductCard 
                key={product.product_id}
                product={product}
                onAddToCart={handleAddToCart}
                onClick={handleViewProduct}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border rounded disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  >
                    {page}
                  </button>
                )
              })}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Home;

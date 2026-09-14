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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', inStockOnly: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();
  const itemsPerPage = 8;

  useEffect(() => {
    setCartCount(cartService.getCartCount());
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productService.getProducts({
          search: searchTerm,
          category: selectedCategory,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          available: filters.inStockOnly ? true : undefined,
          page: currentPage,
          limit: itemsPerPage
        });
        setProducts(result.products || []);
        setTotalPages(result.pages || 1);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [searchTerm, selectedCategory, filters, currentPage]);

  const handleAddToCart = (product) => {
    cartService.addToCart(product, 1);
    setCartCount(cartService.getCartCount());
  };

  const handleViewProduct = (id) => {
    navigate('/item/' + id);
  };

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
            {products.map(product => (
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

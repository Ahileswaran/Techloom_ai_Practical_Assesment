import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SimilarItems from '../components/SimilarItems';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(cartService.getCartCount());
    productService.getProductById(id).then(res => {
      setProduct(res);
      if (res) {
        productService.getSimilarProducts(res.category, id).then(sim => setSimilarProducts(sim));
      }
    });
  }, [id]);

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  const inStock = product.stock_quantity > 0;

  const handleAddToCart = () => {
    cartService.addToCart(product, quantity);
    setCartCount(cartService.getCartCount());
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <Navbar cartCount={cartCount} />
      
      <div className="flex-1 w-full max-w-6xl mx-auto p-6">
        <div className="flex gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-64 bg-blue-300 relative flex items-center justify-center rounded">
              {!inStock && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <span className="text-red-600 font-bold text-3xl">NO STOCK</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="h-12 w-12 bg-gray-400 rounded"></div>
              <div className="h-12 w-12 bg-gray-400 rounded"></div>
              <div className="h-12 w-12 bg-gray-400 rounded"></div>
            </div>
            
            <h2 className="font-bold text-2xl text-gray-800">{product.name}</h2>
            <p className="font-bold text-xl text-blue-800">Rs. {product.price.toLocaleString()}</p>
            
            <div className="flex items-center gap-4 my-2">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border bg-white rounded">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                >-</button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                >+</button>
              </div>
              <span className="text-sm text-gray-600">({product.stock_quantity} available)</span>
            </div>
            
            <div className="flex gap-4 items-center">
              <button 
                onClick={handleBuyNow}
                disabled={!inStock}
                className={`px-6 py-2 rounded text-white font-bold ${!inStock ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Buy now
              </button>
              <button 
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`px-6 py-2 rounded text-white font-bold ${!inStock ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Add to cart
              </button>
              {addedToCart && <span className="text-green-600 font-bold">Added to cart!</span>}
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-2">Product Description</h3>
              <div className="border border-gray-300 p-4 rounded bg-white text-gray-700">
                {product.description}
              </div>
            </div>
          </div>
          
          <div className="w-72">
            <SimilarItems items={similarProducts} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default ItemDetails;

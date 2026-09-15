import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../services/productService';
import InventoryTable from '../components/InventoryTable';
import ItemDetails from '../components/ItemDetails';
import SlipPreview from '../components/SlipPreview';
import Footer from '../components/Footer';
import ReservationTimer from '../components/ReservationTimer';

export default function POSDashboard() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reservationExpired, setReservationExpired] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const loadProducts = () => {
    productService.getProducts().then(setProducts).catch(console.error);
  };

  useEffect(() => {
    loadProducts();
    if (location.state?.message) {
      setBannerMessage(location.state.message);
      // Clean location state so refreshing doesn't duplicate banner
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setBannerMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleAdd = (searchStr, qty) => {
    if (!searchStr) return;
    const prod = products.find(p => p.name.toLowerCase() === searchStr.toLowerCase());
    
    if (prod && prod.stock_quantity >= qty) {
      const existing = selectedItems.find(item => item.product_id === prod.product_id);
      if (existing) {
        setSelectedItems(selectedItems.map(item => 
          item.product_id === prod.product_id ? { ...item, quantity: item.quantity + qty } : item
        ));
      } else {
        setSelectedItems([...selectedItems, { product_id: prod.product_id, name: prod.name, quantity: qty, price: prod.price }]);
      }
      setSearchTerm('');
      setQuantity(1);
    } else if (!prod) {
      alert('Product not found.');
    } else {
      alert('Not enough stock.');
    }
  };

  const handleRemove = (searchStr) => {
    if (searchStr) {
      setSelectedItems(selectedItems.filter(item => item.name.toLowerCase() !== searchStr.toLowerCase()));
      setSearchTerm('');
    } else {
      // Remove last
      setSelectedItems(selectedItems.slice(0, -1));
    }
  };

  const handleClearCart = () => {
    if (selectedItems.length === 0) return;
    productService.restockItems(selectedItems);
    setSelectedItems([]);
    setSearchTerm('');
    setQuantity(1);
    loadProducts();
    setBannerMessage('Selected items cleared and returned to inventory.');
    setTimeout(() => setBannerMessage(''), 4000);
  };

  const total = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    navigate('/checkout', { state: { items: selectedItems, total } });
  };

  const handleTimerExpire = () => {
    setReservationExpired(true);
    alert('Stock reservation expired. Please restart your order.');
    setSelectedItems([]);
  };

  const reservationActive = selectedItems.length > 0;

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <header className="h-16 bg-slate-800 text-white flex items-center justify-between px-6 font-bold text-xl shadow">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 font-extrabold tracking-wider">AROMEX</span>
          <span className="text-sm bg-slate-700 text-gray-300 px-2 py-0.5 rounded font-normal">POS Colombo</span>
        </div>
        <div className="text-xs text-slate-400 font-normal">
          Counter Station 1 • Direct Retail Sales
        </div>
      </header>

      {bannerMessage && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between shadow-md text-sm font-semibold transition-all">
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>{bannerMessage}</span>
          </div>
          <button 
            onClick={() => setBannerMessage('')}
            className="text-white hover:text-gray-200 font-bold px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}
      
      <main className="flex flex-1 overflow-hidden">
        {/* LEFT Panel */}
        <div className="w-1/3 bg-slate-800 p-4 flex flex-col border-r border-slate-700">
          <div className="mb-4">
            <button className="bg-slate-700 text-white px-4 py-2 rounded font-bold">Inventory</button>
          </div>
          <div className="flex-1 bg-blue-200 p-2 rounded overflow-hidden">
            <InventoryTable products={products} />
          </div>
        </div>
        
        {/* CENTRE Panel */}
        <div className="w-1/3 bg-blue-600 p-4 flex flex-col border-r border-blue-500">
          <ItemDetails
            selectedItems={selectedItems}
            onAdd={handleAdd}
            onRemove={handleRemove}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            quantity={quantity}
            onQuantityChange={setQuantity}
            timerDisplay={reservationActive && !reservationExpired ? <ReservationTimer onExpire={handleTimerExpire} /> : null}
            reservationActive={reservationActive}
            onProceed={handleProceedToCheckout}
            onClear={handleClearCart}
          />
        </div>
        
        {/* RIGHT Panel */}
        <div className="w-1/3 bg-slate-800 p-4 flex flex-col">
          <h2 className="text-white font-bold mb-4 bg-slate-700 inline-block px-4 py-2 rounded self-start">Slip Preview</h2>
          <div className="flex-1">
            <SlipPreview items={selectedItems} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
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
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

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
      <header className="h-16 bg-slate-800 text-white flex items-center px-4 font-bold text-xl">
        POS System
      </header>
      
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

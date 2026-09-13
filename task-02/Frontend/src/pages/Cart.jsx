import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import ReservationTimer from '../components/ReservationTimer';
import PaymentForm from '../components/PaymentForm';
import { cartService } from '../services/cartService';
import { reservationService } from '../services/reservationService';
import { paymentService } from '../services/paymentService';
import { v4 as uuidv4 } from 'uuid';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userDetails, setUserDetails] = useState({ name: '', address: '' });
  const [userDetailsSubmitted, setUserDetailsSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cartService.getCart());
    reservationService.reserveStock('temp-order', cartService.getCart());
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id) => {
    cartService.removeFromCart(id);
    setCartItems(cartService.getCart());
  };

  const handlePayment = async (cardDetails) => {
    if (cartItems.length === 0) return alert('Cart is empty');
    setProcessing(true);
    const orderId = Date.now();
    const res = await paymentService.processPayment(orderId, paymentMethod || 'card', total, uuidv4());
    setProcessing(false);
    
    if (res.status === 'success') {
      cartService.clearCart();
      navigate('/payment-success', { state: { items: cartItems, total } });
    } else if (res.status === 'failed') {
      navigate('/payment-failed', { state: { items: cartItems, total } });
    } else {
      navigate('/payment-timeout');
    }
  };

  const handleExpire = () => {
    alert('Reservation expired. Please restart checkout.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <Navbar cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)} />
      
      <div className="flex-1 w-full max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        
        {processing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded text-xl font-bold">Processing payment...</div>
          </div>
        )}
        
        <div className="bg-slate-800 p-6 rounded flex gap-4">
          <div className="flex-1 bg-blue-300 rounded p-4 flex flex-col">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                {cartItems.map(item => (
                  <CartItem key={item.product_id} item={item} onRemove={handleRemove} />
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-blue-400 flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">{total.toFixed(2)} LKR</span>
            </div>
          </div>
          
          <div className="w-64 flex flex-col gap-4">
            <div className="bg-blue-200 rounded p-4">
              <h3 className="font-bold mb-2">User Details</h3>
              <input 
                type="text" 
                placeholder="Name" 
                value={userDetails.name}
                onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
                className="w-full mb-2 p-1 rounded"
              />
              <textarea 
                placeholder="Address" 
                value={userDetails.address}
                onChange={e => setUserDetails({ ...userDetails, address: e.target.value })}
                className="w-full mb-2 p-1 rounded"
              ></textarea>
              <button 
                onClick={() => setUserDetailsSubmitted(true)}
                className="bg-blue-600 text-white px-4 py-1 rounded w-full"
              >
                Done
              </button>
              {userDetailsSubmitted && <p className="text-green-600 font-bold mt-2 text-sm">Details saved ✓</p>}
            </div>
            
            <div className="bg-blue-200 rounded p-4 text-center">
              <ReservationTimer onExpire={handleExpire} />
            </div>
          </div>
          
          <div className="w-80 bg-blue-600 rounded p-4 text-white">
            <h3 className="font-bold text-lg mb-4">Payment Methods</h3>
            
            <div className="flex justify-between items-center mb-2">
              <span>Cash on delivery</span>
              <button 
                onClick={() => setPaymentMethod('cod')}
                className={`px-2 py-1 rounded text-sm ${paymentMethod === 'cod' ? 'bg-green-500' : 'bg-slate-800'}`}
              >Select</button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span>Bank transfer</span>
              <button 
                onClick={() => setPaymentMethod('bank')}
                className={`px-2 py-1 rounded text-sm ${paymentMethod === 'bank' ? 'bg-green-500' : 'bg-slate-800'}`}
              >Select</button>
            </div>
            
            <h4 className="font-bold mb-2">Pay with card</h4>
            <PaymentForm onSubmit={handlePayment} onCancel={() => navigate('/')} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Cart;

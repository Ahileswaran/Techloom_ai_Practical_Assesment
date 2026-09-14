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
  const [cartItems, setCartItems] = useState(() => cartService.getCart());
  const [userDetails, setUserDetails] = useState({ name: '', address: '' });
  const [userDetailsSubmitted, setUserDetailsSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cartService.getCart());
    reservationService.reserveStock('temp-order', cartService.getCart()).catch(() => {});
  }, []);

  const safeCart = Array.isArray(cartItems) ? cartItems : [];
  const total = safeCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (Number(item.quantity) || 1), 0);

  const handleRemove = (id) => {
    const updated = cartService.removeFromCart(id);
    setCartItems(updated);
  };

  const handlePayment = async (paymentData) => {
    if (safeCart.length === 0) return alert('Cart is empty');
    if (!userDetails.name.trim() || !userDetails.address.trim()) {
      alert('Please enter your Name and Address in the User Details section before proceeding to pay!');
      return;
    }
    setProcessing(true);
    const activeMethod = paymentData?.method || paymentMethod || 'card';
    try {
      // 1. Create order in database first to get real order_id and reserve stock
      const order = await orderService.createOrder(safeCart);
      const orderId = order?.order_id || Date.now();

      // 2. Process payment
      const res = await paymentService.processPayment(orderId, activeMethod, total, uuidv4());
      setProcessing(false);
      
      if (res?.status === 'success') {
        cartService.clearCart();
        navigate('/payment-success', { 
          state: { 
            orderId,
            items: safeCart, 
            total, 
            paymentMethod: activeMethod,
            paymentDetails: paymentData,
            userDetails 
          } 
        });
      } else if (res?.status === 'failed') {
        navigate('/payment-failed', { 
          state: { 
            orderId,
            items: safeCart, 
            total, 
            paymentMethod: activeMethod,
            paymentDetails: paymentData,
            userDetails 
          } 
        });
      } else {
        navigate('/payment-timeout', {
          state: {
            orderId,
            items: safeCart,
            total
          }
        });
      }
    } catch (e) {
      console.error('Payment error:', e);
      setProcessing(false);
      if (activeMethod === 'cash_on_delivery') {
        cartService.clearCart();
        navigate('/payment-success', {
          state: {
            items: safeCart,
            total,
            paymentMethod: activeMethod,
            paymentDetails: paymentData,
            userDetails
          }
        });
      } else {
        navigate('/payment-failed', {
          state: {
            items: safeCart,
            total,
            paymentMethod: activeMethod,
            paymentDetails: paymentData,
            userDetails
          }
        });
      }
    }
  };

  const handleExpire = () => {
    alert('Reservation expired. Please restart checkout.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <Navbar cartCount={safeCart.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)} />
      
      <div className="flex-1 w-full max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        
        {processing && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-lg font-bold text-gray-800">Processing Payment with Gateway...</p>
              <p className="text-xs text-gray-500">Checking concurrency & reserving inventory</p>
            </div>
          </div>
        )}
        
        <div className="bg-slate-800 p-6 rounded flex gap-4">
          <div className="flex-1 bg-blue-300 rounded p-4 flex flex-col">
            {safeCart.length === 0 ? (
              <p className="text-gray-700 font-medium">Your cart is empty.</p>
            ) : (
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[460px]">
                {safeCart.map(item => (
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
                placeholder="Name *" 
                value={userDetails.name}
                onChange={e => {
                  setUserDetails({ ...userDetails, name: e.target.value });
                  setUserDetailsSubmitted(false);
                }}
                className="w-full mb-2 p-1.5 text-sm rounded border border-gray-300"
              />
              <textarea 
                placeholder="Address *" 
                value={userDetails.address}
                onChange={e => {
                  setUserDetails({ ...userDetails, address: e.target.value });
                  setUserDetailsSubmitted(false);
                }}
                rows={3}
                className="w-full mb-2 p-1.5 text-sm rounded border border-gray-300"
              ></textarea>
              <button 
                onClick={() => {
                  if (!userDetails.name.trim() || !userDetails.address.trim()) {
                    alert('Please enter both Name and Address.');
                    return;
                  }
                  setUserDetailsSubmitted(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded w-full text-sm transition-colors"
              >
                Done
              </button>
              {userDetailsSubmitted && <p className="text-green-600 font-bold mt-2 text-xs">Details saved ✓</p>}
            </div>
            
            <div className="bg-blue-200 rounded p-4 text-center">
              <ReservationTimer onExpire={handleExpire} />
            </div>
          </div>
          
          <div className="w-96 bg-blue-600 rounded p-4 text-white flex flex-col">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-blue-400/40">
              <h3 className="font-bold text-base">Payment Methods</h3>
              {paymentMethod && (
                <button 
                  onClick={() => setPaymentMethod('')}
                  className="text-xs text-yellow-300 hover:underline font-semibold"
                >
                  Change Method
                </button>
              )}
            </div>
            
            {/* 1. Cash on delivery */}
            <div className="flex justify-between items-center mb-2 p-2 rounded bg-blue-700/40">
              <span className="text-sm font-medium">Cash on delivery</span>
              <button 
                onClick={() => setPaymentMethod('cod')}
                disabled={paymentMethod && paymentMethod !== 'cod'}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  paymentMethod === 'cod' 
                    ? 'bg-green-500 text-white shadow' 
                    : paymentMethod 
                    ? 'bg-gray-600 text-gray-300 opacity-40 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                {paymentMethod === 'cod' ? 'Selected ✓' : 'Select'}
              </button>
            </div>
            
            {/* 2. Bank transfer */}
            <div className="flex justify-between items-center mb-2 p-2 rounded bg-blue-700/40">
              <span className="text-sm font-medium">Bank transfer</span>
              <button 
                onClick={() => setPaymentMethod('bank')}
                disabled={paymentMethod && paymentMethod !== 'bank'}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  paymentMethod === 'bank' 
                    ? 'bg-green-500 text-white shadow' 
                    : paymentMethod 
                    ? 'bg-gray-600 text-gray-300 opacity-40 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                {paymentMethod === 'bank' ? 'Selected ✓' : 'Select'}
              </button>
            </div>

            {/* 3. Pay with card */}
            <div className="flex justify-between items-center mb-2 p-2 rounded bg-blue-700/40">
              <span className="text-sm font-medium">Pay with card</span>
              <button 
                onClick={() => setPaymentMethod('card')}
                disabled={paymentMethod && paymentMethod !== 'card'}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  paymentMethod === 'card' 
                    ? 'bg-green-500 text-white shadow' 
                    : paymentMethod 
                    ? 'bg-gray-600 text-gray-300 opacity-40 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                {paymentMethod === 'card' ? 'Selected ✓' : 'Select'}
              </button>
            </div>
            
            {/* Dynamic Payment Details & Submit Section */}
            <PaymentForm 
              paymentMethod={paymentMethod}
              total={total}
              userDetails={userDetails}
              onSubmit={handlePayment} 
              onCancel={() => navigate('/cancel')}
              processing={processing}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Cart;

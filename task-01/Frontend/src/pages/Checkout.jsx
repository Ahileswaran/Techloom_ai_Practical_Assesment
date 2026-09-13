import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { createOrder } from '../services/orderService';
import { reserveStock } from '../services/reservationService';
import { processPayment } from '../services/paymentService';
import CashPayment from '../components/CashPayment';
import CardPayment from '../components/CardPayment';
import SlipPreview from '../components/SlipPreview';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = 0 } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
      return;
    }
    
    // Initial order creation and stock reservation
    const initOrder = async () => {
      const order = await createOrder(items, total);
      setOrderId(order.order_id);
      await reserveStock(order.order_id, items);
    };
    initOrder();
  }, [items, total, navigate]);

  const handlePayment = async (data) => {
    setProcessing(true);
    const idempotencyKey = uuidv4();
    const result = await processPayment(orderId, data.method, data.paidAmount || total, idempotencyKey);
    setProcessing(false);
    
    if (result.status === 'success') {
      navigate('/payment-success', { state: { items, total } });
    } else if (result.status === 'failed') {
      navigate('/payment-failed', { state: { items, total } });
    } else if (result.status === 'timeout') {
      navigate('/payment-failed', { state: { items, total, reason: 'timeout' } });
    }
  };

  const handleCancel = () => {
    navigate('/cancel');
  };

  return (
    <div className="min-h-screen bg-slate-800 p-8 text-white flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="flex flex-1 gap-6 h-[80vh]">
        {/* LEFT Panel */}
        <div className="w-1/3 bg-slate-700 p-4 rounded flex flex-col">
          <h2 className="font-bold mb-4 bg-slate-600 p-2 inline-block rounded">Check out details</h2>
          <div className="flex-1 bg-white text-black p-4 rounded overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-400 text-white">
                <tr>
                  <th className="p-2 border">Items</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Price LKR</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 font-bold text-right text-lg">
              Total: {total.toFixed(2)} LKR
            </div>
          </div>
        </div>
        
        {/* CENTRE Panel */}
        <div className="w-1/3 bg-slate-700 p-4 rounded flex flex-col relative">
          {processing && (
            <div className="absolute inset-0 bg-slate-800 bg-opacity-75 z-10 flex items-center justify-center rounded">
              <div className="text-xl font-bold">Processing Payment...</div>
            </div>
          )}
          
          <h2 className="font-bold mb-4 bg-slate-600 p-2 inline-block rounded">Payment Methods</h2>
          
          <div className="flex gap-4 mb-4">
            <button 
              className={`flex-1 py-2 rounded font-bold ${paymentMethod === 'cash' ? 'bg-blue-600' : 'bg-slate-600'}`}
              onClick={() => setPaymentMethod('cash')}
            >
              Cash
            </button>
            <button 
              className={`flex-1 py-2 rounded font-bold ${paymentMethod === 'card' ? 'bg-blue-600' : 'bg-slate-600'}`}
              onClick={() => setPaymentMethod('card')}
            >
              Card
            </button>
          </div>
          
          <div className="flex-1 overflow-auto">
            {paymentMethod === 'cash' ? (
              <CashPayment total={total} onDone={handlePayment} onCancel={handleCancel} />
            ) : (
              <CardPayment onDone={handlePayment} onCancel={handleCancel} disabled={processing} />
            )}
          </div>
        </div>
        
        {/* RIGHT Panel */}
        <div className="w-1/3 p-4 rounded bg-slate-700">
          <h2 className="font-bold mb-4 bg-slate-600 p-2 inline-block rounded">Slip Preview</h2>
          <SlipPreview items={items} />
        </div>
      </div>
    </div>
  );
}

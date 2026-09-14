import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://aromex-pos-system-production.up.railway.app';

export const paymentService = {
  async processPayment(orderId, method, amount, idempotencyKey, paidAmount = 0, balance = 0) {
    const res = await axios.post(`${API}/api/payments/process`, {
      order_id: orderId,
      method,
      amount,
      idempotency_key: idempotencyKey,
      paid_amount: paidAmount,
      balance
    });
    return res.data.data;
  }
};

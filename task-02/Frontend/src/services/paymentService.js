import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fastspace-backend-production.up.railway.app';

export const paymentService = {
  async processPayment(orderId, method, amount, idempotencyKey) {
    const res = await axios.post(`${API}/api/payments/process`, {
      order_id: orderId,
      method,
      amount,
      idempotency_key: idempotencyKey
    });
    return res.data.data;
  }
};

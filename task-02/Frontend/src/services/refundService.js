import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fastspace-backend-production.up.railway.app';

export const refundService = {
  async createRefund(orderId, method) {
    const res = await axios.post(`${API}/api/refunds`, { order_id: orderId, method });
    return res.data.data;
  },
  async getRefundStatus(orderId) {
    const res = await axios.get(`${API}/api/refunds/${orderId}`);
    return res.data.data;
  }
};

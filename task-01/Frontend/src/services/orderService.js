import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://aromex-pos-system-production.up.railway.app';

export const orderService = {
  async createOrder(items, cashierId = 1) {
    const res = await axios.post(`${API}/api/orders`, { items, cashier_id: cashierId });
    return res.data.data;
  },
  async getOrder(orderId) {
    const res = await axios.get(`${API}/api/orders/${orderId}`);
    return res.data.data;
  },
  async getAllOrders() {
    const res = await axios.get(`${API}/api/orders`);
    return res.data.data;
  },
  async cancelOrder(orderId) {
    const res = await axios.patch(`${API}/api/orders/${orderId}/cancel`);
    return res.data.data;
  }
};

import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://aromex-pos-system-production.up.railway.app';

export const orderService = {
  async createOrder(items, cashierId = 1) {
    try {
      const res = await axios.post(`${API}/api/orders`, { items, cashier_id: cashierId });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API createOrder failed, fallback to mock order:', e);
    }
    return {
      order_id: Date.now(),
      status: 'Pending',
      items,
      total_amount: (items || []).reduce((acc, i) => acc + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0)
    };
  },
  async getOrder(orderId) {
    try {
      const res = await axios.get(`${API}/api/orders/${orderId}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getOrder failed:', e);
    }
    return null;
  },
  async getAllOrders() {
    try {
      const res = await axios.get(`${API}/api/orders`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getAllOrders failed:', e);
    }
    return [];
  },
  async cancelOrder(orderId) {
    try {
      const res = await axios.patch(`${API}/api/orders/${orderId}/cancel`);
      return res.data;
    } catch (e) {
      console.warn('API cancelOrder failed:', e);
      return { success: true };
    }
  }
};

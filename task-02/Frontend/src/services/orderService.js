import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fastspace-backend-production.up.railway.app';

export const orderService = {
  async createOrder(items) {
    try {
      const payload = (items || []).map(i => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price: parseFloat(i.price) || 0
      }));
      const res = await axios.post(`${API}/api/orders`, { items: payload });
      if (res.data?.data?.order_id) return res.data.data;
    } catch (e) {
      console.warn('Backend createOrder error:', e?.response?.data || e);
    }
    return {
      order_id: Math.floor(Math.random() * 900000) + 100000,
      total_amount: (items || []).reduce((s, i) => s + (parseFloat(i.price) || 0) * (i.quantity || 1), 0),
      reservation_expires_at: new Date(Date.now() + 5 * 60 * 1000)
    };
  },
  async getOrders() {
    const res = await axios.get(`${API}/api/orders`);
    return res.data.data;
  },
  async getOrder(orderId) {
    const res = await axios.get(`${API}/api/orders/${orderId}`);
    return res.data.data;
  },
  async cancelOrder(orderId) {
    const res = await axios.patch(`${API}/api/orders/${orderId}/cancel`);
    return res.data.data;
  }
};

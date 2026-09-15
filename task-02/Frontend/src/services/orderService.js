import axios from 'axios';
import { mockOrders } from '../data/mockData';

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
  saveLocalOrder(order) {
    try {
      const existing = JSON.parse(localStorage.getItem('fastspace_placed_orders') || '[]');
      if (!existing.some(o => o.order_id === order.order_id)) {
        existing.unshift(order);
        localStorage.setItem('fastspace_placed_orders', JSON.stringify(existing));
      }
    } catch (e) {
      console.warn('Failed to save local order:', e);
    }
  },
  getLocalOrders() {
    try {
      return JSON.parse(localStorage.getItem('fastspace_placed_orders') || '[]');
    } catch {
      return [];
    }
  },
  async getOrders() {
    let apiOrders = [];
    try {
      const res = await axios.get(`${API}/api/orders`);
      if (Array.isArray(res.data?.data)) {
        apiOrders = res.data.data.map(o => {
          let parsedItems = o.items;
          if (typeof parsedItems === 'string') {
            try { parsedItems = JSON.parse(parsedItems); } catch {}
          }
          return {
            ...o,
            total: parseFloat(o.total_amount || o.total) || 0,
            items: Array.isArray(parsedItems) ? parsedItems.filter(Boolean) : []
          };
        });
      }
    } catch (e) {
      console.warn('Backend getOrders error:', e?.response?.data || e);
    }

    const localOrders = this.getLocalOrders();
    const combined = [...localOrders];

    for (const o of apiOrders) {
      if (!combined.some(c => c.order_id === o.order_id)) {
        combined.push(o);
      }
    }

    for (const m of (mockOrders || [])) {
      if (!combined.some(c => c.order_id === m.order_id)) {
        combined.push(m);
      }
    }
    return combined;
  },
  async getOrderHistory() {
    return this.getOrders();
  },
  async getOrder(orderId) {
    const all = await this.getOrders();
    return all.find(o => o.order_id === Number(orderId)) || null;
  },
  async cancelOrder(orderId) {
    try {
      const res = await axios.patch(`${API}/api/orders/${orderId}/cancel`);
      return res.data?.data;
    } catch (e) {
      console.warn('API cancelOrder error:', e);
      return { success: true };
    }
  }
};

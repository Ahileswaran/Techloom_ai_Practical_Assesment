import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fastspace-backend-production.up.railway.app';

export const cartService = {
  async getCart() {
    try {
      const res = await axios.get(`${API}/api/cart`);
      const items = res.data.data;
      localStorage.setItem('fastspace_cart', JSON.stringify(items));
      return items;
    } catch {
      return JSON.parse(localStorage.getItem('fastspace_cart') || '[]');
    }
  },
  async addToCart(product, quantity = 1) {
    try {
      await axios.post(`${API}/api/cart`, { product_id: product.product_id, quantity });
    } catch(e) {
      console.error('Add to cart API error:', e);
    }
    // Also update localStorage
    const cart = JSON.parse(localStorage.getItem('fastspace_cart') || '[]');
    const existing = cart.find(i => i.product_id === product.product_id);
    if (existing) existing.quantity += quantity;
    else cart.push({ ...product, quantity });
    localStorage.setItem('fastspace_cart', JSON.stringify(cart));
    return cart;
  },
  async removeFromCart(productId) {
    try {
      // Need to find the cart_item_id. Get cart first.
      const res = await axios.get(`${API}/api/cart`);
      const item = res.data.data.find(i => i.product_id === productId);
      if (item) await axios.delete(`${API}/api/cart/${item.cart_item_id}`);
    } catch(e) {
      console.error('Remove from cart API error:', e);
    }
    const cart = JSON.parse(localStorage.getItem('fastspace_cart') || '[]').filter(i => i.product_id !== productId);
    localStorage.setItem('fastspace_cart', JSON.stringify(cart));
    return cart;
  },
  async clearCart() {
    try {
      await axios.delete(`${API}/api/cart`);
    } catch(e) {
      console.error('Clear cart API error:', e);
    }
    localStorage.removeItem('fastspace_cart');
  },
  getCartCount() {
    const cart = JSON.parse(localStorage.getItem('fastspace_cart') || '[]');
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
};

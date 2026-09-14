import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fastspace-backend-production.up.railway.app';

export const cartService = {
  getCart() {
    try {
      const stored = localStorage.getItem('fastspace_cart');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find(i => i.product_id === product.product_id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + quantity;
    } else {
      cart.push({
        product_id: product.product_id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        quantity,
        image_url: product.image_url
      });
    }
    localStorage.setItem('fastspace_cart', JSON.stringify(cart));
    axios.post(`${API}/api/cart`, { product_id: product.product_id, quantity }).catch(() => {});
    return cart;
  },
  removeFromCart(productId) {
    const cart = this.getCart().filter(i => i.product_id !== productId);
    localStorage.setItem('fastspace_cart', JSON.stringify(cart));
    return cart;
  },
  clearCart() {
    localStorage.removeItem('fastspace_cart');
    axios.delete(`${API}/api/cart`).catch(() => {});
  },
  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }
};

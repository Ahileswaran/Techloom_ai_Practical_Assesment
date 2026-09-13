export const cartService = {
  getCart() {
    return JSON.parse(localStorage.getItem('fastspace_cart')) || [];
  },
  
  addToCart(product, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.product_id === product.product_id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    localStorage.setItem('fastspace_cart', JSON.stringify(cart));
  },
  
  updateCartItem(productId, qty) {
    const cart = this.getCart();
    const existing = cart.find(item => item.product_id === productId);
    if (existing) {
      existing.quantity = qty;
      localStorage.setItem('fastspace_cart', JSON.stringify(cart));
    }
  },
  
  removeFromCart(productId) {
    const cart = this.getCart().filter(item => item.product_id !== productId);
    localStorage.setItem('fastspace_cart', JSON.stringify(cart));
  },
  
  clearCart() {
    localStorage.removeItem('fastspace_cart');
  },
  
  getCartCount() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }
};

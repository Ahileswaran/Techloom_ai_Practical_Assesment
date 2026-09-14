import axios from 'axios';

export const mockProducts = [
  { product_id: 1, name: 'Apple', stock_quantity: 200, price: 250 },
  { product_id: 2, name: 'Noodles', stock_quantity: 65, price: 120 },
  { product_id: 3, name: 'Biscuit', stock_quantity: 34, price: 100 },
  { product_id: 4, name: 'Chocolate', stock_quantity: 279, price: 150 },
  { product_id: 5, name: 'Bread', stock_quantity: 23, price: 150 },
  { product_id: 6, name: 'Tap', stock_quantity: 56, price: 50 },
  { product_id: 7, name: 'Book', stock_quantity: 42, price: 450 },
  { product_id: 8, name: 'Monitor', stock_quantity: 4, price: 11500 },
  { product_id: 9, name: 'Pencil', stock_quantity: 689, price: 40 },
];

const API = import.meta.env.VITE_API_URL || 'https://aromex-pos-system-production.up.railway.app';

export const productService = {
  async getProducts() {
    try {
      const res = await axios.get(`${API}/api/products`);
      const list = res.data?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(p => ({
          ...p,
          price: parseFloat(p.price) || 0,
          stock_quantity: parseInt(p.stock_quantity, 10) || 0
        }));
      }
    } catch (e) {
      console.warn('API getProducts failed, using mock data fallback:', e);
    }
    return mockProducts;
  },
  async getProductById(id) {
    try {
      const res = await axios.get(`${API}/api/products/${id}`);
      const p = res.data?.data;
      if (p) {
        return {
          ...p,
          price: parseFloat(p.price) || 0,
          stock_quantity: parseInt(p.stock_quantity, 10) || 0
        };
      }
    } catch (e) {
      console.warn('API getProductById failed, using mock data fallback:', e);
    }
    return mockProducts.find(p => p.product_id === Number(id)) || null;
  }
};

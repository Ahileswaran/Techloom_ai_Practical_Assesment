import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://aromex-pos-system-production.up.railway.app';

export const productService = {
  async getProducts() {
    const res = await axios.get(`${API}/api/products`);
    return res.data.data;
  },
  async getProductById(id) {
    const res = await axios.get(`${API}/api/products/${id}`);
    return res.data.data;
  }
};

import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fastspace-backend-production.up.railway.app';

export const productService = {
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.available !== undefined) params.append('available', filters.available);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    const res = await axios.get(`${API}/api/products?${params.toString()}`);
    return res.data.data; // { products, total, pages }
  },
  async getProductById(id) {
    const res = await axios.get(`${API}/api/products/${id}`);
    return res.data.data.product;
  },
  async getSimilarProducts(categoryId, excludeId) {
    const res = await axios.get(`${API}/api/products/${excludeId}`);
    return res.data.data.similarProducts || [];
  }
};

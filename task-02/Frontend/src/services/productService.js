import axios from 'axios';
import { mockProducts } from '../data/mockData';

const API = import.meta.env.VITE_API_URL || 'https://fastspace-backend-production.up.railway.app';

export const productService = {
  async getProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.available !== undefined) params.append('available', filters.available);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      const res = await axios.get(`${API}/api/products?${params.toString()}`);
      if (res.data?.data?.products) {
        return {
          products: res.data.data.products.map(p => ({
            ...p,
            price: parseFloat(p.price) || 0,
            stock_quantity: parseInt(p.stock_quantity, 10) || 0
          })),
          total: res.data.data.total,
          pages: res.data.data.pages
        };
      }
    } catch (e) {
      console.warn('Backend getProducts failed, using mockData fallback:', e);
    }
    // Fallback filter on mockProducts
    let filtered = [...mockProducts];
    if (filters.search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }
    if (filters.available) {
      filtered = filtered.filter(p => p.stock_quantity > 0);
    }
    const page = filters.page || 1;
    const limit = filters.limit || 8;
    return {
      products: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
      pages: Math.ceil(filtered.length / limit) || 1
    };
  },
  async getProductById(id) {
    try {
      const res = await axios.get(`${API}/api/products/${id}`);
      const prod = res.data?.data?.product || res.data?.data;
      if (prod) {
        return {
          ...prod,
          price: parseFloat(prod.price) || 0,
          stock_quantity: parseInt(prod.stock_quantity, 10) || 0
        };
      }
    } catch (e) {
      console.warn('Backend getProductById failed, checking mockData:', e);
    }
    return mockProducts.find(p => p.product_id === Number(id)) || null;
  },
  async getSimilarProducts(categoryId, excludeId) {
    try {
      const res = await axios.get(`${API}/api/products/${excludeId}`);
      const similar = res.data?.data?.similar_products || res.data?.data?.similarProducts;
      if (Array.isArray(similar) && similar.length > 0) {
        return similar.map(p => ({
          ...p,
          price: parseFloat(p.price) || 0,
          stock_quantity: parseInt(p.stock_quantity, 10) || 0
        }));
      }
    } catch (e) {
      console.warn('Backend getSimilarProducts failed, checking mockData:', e);
    }
    return mockProducts.filter(p => p.product_id !== Number(excludeId)).slice(0, 4);
  }
};

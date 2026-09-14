import axios from 'axios';
import { mockCategories } from '../data/mockData';

const API = import.meta.env.VITE_API_URL || 'https://fastspace-backend-production.up.railway.app';

export const categoryService = {
  async getCategories() {
    try {
      const res = await axios.get(`${API}/api/categories`);
      if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('Backend getCategories failed, falling back to mockCategories:', e);
    }
    return mockCategories.map((name, idx) => ({ category_id: idx + 1, name }));
  }
};

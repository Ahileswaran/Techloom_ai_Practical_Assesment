import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const categoryService = {
  async getCategories() {
    try {
      const res = await axios.get(`${API}/api/categories`);
      return res.data.data;
    } catch {
      return [];
    }
  }
};

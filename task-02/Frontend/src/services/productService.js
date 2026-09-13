import { mockProducts } from '../data/mockData';

export const productService = {
  async getProducts(filters = {}) {
    return new Promise(resolve => {
      setTimeout(() => {
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
        if (filters.inStockOnly) {
          filtered = filtered.filter(p => p.stock_quantity > 0);
        }
        
        const limit = filters.limit || 8;
        const page = filters.page || 1;
        const start = (page - 1) * limit;
        const slicedArray = filtered.slice(start, start + limit);
        
        resolve({
          products: slicedArray,
          total: filtered.length,
          pages: Math.ceil(filtered.length / limit)
        });
      }, 200);
    });
  },

  async getProductById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockProducts.find(p => p.product_id === parseInt(id)));
      }, 200);
    });
  },

  async getSimilarProducts(category, excludeId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const similar = mockProducts.filter(p => p.category === category && p.product_id !== parseInt(excludeId)).slice(0, 4);
        resolve(similar);
      }, 200);
    });
  }
};

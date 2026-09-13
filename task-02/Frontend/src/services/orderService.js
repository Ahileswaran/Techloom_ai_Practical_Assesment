import { mockOrders } from '../data/mockData';

export const orderService = {
  async createOrder(items, userDetails) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          order_id: Date.now(),
          user: userDetails,
          items,
          total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
          status: 'Pending',
          created_at: new Date().toISOString()
        });
      }, 300);
    });
  },
  
  async getOrderHistory() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockOrders);
      }, 200);
    });
  },
  
  async getOrderById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockOrders.find(o => o.order_id === parseInt(id)));
      }, 200);
    });
  },
  
  async cancelOrder(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: 'Order cancelled' });
      }, 300);
    });
  }
};

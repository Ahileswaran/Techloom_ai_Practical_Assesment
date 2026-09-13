export const refundService = {
  async createRefund(orderId, method) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          refund_id: Date.now(),
          status: 'processed',
          amount: 0,
          method
        });
      }, 500);
    });
  },
  
  async getRefundStatus(orderId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ status: 'processed' });
      }, 200);
    });
  }
};

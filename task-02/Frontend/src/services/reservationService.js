export const reservationService = {
  async reserveStock(orderId, items) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          reservation_id: Date.now(),
          expires_at: new Date(Date.now() + 300000), // 5 minutes
          status: 'active'
        });
      }, 400);
    });
  },
  
  async releaseReservation(reservationId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 200);
    });
  }
};

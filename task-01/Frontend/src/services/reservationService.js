export const reserveStock = async (orderId, items) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reservation_id: Math.floor(Math.random() * 10000),
        expires_at: new Date(Date.now() + 300000)
      });
    }, 300);
  });
};

export const releaseReservation = async (reservationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

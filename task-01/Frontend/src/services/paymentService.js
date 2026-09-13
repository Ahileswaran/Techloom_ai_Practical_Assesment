export const processPayment = async (orderId, method, amount, idempotencyKey) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rand = Math.random();
      if (rand < 0.60) {
        resolve({ status: 'success' });
      } else if (rand < 0.85) {
        resolve({ status: 'failed' });
      } else {
        resolve({ status: 'timeout' });
      }
    }, 1500);
  });
};

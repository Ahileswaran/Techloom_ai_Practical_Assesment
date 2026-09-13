export const createOrder = async (items, total) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        order_id: Math.floor(Math.random() * 1000000),
        status: 'Pending',
        items,
        total
      });
    }, 300);
  });
};

export const cancelOrder = async (orderId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

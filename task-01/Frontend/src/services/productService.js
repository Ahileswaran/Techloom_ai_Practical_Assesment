export const mockProducts = [
  { product_id: 1, name: 'Apple', stock_quantity: 200, price: 250 },
  { product_id: 2, name: 'Noodles', stock_quantity: 65, price: 120 },
  { product_id: 3, name: 'Biscuit', stock_quantity: 34, price: 100 },
  { product_id: 4, name: 'Chocolate', stock_quantity: 279, price: 150 },
  { product_id: 5, name: 'Bread', stock_quantity: 23, price: 150 },
  { product_id: 6, name: 'Tap', stock_quantity: 56, price: 50 },
  { product_id: 7, name: 'Book', stock_quantity: 42, price: 450 },
  { product_id: 8, name: 'Monitor', stock_quantity: 4, price: 11500 },
  { product_id: 9, name: 'Pencil', stock_quantity: 689, price: 40 },
];

export const getProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockProducts]);
    }, 300);
  });
};

export const updateStock = async (productId, qty) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.product_id === productId);
      if (product) {
        product.stock_quantity -= qty;
      }
      resolve({ ...product });
    }, 300);
  });
};

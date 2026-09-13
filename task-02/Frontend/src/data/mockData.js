export const mockCategories = ['Fashion', 'Electronics', 'Mobile', 'TV', 'Kitchen Items'];

export const mockProducts = [
  { product_id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 8500, stock_quantity: 12, description: 'High quality wireless headphones with noise cancellation. Compatible with all Bluetooth devices. 30-hour battery life.' },
  { product_id: 2, name: 'Smart Watch', category: 'Electronics', price: 15000, stock_quantity: 5, description: 'Feature-rich smartwatch with health tracking, GPS, and 7-day battery life.' },
  { product_id: 3, name: 'Running Shoes', category: 'Fashion', price: 6500, stock_quantity: 20, description: 'Lightweight and comfortable running shoes for all terrains. Available in multiple sizes.' },
  { product_id: 4, name: 'Leather Wallet', category: 'Fashion', price: 2500, stock_quantity: 30, description: 'Genuine leather wallet with multiple card slots and coin pocket.' },
  { product_id: 5, name: 'Samsung Galaxy S23', category: 'Mobile', price: 120000, stock_quantity: 8, description: 'Latest Samsung flagship with 200MP camera and 5G connectivity.' },
  { product_id: 6, name: 'iPhone 15', category: 'Mobile', price: 180000, stock_quantity: 0, description: 'Apple iPhone 15 with Dynamic Island and USB-C charging.' },
  { product_id: 7, name: 'LG OLED TV 55"', category: 'TV', price: 250000, stock_quantity: 3, description: 'LG 55 inch OLED 4K TV with Dolby Vision and webOS smart platform.' },
  { product_id: 8, name: 'Air Fryer', category: 'Kitchen Items', price: 12000, stock_quantity: 15, description: '5L capacity air fryer, oil-free cooking with digital display and 8 presets.' },
  { product_id: 9, name: 'Blender Pro', category: 'Kitchen Items', price: 7500, stock_quantity: 0, description: 'Professional grade blender for smoothies, soups, and more. 2-year warranty.' },
  { product_id: 10, name: 'Sony Bravia 50"', category: 'TV', price: 220000, stock_quantity: 4, description: 'Sony Bravia 50 inch 4K HDR smart TV with Google TV and built-in Chromecast.' },
  { product_id: 11, name: 'Casual T-Shirt', category: 'Fashion', price: 1500, stock_quantity: 50, description: 'Comfortable 100% cotton casual T-shirt. Available in 10 colors and all sizes.' },
  { product_id: 12, name: 'Coffee Maker', category: 'Kitchen Items', price: 9000, stock_quantity: 7, description: 'Programmable coffee maker with built-in grinder and thermal carafe. 12-cup capacity.' },
];

export const mockOrders = [
  { order_id: 1001, items: ['Wireless Headphones x1'], total: 8500, status: 'Paid', created_at: '2024-01-15' },
  { order_id: 1002, items: ['Running Shoes x2'], total: 13000, status: 'Cancelled', created_at: '2024-01-10' },
  { order_id: 1003, items: ['Air Fryer x1', 'Coffee Maker x1'], total: 21000, status: 'Expired', created_at: '2024-01-08' },
  { order_id: 1004, items: ['Samsung Galaxy S23 x1'], total: 120000, status: 'Failed', created_at: '2024-01-05' },
];

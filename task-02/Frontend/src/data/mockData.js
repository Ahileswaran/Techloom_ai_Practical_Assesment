export const mockCategories = ['Fashion', 'Electronics', 'Mobile', 'TV', 'Kitchen Items'];

export const mockProducts = [
  {
    product_id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 8500, stock_quantity: 12,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'High quality wireless headphones with noise cancellation. Compatible with all Bluetooth devices. 30-hour battery life.',
  },
  {
    product_id: 2, name: 'Smart Watch', category: 'Electronics', price: 15000, stock_quantity: 5,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Feature-rich smartwatch with health tracking, GPS, and 7-day battery life.',
  },
  {
    product_id: 3, name: 'Running Shoes', category: 'Fashion', price: 6500, stock_quantity: 20,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Lightweight and comfortable running shoes for all terrains. Available in multiple sizes.',
  },
  {
    product_id: 4, name: 'Leather Wallet', category: 'Fashion', price: 2500, stock_quantity: 30,
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Genuine leather wallet with multiple card slots and coin pocket.',
  },
  {
    product_id: 5, name: 'Samsung Galaxy S23', category: 'Mobile', price: 120000, stock_quantity: 8,
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Latest Samsung flagship with 200MP camera and 5G connectivity.',
  },
  {
    product_id: 6, name: 'iPhone 15', category: 'Mobile', price: 180000, stock_quantity: 0,
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Apple iPhone 15 with Dynamic Island and USB-C charging.',
  },
  {
    product_id: 7, name: 'LG OLED TV 55"', category: 'TV', price: 250000, stock_quantity: 3,
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'LG 55 inch OLED 4K TV with Dolby Vision and webOS smart platform.',
  },
  {
    product_id: 8, name: 'Air Fryer', category: 'Kitchen Items', price: 12000, stock_quantity: 15,
    image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&h=300&q=80',
    description: '5L capacity air fryer, oil-free cooking with digital display and 8 presets.',
  },
  {
    product_id: 9, name: 'Blender Pro', category: 'Kitchen Items', price: 7500, stock_quantity: 0,
    image_url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Professional grade blender for smoothies, soups, and more. 2-year warranty.',
  },
  {
    product_id: 10, name: 'Sony Bravia 50"', category: 'TV', price: 220000, stock_quantity: 4,
    image_url: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Sony Bravia 50 inch 4K HDR smart TV with Google TV and built-in Chromecast.',
  },
  {
    product_id: 11, name: 'Casual T-Shirt', category: 'Fashion', price: 1500, stock_quantity: 50,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Comfortable 100% cotton casual T-shirt. Available in 10 colors and all sizes.',
  },
  {
    product_id: 12, name: 'Coffee Maker', category: 'Kitchen Items', price: 9000, stock_quantity: 7,
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe. 12-cup capacity.',
  },
];

export const mockOrders = [
  { 
    order_id: 1001, 
    items: [
      {
        product_id: 1,
        name: 'Wireless Headphones',
        quantity: 1,
        price: 8500,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=300&q=80',
        description: 'High quality wireless headphones with noise cancellation. Compatible with all Bluetooth devices. 30-hour battery life.'
      }
    ], 
    total: 8500, 
    status: 'Paid', 
    created_at: '2024-01-15' 
  },
  { 
    order_id: 1002, 
    items: [
      {
        product_id: 3,
        name: 'Running Shoes',
        quantity: 2,
        price: 6500,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&h=300&q=80',
        description: 'Lightweight and comfortable running shoes for all terrains. Available in multiple sizes.'
      }
    ], 
    total: 13000, 
    status: 'Cancelled', 
    created_at: '2024-01-10' 
  },
  { 
    order_id: 1003, 
    items: [
      {
        product_id: 8,
        name: 'Air Fryer',
        quantity: 1,
        price: 12000,
        image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&h=300&q=80',
        description: '5L capacity air fryer, oil-free cooking with digital display and 8 presets.'
      },
      {
        product_id: 12,
        name: 'Coffee Maker',
        quantity: 1,
        price: 9000,
        image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80',
        description: 'Programmable coffee maker with built-in grinder and thermal carafe. 12-cup capacity.'
      }
    ], 
    total: 21000, 
    status: 'Expired', 
    created_at: '2024-01-08' 
  },
  { 
    order_id: 1004, 
    items: [
      {
        product_id: 5,
        name: 'Samsung Galaxy S23',
        quantity: 1,
        price: 120000,
        image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&h=300&q=80',
        description: 'Latest Samsung flagship with 200MP camera and 5G connectivity.'
      }
    ], 
    total: 120000, 
    status: 'Failed', 
    created_at: '2024-01-05' 
  },
];

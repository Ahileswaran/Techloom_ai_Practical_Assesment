CREATE DATABASE IF NOT EXISTS ecommerce_database;
USE ecommerce_database;

CREATE TABLE categories (
    category_id  INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(50) NOT NULL UNIQUE,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id     INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    description    TEXT,
    category_id    INT NOT NULL,
    price          DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url      VARCHAR(255),
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE users (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(50) NOT NULL,
    last_name   VARCHAR(50) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    address     VARCHAR(255),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    cart_item_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    product_id    INT NOT NULL,
    quantity      INT NOT NULL DEFAULT 1,
    added_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    UNIQUE KEY unique_user_product (user_id, product_id)
);

CREATE TABLE orders (
    order_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    total_amount  DECIMAL(10, 2) NOT NULL,
    status        ENUM('Pending','Reserved','Paid','Cancelled','Expired','Failed') NOT NULL DEFAULT 'Pending',
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    order_item_id     INT AUTO_INCREMENT PRIMARY KEY,
    order_id          INT NOT NULL,
    product_id        INT NOT NULL,
    quantity          INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE reservations (
    reservation_id  INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT NOT NULL,
    product_id      INT NOT NULL,
    quantity        INT NOT NULL,
    reserved_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at      DATETIME NOT NULL,
    status          ENUM('active','expired','completed','released') NOT NULL DEFAULT 'active',
    FOREIGN KEY (order_id)   REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE payments (
    payment_id       INT AUTO_INCREMENT PRIMARY KEY,
    order_id         INT NOT NULL UNIQUE,
    method           ENUM('cash_on_delivery','bank_transfer','card') NOT NULL,
    status           ENUM('success','failed','timeout') NOT NULL,
    amount           DECIMAL(10, 2) NOT NULL,
    idempotency_key  VARCHAR(100) NOT NULL UNIQUE,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE refunds (
    refund_id    INT AUTO_INCREMENT PRIMARY KEY,
    order_id     INT NOT NULL,
    payment_id   INT NOT NULL,
    amount       DECIMAL(10, 2) NOT NULL,
    method       ENUM('card','bank_transfer') NOT NULL,
    status       ENUM('pending','processed') NOT NULL DEFAULT 'pending',
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id)  REFERENCES orders(order_id),
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);

-- Seed categories
INSERT INTO categories (name) VALUES ('Fashion'), ('Electronics'), ('Mobile'), ('TV'), ('Kitchen Items');

-- Seed user
INSERT INTO users (first_name, last_name, email, address) VALUES
('Demo', 'User', 'demo@fastspace.lk', 'No. 42, Galle Road, Colombo 03');

-- Seed products
INSERT INTO products (name, description, category_id, price, stock_quantity, image_url) VALUES
('Wireless Headphones', 'High quality wireless headphones with noise cancellation. 30-hour battery.', 2, 8500.00, 12, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=300&q=80'),
('Smart Watch', 'Feature-rich smartwatch with health tracking, GPS, and 7-day battery.', 2, 15000.00, 5, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&h=300&q=80'),
('Running Shoes', 'Lightweight running shoes for all terrains. Multiple sizes.', 1, 6500.00, 20, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&h=300&q=80'),
('Leather Wallet', 'Genuine leather wallet with multiple card slots.', 1, 2500.00, 30, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&h=300&q=80'),
('Samsung Galaxy S23', 'Samsung flagship with 200MP camera and 5G.', 3, 120000.00, 8, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&h=300&q=80'),
('iPhone 15', 'Apple iPhone 15 with Dynamic Island and USB-C.', 3, 180000.00, 0, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&h=300&q=80'),
('LG OLED TV 55', 'LG 55 inch OLED 4K TV with Dolby Vision.', 4, 250000.00, 3, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&h=300&q=80'),
('Air Fryer', '5L air fryer with digital display and 8 presets.', 5, 12000.00, 15, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&h=300&q=80'),
('Blender Pro', 'Professional blender for smoothies and soups.', 5, 7500.00, 0, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=400&h=300&q=80'),
('Sony Bravia 50', 'Sony 50 inch 4K HDR smart TV with Google TV.', 4, 220000.00, 4, 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=400&h=300&q=80'),
('Casual T-Shirt', 'Cotton casual T-shirt in 10 colors and all sizes.', 1, 1500.00, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&h=300&q=80'),
('Coffee Maker', 'Programmable coffee maker with built-in grinder.', 5, 9000.00, 7, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80');

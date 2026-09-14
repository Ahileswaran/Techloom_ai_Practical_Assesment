CREATE DATABASE IF NOT EXISTS pos_database;
USE pos_database;

CREATE TABLE products (
    product_id    INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    price         DECIMAL(10, 2) NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cashiers (
    cashier_id   INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    station      VARCHAR(50),
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id      INT AUTO_INCREMENT PRIMARY KEY,
    cashier_id    INT,
    total_amount  DECIMAL(10, 2) NOT NULL,
    status        ENUM('Pending','Reserved','Paid','Cancelled','Expired','Failed') NOT NULL DEFAULT 'Pending',
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cashier_id) REFERENCES cashiers(cashier_id)
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
    method           ENUM('cash','card') NOT NULL,
    status           ENUM('success','failed','timeout') NOT NULL,
    amount           DECIMAL(10, 2) NOT NULL,
    idempotency_key  VARCHAR(100) NOT NULL UNIQUE,
    paid_amount      DECIMAL(10, 2) DEFAULT 0,
    balance          DECIMAL(10, 2) DEFAULT 0,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Seed data
INSERT INTO products (name, stock_quantity, price) VALUES
('Apple', 200, 250.00),
('Noodles', 65, 120.00),
('Biscuit', 34, 100.00),
('Chocolate', 279, 150.00),
('Bread', 23, 150.00),
('Tap', 56, 50.00),
('Book', 42, 450.00),
('Monitor', 4, 11500.00),
('Pencil', 689, 40.00);

INSERT INTO cashiers (name, station) VALUES
('Default Cashier', 'Station 1');

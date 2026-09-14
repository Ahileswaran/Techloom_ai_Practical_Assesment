const { pool } = require('../config/db');

const create = async (orderId, productId, quantity, priceAtPurchase, conn = pool) => {
  const [result] = await conn.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
    [orderId, productId, quantity, priceAtPurchase]
  );
  return result.insertId;
};

const getByOrderId = async (orderId) => {
  const [rows] = await pool.query(
    'SELECT oi.*, p.name FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?',
    [orderId]
  );
  return rows;
};

module.exports = {
  create,
  getByOrderId
};

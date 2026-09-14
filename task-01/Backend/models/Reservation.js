const { pool } = require('../config/db');

const create = async (orderId, productId, quantity, expiresAt, conn = pool) => {
  const [result] = await conn.query(
    'INSERT INTO reservations (order_id, product_id, quantity, expires_at, status) VALUES (?, ?, ?, ?, ?)',
    [orderId, productId, quantity, expiresAt, 'active']
  );
  return result.insertId;
};

const getActiveByOrderId = async (orderId) => {
  const [rows] = await pool.query(
    "SELECT * FROM reservations WHERE order_id = ? AND status = 'active'",
    [orderId]
  );
  return rows;
};

const updateStatus = async (id, status, conn = pool) => {
  const [result] = await conn.query(
    'UPDATE reservations SET status = ? WHERE reservation_id = ?',
    [status, id]
  );
  return result;
};

const getExpired = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM reservations WHERE status = 'active' AND expires_at < NOW()"
  );
  return rows;
};

const releaseByOrderId = async (orderId, conn = pool) => {
  const [result] = await conn.query(
    "UPDATE reservations SET status = 'released' WHERE order_id = ? AND status = 'active'",
    [orderId]
  );
  return result;
};

module.exports = {
  create,
  getActiveByOrderId,
  updateStatus,
  getExpired,
  releaseByOrderId
};

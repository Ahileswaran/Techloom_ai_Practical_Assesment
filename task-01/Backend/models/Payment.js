const { pool } = require('../config/db');

const create = async (orderId, method, status, amount, idempotencyKey, paidAmount, balance, conn = pool) => {
  try {
    const [result] = await conn.query(
      'INSERT INTO payments (order_id, method, status, amount, idempotency_key, paid_amount, balance) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orderId, method, status, amount, idempotencyKey, paidAmount, balance]
    );
    return { insertId: result.insertId, existing: false };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const [rows] = await conn.query(
        'SELECT * FROM payments WHERE idempotency_key = ?',
        [idempotencyKey]
      );
      return { payment: rows[0], existing: true };
    }
    throw error;
  }
};

const getByOrderId = async (orderId) => {
  const [rows] = await pool.query('SELECT * FROM payments WHERE order_id = ?', [orderId]);
  return rows;
};

const getByIdempotencyKey = async (key) => {
  const [rows] = await pool.query('SELECT * FROM payments WHERE idempotency_key = ?', [key]);
  return rows.length ? rows[0] : null;
};

module.exports = {
  create,
  getByOrderId,
  getByIdempotencyKey
};

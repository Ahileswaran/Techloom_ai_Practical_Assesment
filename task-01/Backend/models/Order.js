const { pool } = require('../config/db');

const create = async (cashierId, totalAmount, conn = pool) => {
  const [result] = await conn.query(
    'INSERT INTO orders (cashier_id, total_amount, status) VALUES (?, ?, ?)',
    [cashierId, totalAmount, 'Pending']
  );
  return result.insertId;
};

const getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [id]);
  return rows.length ? rows[0] : null;
};

const updateStatus = async (id, status, conn = pool) => {
  const [result] = await conn.query(
    'UPDATE orders SET status = ? WHERE order_id = ?',
    [status, id]
  );
  return result;
};

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return rows;
};

module.exports = {
  create,
  getById,
  updateStatus,
  getAll
};

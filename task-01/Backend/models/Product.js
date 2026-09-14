const { pool } = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY name');
  return rows;
};

const getById = async (id, conn = pool) => {
  const [rows] = await conn.query('SELECT * FROM products WHERE product_id = ?', [id]);
  return rows.length ? rows[0] : null;
};

const updateStock = async (id, quantity, conn = pool) => {
  const [result] = await conn.query(
    'UPDATE products SET stock_quantity = ? WHERE product_id = ?',
    [quantity, id]
  );
  return result;
};

const decrementStock = async (id, qty, conn = pool) => {
  const [result] = await conn.query(
    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ? AND stock_quantity >= ?',
    [qty, id, qty]
  );
  return result.affectedRows;
};

const incrementStock = async (id, qty, conn = pool) => {
  const [result] = await conn.query(
    'UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_id = ?',
    [qty, id]
  );
  return result;
};

module.exports = {
  getAll,
  getById,
  updateStock,
  decrementStock,
  incrementStock
};

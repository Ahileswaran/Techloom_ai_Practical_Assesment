const { pool } = require('../config/db');

exports.create = async (orderId, method, status, amount, idempotencyKey, conn) => {
    const [result] = await conn.query(`
        INSERT INTO payments (order_id, method, status, amount, idempotency_key) 
        VALUES (?, ?, ?, ?, ?)`, [orderId, method, status, amount, idempotencyKey]);
    return result.insertId;
};

exports.getByOrderId = async (orderId) => {
    const [rows] = await pool.query(`
        SELECT * FROM payments WHERE order_id = ?`, [orderId]);
    return rows[0];
};

exports.getByIdempotencyKey = async (key) => {
    const [rows] = await pool.query(`
        SELECT * FROM payments WHERE idempotency_key = ?`, [key]);
    return rows[0];
};

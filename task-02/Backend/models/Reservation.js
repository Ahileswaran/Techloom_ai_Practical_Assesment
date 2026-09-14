const { pool } = require('../config/db');

exports.create = async (orderId, productId, qty, expiresAt, conn) => {
    const [result] = await conn.query(`
        INSERT INTO reservations (order_id, product_id, quantity, expires_at) 
        VALUES (?, ?, ?, ?)`, [orderId, productId, qty, expiresAt]);
    return result.insertId;
};

exports.getActiveByOrderId = async (orderId) => {
    const [rows] = await pool.query(`
        SELECT * FROM reservations WHERE order_id = ? AND status = 'active'`, [orderId]);
    return rows;
};

exports.updateStatus = async (id, status, conn) => {
    const connection = conn || pool;
    const [result] = await connection.query(`
        UPDATE reservations SET status = ? WHERE reservation_id = ?`, [status, id]);
    return result;
};

exports.getExpired = async () => {
    const [rows] = await pool.query(`
        SELECT * FROM reservations WHERE status = 'active' AND expires_at < NOW()`);
    return rows;
};

exports.releaseByOrderId = async (orderId, conn) => {
    const connection = conn || pool;
    const [result] = await connection.query(`
        UPDATE reservations SET status = 'released' WHERE order_id = ? AND status = 'active'`, [orderId]);
    return result;
};

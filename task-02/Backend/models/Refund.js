const { pool } = require('../config/db');

exports.create = async (orderId, paymentId, amount, method, conn) => {
    const connection = conn || pool;
    const [result] = await connection.query(`
        INSERT INTO refunds (order_id, payment_id, amount, method, status) 
        VALUES (?, ?, ?, ?, 'processed')`, [orderId, paymentId, amount, method]);
    return result.insertId;
};

exports.getByOrderId = async (orderId) => {
    const [rows] = await pool.query(`
        SELECT * FROM refunds WHERE order_id = ?`, [orderId]);
    return rows[0];
};

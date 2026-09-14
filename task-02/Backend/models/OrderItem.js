const { pool } = require('../config/db');

exports.create = async (orderId, productId, qty, price, conn) => {
    const [result] = await conn.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
        VALUES (?, ?, ?, ?)`, [orderId, productId, qty, price]);
    return result.insertId;
};

exports.getByOrderId = async (orderId) => {
    const [rows] = await pool.query(`
        SELECT oi.*, p.name 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.product_id 
        WHERE oi.order_id = ?`, [orderId]);
    return rows;
};

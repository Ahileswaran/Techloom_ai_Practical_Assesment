const { pool } = require('../config/db');

exports.create = async (userId, totalAmount, conn) => {
    const [result] = await conn.query(`
        INSERT INTO orders (user_id, total_amount, status) 
        VALUES (?, ?, 'Pending')`, [userId, totalAmount]);
    return result.insertId;
};

exports.getById = async (id) => {
    const [rows] = await pool.query(`
        SELECT o.*, 
            JSON_ARRAYAGG(JSON_OBJECT('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price_at_purchase, 'name', p.name)) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE o.order_id = ?
        GROUP BY o.order_id`, [id]);
    return rows[0];
};

exports.getByUserId = async (userId) => {
    const [rows] = await pool.query(`
        SELECT o.*, 
            COALESCE(
                JSON_ARRAYAGG(
                    IF(oi.order_item_id IS NOT NULL,
                        JSON_OBJECT(
                            'product_id', oi.product_id, 
                            'quantity', oi.quantity, 
                            'price', oi.price_at_purchase, 
                            'name', p.name,
                            'image_url', p.image_url,
                            'description', p.description
                        ),
                        NULL
                    )
                ), 
                JSON_ARRAY()
            ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE o.user_id = ?
        GROUP BY o.order_id
        ORDER BY o.created_at DESC`, [userId]);
    return rows;
};

exports.updateStatus = async (id, status, conn) => {
    const connection = conn || pool;
    const [result] = await connection.query(`
        UPDATE orders SET status = ? WHERE order_id = ?`, [status, id]);
    return result;
};

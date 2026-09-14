const { pool } = require('../config/db');

exports.getByUserId = async (userId) => {
    const [rows] = await pool.query(`
        SELECT ci.*, p.name, p.price, p.image_url 
        FROM cart_items ci 
        JOIN products p ON ci.product_id = p.product_id 
        WHERE ci.user_id = ?`, [userId]);
    return rows;
};

exports.addItem = async (userId, productId, quantity) => {
    const [result] = await pool.query(`
        INSERT INTO cart_items (user_id, product_id, quantity) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = quantity + ?`, 
        [userId, productId, quantity, quantity]);
    return result;
};

exports.updateItem = async (cartItemId, quantity) => {
    const [result] = await pool.query(`
        UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?`, 
        [quantity, cartItemId]);
    return result;
};

exports.removeItem = async (cartItemId) => {
    const [result] = await pool.query(`DELETE FROM cart_items WHERE cart_item_id = ?`, [cartItemId]);
    return result;
};

exports.clearByUserId = async (userId) => {
    const [result] = await pool.query(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);
    return result;
};

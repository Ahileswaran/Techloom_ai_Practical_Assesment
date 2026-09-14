const Cart = require('../models/Cart');
const { pool } = require('../config/db');

exports.getCart = async (req, res, next) => {
    try {
        const userId = 1; // demo
        const cart = await Cart.getByUserId(userId);
        res.json({ success: true, data: cart });
    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const userId = 1; // demo
        const { product_id, quantity } = req.body;
        
        const [productRows] = await pool.query(`SELECT stock_quantity FROM products WHERE product_id = ?`, [product_id]);
        if (!productRows.length || productRows[0].stock_quantity < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
        }
        
        await Cart.addItem(userId, product_id, quantity);
        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        next(error);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        await Cart.updateItem(req.params.id, quantity);
        res.json({ success: true, message: 'Cart item updated' });
    } catch (error) {
        next(error);
    }
};

exports.removeCartItem = async (req, res, next) => {
    try {
        await Cart.removeItem(req.params.id);
        res.json({ success: true, message: 'Cart item removed' });
    } catch (error) {
        next(error);
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const userId = 1; // demo
        await Cart.clearByUserId(userId);
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
};

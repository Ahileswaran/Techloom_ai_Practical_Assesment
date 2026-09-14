const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Reservation = require('../models/Reservation');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Payment = require('../models/Payment');
const Refund = require('../models/Refund');
const { pool } = require('../config/db');

exports.createOrder = async (req, res, next) => {
    let conn;
    try {
        const userId = 1; // demo
        conn = await pool.getConnection();
        await conn.beginTransaction();
        
        const cartItems = await Cart.getByUserId(userId);
        if (cartItems.length === 0) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }
        
        let totalAmount = 0;
        
        // Stock check with row-level locking
        for (const item of cartItems) {
            const [productRows] = await conn.query(`SELECT price, stock_quantity FROM products WHERE product_id = ? FOR UPDATE`, [item.product_id]);
            const product = productRows[0];
            
            if (!product || product.stock_quantity < item.quantity) {
                await conn.rollback();
                return res.status(400).json({ success: false, message: `Insufficient stock for product ID: ${item.product_id}` });
            }
            totalAmount += parseFloat(product.price) * item.quantity;
            item.price = product.price; // Attach price for OrderItem
        }
        
        const orderId = await Order.create(userId, totalAmount, conn);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        
        for (const item of cartItems) {
            await OrderItem.create(orderId, item.product_id, item.quantity, item.price, conn);
            const decremented = await Product.decrementStock(item.product_id, item.quantity, conn);
            if (!decremented) {
                await conn.rollback();
                return res.status(400).json({ success: false, message: 'Stock update failed' });
            }
            await Reservation.create(orderId, item.product_id, item.quantity, expiresAt, conn);
        }
        
        await Order.updateStatus(orderId, 'Reserved', conn);
        await conn.query(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);
        
        await conn.commit();
        res.status(201).json({ success: true, data: { order_id: orderId, total_amount: totalAmount, reservation_expires_at: expiresAt } });
    } catch (error) {
        if (conn) await conn.rollback();
        next(error);
    } finally {
        if (conn) conn.release();
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const userId = 1; // demo
        const orders = await Order.getByUserId(userId);
        res.json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

exports.cancelOrder = async (req, res, next) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        
        const orderId = req.params.id;
        const [orderRows] = await conn.query(`SELECT status FROM orders WHERE order_id = ? FOR UPDATE`, [orderId]);
        
        if (orderRows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        const status = orderRows[0].status;
        
        if (['Cancelled', 'Expired', 'Failed'].includes(status)) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: `Order already ${status}` });
        }
        
        const items = await OrderItem.getByOrderId(orderId);
        
        for (const item of items) {
            await Product.incrementStock(item.product_id, item.quantity, conn);
        }
        
        await Reservation.releaseByOrderId(orderId, conn);
        await Order.updateStatus(orderId, 'Cancelled', conn);
        
        if (status === 'Paid') {
            const payment = await Payment.getByOrderId(orderId);
            if (payment && payment.status === 'success') {
                await Refund.create(orderId, payment.payment_id, payment.amount, payment.method === 'card' ? 'card' : 'bank_transfer', conn);
            }
        }
        
        await conn.commit();
        res.json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
        if (conn) await conn.rollback();
        next(error);
    } finally {
        if (conn) conn.release();
    }
};

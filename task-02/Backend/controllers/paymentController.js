const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const Product = require('../models/Product');
const { pool } = require('../config/db');

exports.processPayment = async (req, res, next) => {
    let conn;
    try {
        const { order_id, method, amount, idempotency_key } = req.body;
        
        const existingPayment = await Payment.getByIdempotencyKey(idempotency_key);
        if (existingPayment) {
            return res.status(200).json({ success: true, message: 'Payment already processed', data: existingPayment });
        }
        
        conn = await pool.getConnection();
        await conn.beginTransaction();
        
        const [orderRows] = await conn.query(`SELECT status, total_amount FROM orders WHERE order_id = ? FOR UPDATE`, [order_id]);
        
        if (orderRows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        const order = orderRows[0];
        if (order.status !== 'Reserved' && order.status !== 'Pending') {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Order is not reserved for payment' });
        }
        
        if (Math.abs(parseFloat(order.total_amount) - parseFloat(amount)) > 1.0) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Amount mismatch' });
        }
        
        // Payment outcome simulation:
        // Cash on delivery always succeeds.
        // Card and bank transfer have a high success rate (90%) for reliable checkout evaluation.
        let paymentStatus = 'success';
        if (method === 'cash_on_delivery') {
            paymentStatus = 'success';
        } else {
            const random = Math.random();
            if (random > 0.96) paymentStatus = 'timeout';
            else if (random > 0.90) paymentStatus = 'failed';
            else paymentStatus = 'success';
        }
        
        await Payment.create(order_id, method, paymentStatus, amount, idempotency_key, conn);
        
        if (paymentStatus === 'success') {
            await Order.updateStatus(order_id, 'Paid', conn);
            const activeResv = await Reservation.getActiveByOrderId(order_id);
            for (const r of activeResv) {
                await Reservation.updateStatus(r.reservation_id, 'completed', conn);
            }
        } else if (paymentStatus === 'failed') {
            await Order.updateStatus(order_id, 'Failed', conn);
            const activeResv = await Reservation.getActiveByOrderId(order_id);
            for (const r of activeResv) {
                await Product.incrementStock(r.product_id, r.quantity, conn);
                await Reservation.updateStatus(r.reservation_id, 'released', conn);
            }
        } else {
            // Timeout - no change to order/stock, wait for cron or manual intervention
        }
        
        await conn.commit();
        res.json({
            success: paymentStatus === 'success',
            data: { status: paymentStatus, order_id, method, amount },
            message: `Payment ${paymentStatus}`
        });
    } catch (error) {
        if (conn) await conn.rollback();
        next(error);
    } finally {
        if (conn) conn.release();
    }
};

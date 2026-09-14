const { pool } = require('../config/db');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Reservation = require('../models/Reservation');

const processPayment = async (req, res, next) => {
  const { order_id, method, amount, idempotency_key, paid_amount = 0, balance = 0 } = req.body;
  const connection = await pool.getConnection();
  
  try {
    const existing = await Payment.getByIdempotencyKey(idempotency_key);
    if (existing) {
      connection.release();
      return res.json({ success: true, data: { payment_id: existing.payment_id, status: existing.status, order_id: existing.order_id }, message: 'Duplicate payment request' });
    }

    const order = await Order.getById(order_id);
    if (!order || order.status !== 'Reserved') {
      connection.release();
      return res.status(400).json({ success: false, message: 'Order is not reserved or does not exist' });
    }

    // Simulate payment
    const rand = Math.random();
    let paymentStatus = 'success';
    if (rand > 0.9) paymentStatus = 'timeout';
    else if (rand > 0.7) paymentStatus = 'failed';

    await connection.beginTransaction();

    if (paymentStatus === 'success') {
      const paymentResult = await Payment.create(order_id, method, 'success', amount, idempotency_key, paid_amount, balance, connection);
      await Order.updateStatus(order_id, 'Paid', connection);
      const [resvs] = await connection.query("SELECT * FROM reservations WHERE order_id = ? AND status = 'active'", [order_id]);
      for (const r of resvs) {
        await Reservation.updateStatus(r.reservation_id, 'completed', connection);
      }
      await connection.commit();
      return res.json({ success: true, data: { payment_id: paymentResult.insertId, status: 'success', order_id } });
    } else if (paymentStatus === 'failed') {
      const paymentResult = await Payment.create(order_id, method, 'failed', amount, idempotency_key, paid_amount, balance, connection);
      await Order.updateStatus(order_id, 'Failed', connection);
      
      const [resvs] = await connection.query("SELECT * FROM reservations WHERE order_id = ? AND status = 'active'", [order_id]);
      for (const r of resvs) {
        await Product.incrementStock(r.product_id, r.quantity, connection);
      }
      await Reservation.releaseByOrderId(order_id, connection);
      await connection.commit();
      return res.json({ success: true, data: { payment_id: paymentResult.insertId, status: 'failed', order_id } });
    } else { // timeout
      const paymentResult = await Payment.create(order_id, method, 'timeout', amount, idempotency_key, paid_amount, balance, connection);
      await Order.updateStatus(order_id, 'Expired', connection);
      
      const [resvs] = await connection.query("SELECT * FROM reservations WHERE order_id = ? AND status = 'active'", [order_id]);
      for (const r of resvs) {
        await Product.incrementStock(r.product_id, r.quantity, connection);
      }
      await Reservation.releaseByOrderId(order_id, connection);
      await connection.commit();
      return res.json({ success: true, data: { payment_id: paymentResult.insertId, status: 'timeout', order_id } });
    }

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

module.exports = {
  processPayment
};

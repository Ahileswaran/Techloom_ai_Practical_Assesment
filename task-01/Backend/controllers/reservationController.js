const { pool } = require('../config/db');
const Reservation = require('../models/Reservation');
const Order = require('../models/Order');
const Product = require('../models/Product');

const getReservation = async (req, res, next) => {
  try {
    const reservations = await Reservation.getActiveByOrderId(req.params.orderId);
    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
};

const releaseReservation = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { orderId } = req.params;
    await connection.beginTransaction();
    
    const reservations = await Reservation.getActiveByOrderId(orderId);
    for (const resv of reservations) {
      await Product.incrementStock(resv.product_id, resv.quantity, connection);
      await Reservation.updateStatus(resv.reservation_id, 'released', connection);
    }
    
    await connection.commit();
    res.json({ success: true, message: 'Reservations released' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const expireReservations = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const [expired] = await connection.query(
      "SELECT * FROM reservations WHERE status = 'active' AND expires_at < NOW() FOR UPDATE"
    );
    
    for (const resv of expired) {
      await Product.incrementStock(resv.product_id, resv.quantity, connection);
      await Reservation.updateStatus(resv.reservation_id, 'expired', connection);
      
      const [activeOthers] = await connection.query(
        "SELECT * FROM reservations WHERE order_id = ? AND status = 'active'",
        [resv.order_id]
      );
      
      if (activeOthers.length === 0) {
        await Order.updateStatus(resv.order_id, 'Expired', connection);
      }
    }
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error expiring reservations:', error);
  } finally {
    connection.release();
  }
};

module.exports = {
  getReservation,
  releaseReservation,
  expireReservations
};

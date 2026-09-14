const Reservation = require('../models/Reservation');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { pool } = require('../config/db');

exports.getReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.getActiveByOrderId(req.params.orderId);
        res.json({ success: true, data: reservations });
    } catch (error) {
        next(error);
    }
};

exports.releaseReservation = async (req, res, next) => {
    try {
        await Reservation.releaseByOrderId(req.params.orderId);
        res.json({ success: true, message: 'Reservations released' });
    } catch (error) {
        next(error);
    }
};

exports.expireReservations = async () => {
    try {
        const expired = await Reservation.getExpired();
        for (const resv of expired) {
            let conn;
            try {
                conn = await pool.getConnection();
                await conn.beginTransaction();
                
                await Product.incrementStock(resv.product_id, resv.quantity, conn);
                await Reservation.updateStatus(resv.reservation_id, 'expired', conn);
                await Order.updateStatus(resv.order_id, 'Expired', conn);
                
                await conn.commit();
            } catch (error) {
                if (conn) await conn.rollback();
                console.error('Error expiring reservation:', error);
            } finally {
                if (conn) conn.release();
            }
        }
    } catch (error) {
        console.error('Error fetching expired reservations:', error);
    }
};

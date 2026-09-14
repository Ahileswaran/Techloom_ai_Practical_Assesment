const { pool } = require('../config/db');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Reservation = require('../models/Reservation');

const createOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { items, cashier_id = 1 } = req.body;
    await connection.beginTransaction();

    let totalAmount = 0;
    const itemsDetails = [];

    for (const item of items) {
      const [productRows] = await connection.query(
        'SELECT * FROM products WHERE product_id = ? FOR UPDATE',
        [item.product_id]
      );
      
      if (!productRows.length) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: `Product ${item.product_id} not found` });
      }

      const product = productRows[0];
      if (product.stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      const price = parseFloat(product.price);
      totalAmount += price * item.quantity;
      itemsDetails.push({
        product_id: product.product_id,
        quantity: item.quantity,
        price_at_purchase: price,
        name: product.name
      });
    }

    const orderId = await Order.create(cashier_id, totalAmount, connection);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    for (const item of itemsDetails) {
      await OrderItem.create(orderId, item.product_id, item.quantity, item.price_at_purchase, connection);
      await Product.decrementStock(item.product_id, item.quantity, connection);
      
      const formattedExpiresAt = expiresAt.toISOString().slice(0, 19).replace('T', ' ');
      await Reservation.create(orderId, item.product_id, item.quantity, formattedExpiresAt, connection);
    }

    await Order.updateStatus(orderId, 'Reserved', connection);
    await connection.commit();

    res.status(201).json({
      success: true,
      data: {
        order_id: orderId,
        total: totalAmount,
        status: 'Reserved',
        items: itemsDetails,
        reservation_expires_at: expiresAt
      }
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const cancelOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const order = await Order.getById(id);
    
    if (!order) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'Paid') {
      connection.release();
      return res.status(400).json({ success: false, message: 'Cannot cancel paid order' });
    }

    await connection.beginTransaction();

    const items = await OrderItem.getByOrderId(id);
    for (const item of items) {
      await Product.incrementStock(item.product_id, item.quantity, connection);
    }

    await Reservation.releaseByOrderId(id, connection);
    await Order.updateStatus(id, 'Cancelled', connection);

    await connection.commit();
    res.json({ success: true, message: 'Order cancelled successfully' });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const items = await OrderItem.getByOrderId(req.params.id);
    order.items = items;
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.getAll();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  cancelOrder,
  getOrder,
  getAllOrders
};

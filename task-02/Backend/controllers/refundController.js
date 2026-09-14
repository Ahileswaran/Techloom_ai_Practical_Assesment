const Refund = require('../models/Refund');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

exports.createRefund = async (req, res, next) => {
    try {
        const { order_id, method } = req.body;
        
        const order = await Order.getById(order_id);
        if (!order || !['Paid', 'Cancelled'].includes(order.status)) {
            return res.status(400).json({ success: false, message: 'Order not eligible for refund' });
        }
        
        const payment = await Payment.getByOrderId(order_id);
        if (!payment || payment.status !== 'success') {
            return res.status(400).json({ success: false, message: 'No successful payment found' });
        }
        
        const refundId = await Refund.create(order_id, payment.payment_id, payment.amount, method);
        res.json({ success: true, data: { refund_id: refundId, amount: payment.amount, status: 'processed' } });
    } catch (error) {
        next(error);
    }
};

exports.getRefundStatus = async (req, res, next) => {
    try {
        const refund = await Refund.getByOrderId(req.params.orderId);
        res.json({ success: true, data: refund });
    } catch (error) {
        next(error);
    }
};

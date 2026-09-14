exports.validateCartItem = (req, res, next) => {
    const { product_id, quantity } = req.body;
    if (!Number.isInteger(product_id)) return res.status(400).json({ success: false, message: 'Invalid product_id' });
    if (!Number.isInteger(quantity) || quantity <= 0) return res.status(400).json({ success: false, message: 'Invalid quantity' });
    next();
};

exports.validateOrder = (req, res, next) => {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ success: false, message: 'Items array is required' });
    next();
};

exports.validatePayment = (req, res, next) => {
    const { order_id, method, amount, idempotency_key } = req.body;
    if (!order_id) return res.status(400).json({ success: false, message: 'order_id required' });
    if (!['cash_on_delivery', 'bank_transfer', 'card'].includes(method)) return res.status(400).json({ success: false, message: 'Invalid payment method' });
    if (!amount) return res.status(400).json({ success: false, message: 'amount required' });
    if (!idempotency_key) return res.status(400).json({ success: false, message: 'idempotency_key required' });
    next();
};

exports.validateRefund = (req, res, next) => {
    const { order_id, method } = req.body;
    if (!order_id) return res.status(400).json({ success: false, message: 'order_id required' });
    if (!['card', 'bank_transfer'].includes(method)) return res.status(400).json({ success: false, message: 'Invalid method' });
    next();
};

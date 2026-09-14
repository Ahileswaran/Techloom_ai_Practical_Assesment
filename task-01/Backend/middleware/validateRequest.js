const validateOrderItems = (req, res, next) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'items must be a non-empty array' });
  }

  for (const item of items) {
    if (!Number.isInteger(item.product_id) || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Each item must have a valid integer product_id and an integer quantity > 0'
      });
    }
  }

  next();
};

const validatePayment = (req, res, next) => {
  const { order_id, method, amount, idempotency_key } = req.body;

  if (!order_id) {
    return res.status(400).json({ success: false, message: 'order_id is required' });
  }

  if (!['cash', 'card'].includes(method)) {
    return res.status(400).json({ success: false, message: 'method must be "cash" or "card"' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ success: false, message: 'amount must be a positive number' });
  }

  if (typeof idempotency_key !== 'string' || idempotency_key.trim() === '') {
    return res.status(400).json({ success: false, message: 'idempotency_key must be a non-empty string' });
  }

  next();
};

module.exports = {
  validateOrderItems,
  validatePayment
};

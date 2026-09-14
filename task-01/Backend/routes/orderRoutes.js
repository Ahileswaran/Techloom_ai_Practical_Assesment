const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateOrderItems } = require('../middleware/validateRequest');

router.post('/', validateOrderItems, orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;

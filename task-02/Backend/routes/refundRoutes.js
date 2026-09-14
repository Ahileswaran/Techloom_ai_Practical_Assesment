const express = require('express');
const router = express.Router();
const refundController = require('../controllers/refundController');
const { validateRefund } = require('../middleware/validateRequest');

router.post('/', validateRefund, refundController.createRefund);
router.get('/:orderId', refundController.getRefundStatus);

module.exports = router;

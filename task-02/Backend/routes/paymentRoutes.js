const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validatePayment } = require('../middleware/validateRequest');

router.post('/process', validatePayment, paymentController.processPayment);

module.exports = router;

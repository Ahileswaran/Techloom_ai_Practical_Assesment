const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/:orderId', reservationController.getReservations);
router.delete('/:orderId', reservationController.releaseReservation);

module.exports = router;

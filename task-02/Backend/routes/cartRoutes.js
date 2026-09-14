const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { validateCartItem } = require('../middleware/validateRequest');

router.get('/', cartController.getCart);
router.post('/', validateCartItem, cartController.addToCart);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

module.exports = router;

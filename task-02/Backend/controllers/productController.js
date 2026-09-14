const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
    try {
        const result = await Product.getAll(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        
        const similar = await Product.getSimilar(product.category_id, product.product_id);
        res.json({ success: true, data: { ...product, similar_products: similar } });
    } catch (error) {
        next(error);
    }
};

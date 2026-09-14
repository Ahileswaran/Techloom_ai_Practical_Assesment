const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.getAll();
        res.json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

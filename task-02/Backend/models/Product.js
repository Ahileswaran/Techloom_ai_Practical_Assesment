const { pool } = require('../config/db');

exports.getAll = async (filters) => {
    let query = `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE 1=1
    `;
    const params = [];
    
    if (filters.search) {
        query += ` AND p.name LIKE ?`;
        params.push(`%${filters.search}%`);
    }
    if (filters.category) {
        query += ` AND c.name = ?`;
        params.push(filters.category);
    }
    if (filters.minPrice) {
        query += ` AND p.price >= ?`;
        params.push(filters.minPrice);
    }
    if (filters.maxPrice) {
        query += ` AND p.price <= ?`;
        params.push(filters.maxPrice);
    }
    if (filters.available === 'true') {
        query += ` AND p.stock_quantity > 0`;
    }
    
    // Count total for pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as count_table`;
    const [countRows] = await pool.query(countQuery, params);
    const total = countRows[0].total;
    
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const offset = (page - 1) * limit;
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const [products] = await pool.query(query, params);
    return {
        products,
        total,
        pages: Math.ceil(total / limit)
    };
};

exports.getById = async (id) => {
    const [rows] = await pool.query(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.category_id 
        WHERE p.product_id = ?`, [id]);
    return rows[0];
};

exports.getSimilar = async (categoryId, excludeId) => {
    const [rows] = await pool.query(`
        SELECT * FROM products 
        WHERE category_id = ? AND product_id != ? 
        LIMIT 4`, [categoryId, excludeId]);
    return rows;
};

exports.decrementStock = async (id, qty, conn) => {
    const [result] = await conn.query(`
        UPDATE products 
        SET stock_quantity = stock_quantity - ? 
        WHERE product_id = ? AND stock_quantity >= ?`, [qty, id, qty]);
    return result.affectedRows > 0;
};

exports.incrementStock = async (id, qty, conn) => {
    const [result] = await conn.query(`
        UPDATE products 
        SET stock_quantity = stock_quantity + ? 
        WHERE product_id = ?`, [qty, id]);
    return result.affectedRows > 0;
};

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { testConnection } = require('./config/db');

const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const refundRoutes = require('./routes/refundRoutes');
const { expireReservations } = require('./controllers/reservationController');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/refunds', refundRoutes);

app.use(errorHandler);

cron.schedule('* * * * *', () => {
    console.log('Running reservation expiration check...');
    expireReservations();
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await testConnection();
});

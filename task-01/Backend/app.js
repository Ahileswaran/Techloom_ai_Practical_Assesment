require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { testConnection } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { expireReservations } = require('./controllers/reservationController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'AROMEX POS API is running',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      reservations: '/api/reservations'
    }
  });
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);

cron.schedule('*/60 * * * * *', async () => {
  console.log('Running reservation expiration cron job...');
  await expireReservations();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await testConnection();
});

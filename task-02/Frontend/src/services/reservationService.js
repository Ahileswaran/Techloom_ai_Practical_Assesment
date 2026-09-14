import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fastspace-backend-production.up.railway.app';

export const reservationService = {
  async reserveStock(orderId, items) {
    // Reservation happens automatically when order is created
    return { reservation_id: orderId, expires_in: 300 };
  },
  async getReservation(orderId) {
    const res = await axios.get(`${API}/api/reservations/${orderId}`);
    return res.data.data;
  },
  async releaseReservation(orderId) {
    const res = await axios.delete(`${API}/api/reservations/${orderId}`);
    return res.data;
  }
};

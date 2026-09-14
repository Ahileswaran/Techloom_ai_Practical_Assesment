import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://aromex-pos-system-production.up.railway.app';

export const reservationService = {
  async getReservation(orderId) {
    const res = await axios.get(`${API}/api/reservations/${orderId}`);
    return res.data.data;
  },
  async releaseReservation(orderId) {
    const res = await axios.delete(`${API}/api/reservations/${orderId}`);
    return res.data;
  }
};

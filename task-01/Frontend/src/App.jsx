import { Routes, Route } from 'react-router-dom';
import POSDashboard from './pages/POSDashboard';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Cancel from './pages/Cancel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<POSDashboard />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
  );
}

export default App;

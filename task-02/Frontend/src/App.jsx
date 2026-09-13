import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ItemDetails from './pages/ItemDetails'
import Cart from './pages/Cart'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import PaymentTimeout from './pages/PaymentTimeout'
import Cancel from './pages/Cancel'
import OrderHistory from './pages/OrderHistory'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/item/:id" element={<ItemDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      <Route path="/payment-timeout" element={<PaymentTimeout />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/orders" element={<OrderHistory />} />
    </Routes>
  )
}

export default App

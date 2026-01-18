import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// Pages (to be created)
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Checkout from './pages/Checkout'
import Pricing from './pages/Pricing'
import Leaderboard from './pages/Leaderboard'
import Chat from './pages/Chat'
import Admin from './pages/Admin'
import Contact from './pages/Contact'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/auth/login" element={<Layout><Login /></Layout>} />
      <Route path="/auth/register" element={<Layout><Register /></Layout>} />
      <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />

      <Route path="/checkout" element={<Layout><ProtectedRoute><Checkout /></ProtectedRoute></Layout>} />
      <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
      <Route path="/chat" element={<Layout><ProtectedRoute><Chat /></ProtectedRoute></Layout>} />
      <Route path="/admin" element={<Layout><ProtectedRoute role="admin"><Admin /></ProtectedRoute></Layout>} />
    </Routes>
  )
}

export default App
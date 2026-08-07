import React from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Form from './Form'
import OrdersPanel from './OrdersPanel'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider, useAuth } from '../context/AuthContext'

function AppShell() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div id="app">
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/order">Order</NavLink>
        {isAuthenticated && (
          <NavLink to="/orders">My Orders</NavLink>
        )}
      </nav>

      {isAuthenticated && (
        <div className="session-bar">
          Signed in as {user.displayName}
          <button type="button" className="btn ghost tiny" onClick={logout}>
            Log out
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
        <Route
          path="/orders"
          element={(
            <ProtectedRoute>
              <OrdersPanel />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App

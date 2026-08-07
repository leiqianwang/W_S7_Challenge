import React from 'react'
import { useNavigate } from 'react-router-dom'
import pizza from './images/pizza.jpg'
import { useAuth } from '../context/AuthContext'
import AuthPanel from './AuthPanel'
import OrdersPanel from './OrdersPanel'

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handlePizzaClick = () => {
    navigate('/order')
  }

  return (
    <div className="home-page">
      <h2>Welcome to Bloom Pizza!</h2>
      <img
        alt="order-pizza"
        onClick={handlePizzaClick}
        style={{ cursor: 'pointer' }}
        src={pizza}
      />

      {isAuthenticated ? (
        <OrdersPanel />
      ) : (
        <>
          <p className="home-lead">
            Sign in or create an account to submit pizzas, track status, and change or cancel
            within the size-based time window (up to 20 minutes for large).
          </p>
          <AuthPanel />
        </>
      )}
    </div>
  )
}

export default Home

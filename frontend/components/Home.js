import React from 'react'
import { useNavigate } from 'react-router-dom'
import pizza from './images/pizza.jpg'

function Home() {
  const navigate = useNavigate()

  const handlePizzaClick = () => {
    navigate('/order')
  }

  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      <img
        alt="order-pizza"
        onClick={handlePizzaClick}
        style={{ cursor: 'pointer' }}
        src={pizza}
      />
    </div>
  )
}

export default Home

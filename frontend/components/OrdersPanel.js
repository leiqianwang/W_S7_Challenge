import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchActiveOrders, fetchOrderHistory } from '../api/orderApi'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import OrderCard from './OrderCard'

export default function OrdersPanel() {
  const { user, logout } = useAuth()
  const [activeOrders, setActiveOrders] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('active')

  const load = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    setError('')
    try {
      const [activeRes, historyRes] = await Promise.all([
        fetchActiveOrders(user.id),
        fetchOrderHistory(user.id),
      ])
      setActiveOrders(activeRes.data || [])
      setHistory(historyRes.data || [])
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load orders'))
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])

  const list = tab === 'active' ? activeOrders : history

  return (
    <section className="orders-panel">
      <div className="account-banner">
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <p className="account-sub">@{user.username} · account #{user.id}</p>
        </div>
        <div className="account-actions">
          <Link className="btn" to="/order">Order pizza</Link>
          <button type="button" className="btn ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      <div className="auth-tabs">
        <button
          type="button"
          className={tab === 'active' ? 'tab active' : 'tab'}
          onClick={() => setTab('active')}
        >
          Active ({activeOrders.length})
        </button>
        <button
          type="button"
          className={tab === 'history' ? 'tab active' : 'tab'}
          onClick={() => setTab('history')}
        >
          History ({history.length})
        </button>
      </div>

      {error && <div className="failure">{error}</div>}
      {loading && <p className="muted">Loading orders…</p>}

      {!loading && list.length === 0 && (
        <p className="muted">
          {tab === 'active'
            ? 'No active orders. Place a new pizza order to get started.'
            : 'No past orders yet.'}
        </p>
      )}

      <div className="orders-list">
        {list.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            userId={user.id}
            onChanged={load}
          />
        ))}
      </div>
    </section>
  )
}

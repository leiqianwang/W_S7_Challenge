import React, { useEffect, useState } from 'react'
import { cancelOrder, updateOrder } from '../api/orderApi'
import { getErrorMessage } from '../api/client'
import { formatCountdown, SIZE_LABELS, SIZE_WINDOWS, useEditCountdown } from '../utils/orderTime'

const TOPPING_OPTIONS = [
  { id: 1, name: 'Pepperoni' },
  { id: 2, name: 'Green Peppers' },
  { id: 3, name: 'Pineapple' },
  { id: 4, name: 'Mushrooms' },
  { id: 5, name: 'Ham' },
]

export default function OrderCard({ order, userId, onChanged }) {
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const remainingMs = useEditCountdown(order.editableUntil)
  const canEdit = order.status === 'ACTIVE' && remainingMs > 0 && order.editable

  useEffect(() => {
    if (!canEdit && editing) {
      setEditing(false)
    }
  }, [canEdit, editing])

  const handleCancel = async () => {
    if (!canEdit) return
    if (!window.confirm('Cancel this order? This cannot be undone.')) return
    setBusy(true)
    setError('')
    try {
      await cancelOrder(order.id)
      onChanged?.()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not cancel order'))
    } finally {
      setBusy(false)
    }
  }

  const handleSave = async (payload) => {
    setBusy(true)
    setError('')
    try {
      await updateOrder(order.id, { ...payload, userId })
      setEditing(false)
      onChanged?.()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update order'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className={`order-card status-${(order.status || '').toLowerCase()}`}>
      <header className="order-card-header">
        <div>
          <strong>Order #{order.id}</strong>
          <span className={`status-badge status-${(order.status || '').toLowerCase()}`}>
            {order.status}
          </span>
        </div>
        <div className="order-meta">
          {SIZE_LABELS[order.size] || order.size}
          {order.status === 'ACTIVE' && (
            <span className={canEdit ? 'countdown ok' : 'countdown expired'}>
              {canEdit
                ? `Edit/cancel: ${formatCountdown(remainingMs)} left`
                : 'Edit window closed'}
            </span>
          )}
        </div>
      </header>

      {error && <div className="failure">{error}</div>}

      {editing ? (
        <OrderEditFields
          order={order}
          busy={busy}
          onCancel={() => setEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <>
          <p><span className="label">Name:</span> {order.fullName}</p>
          <p>
            <span className="label">Toppings:</span>{' '}
            {order.toppings?.length ? order.toppings.join(', ') : 'None'}
          </p>
          <p className="order-window-note">
            Window: {order.cancellationWindowMinutes
              || SIZE_WINDOWS[order.size]
              || 20} min after order (S=10, M=15, L=20)
          </p>

          {order.status === 'ACTIVE' && (
            <div className="order-actions">
              <button
                type="button"
                className="btn"
                disabled={!canEdit || busy}
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn danger"
                disabled={!canEdit || busy}
                onClick={handleCancel}
              >
                Cancel order
              </button>
            </div>
          )}
        </>
      )}
    </article>
  )
}

function OrderEditFields({ order, busy, onCancel, onSave }) {
  const [fullName, setFullName] = useState(order.fullName || '')
  const [size, setSize] = useState(order.size || '')
  const [toppings, setToppings] = useState(
    (order.toppingIds || []).map(String)
  )

  const toggleTopping = (id, checked) => {
    setToppings((current) =>
      checked ? [...current, id] : current.filter((t) => t !== id)
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({
      fullName: fullName.trim(),
      size,
      toppings: toppings.map(Number),
    })
  }

  return (
    <form className="order-edit-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor={`edit-name-${order.id}`}>Full name</label>
        <input
          id={`edit-name-${order.id}`}
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          minLength={3}
          maxLength={20}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor={`edit-size-${order.id}`}>Size</label>
        <select
          id={`edit-size-${order.id}`}
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
        >
          <option value="S">Small (10 min window)</option>
          <option value="M">Medium (15 min window)</option>
          <option value="L">Large (20 min window)</option>
        </select>
      </div>

      <div className="input-group">
        {TOPPING_OPTIONS.map((t) => (
          <label key={t.id}>
            <input
              type="checkbox"
              checked={toppings.includes(String(t.id))}
              onChange={(e) => toggleTopping(String(t.id), e.target.checked)}
            />
            {t.name}
          </label>
        ))}
      </div>

      <div className="order-actions">
        <button type="submit" className="btn" disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" className="btn ghost" disabled={busy} onClick={onCancel}>
          Back
        </button>
      </div>
    </form>
  )
}

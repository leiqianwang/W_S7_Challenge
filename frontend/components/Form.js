import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EXPRESS_API_URL, SPRING_API_URL } from '../api/config'
import { useAuth } from '../context/AuthContext'

const yup = require('yup')

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

const inputSchema = yup.object().shape({
  fullName: yup.string().trim().min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong).required(),
  size: yup.string().oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect).required(validationErrors.sizeIncorrect),
  toppings: yup.array().of(yup.number())
})

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const initialForm = {
    fullName: user?.displayName || '',
    size: '',
    toppings: []
  }

  const [form, setForm] = useState(initialForm)
  const [successMessage, setSuccessMessage] = useState('')
  const [failureMessage, setFailureMessage] = useState('')
  const [errors, setErrors] = useState({
    fullName: '',
    size: '',
    selectedToppings: ''
  })
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    if (user?.displayName && !form.fullName) {
      setForm((current) => ({ ...current, fullName: user.displayName }))
    }
  }, [user?.displayName])

  const onChange = async (event) => {
    const { type, name, value, checked } = event.target
    let newForm

    if (type === 'checkbox') {
      newForm = {
        ...form,
        toppings: checked
          ? [...form.toppings, name]
          : form.toppings.filter((toppingId) => toppingId !== name),
      }
    } else {
      newForm = {
        ...form,
        [name]: value,
      }
    }
    setForm(newForm)

    if (type !== 'checkbox') {
      try {
        await inputSchema.validateAt(name, newForm)
        setErrors((currentErrors) => ({
          ...currentErrors,
          [name]: '',
        }))
      } catch (error) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          [name]: error.message
        }))
      }
    }
  }

  useEffect(() => {
    inputSchema.isValid(form).then((valid) => {
      setIsFormValid(valid)
    })
  }, [form])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    try {
      const endpoint = isAuthenticated
        ? `${SPRING_API_URL}/api/order`
        : `${EXPRESS_API_URL}/api/order`

      const payload = isAuthenticated
        ? {
            fullName: form.fullName,
            size: form.size,
            toppings: form.toppings.map(Number),
            userId: user.id,
          }
        : form

      const response = await axios.post(endpoint, payload)

      setSuccessMessage(response.data.message)
      setFailureMessage('')
      setForm({
        fullName: user?.displayName || '',
        size: '',
        toppings: []
      })
      setErrors({
        fullName: '',
        size: '',
        selectedToppings: ''
      })

      if (isAuthenticated) {
        setTimeout(() => navigate('/orders'), 1200)
      }
    } catch (error) {
      setSuccessMessage('')
      setFailureMessage(error.response?.data?.message || 'Order failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {isAuthenticated && (
        <p className="order-account-note">
          Ordering as <strong>{user.displayName}</strong>. After submit you can track,
          edit, or cancel from My Orders (S=10m, M=15m, L=20m).
        </p>
      )}
      {successMessage && <div className="success">{successMessage}</div>}
      {failureMessage && <div className="failure">{failureMessage}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={onChange}
          />
        </div>
        {errors.fullName && <div className="error">{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={form.size} onChange={onChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small (edit 10 min)</option>
            <option value="M">Medium (edit 15 min)</option>
            <option value="L">Large (edit 20 min)</option>
          </select>
        </div>
        {errors.size && <div className="error">{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={topping.topping_id}
              type="checkbox"
              checked={form.toppings.includes(topping.topping_id)}
              onChange={onChange}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>

      <input type="submit" disabled={!isFormValid} />
    </form>
  )
}

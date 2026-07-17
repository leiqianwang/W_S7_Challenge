import axios from 'axios'
import React, { useEffect, useState } from 'react'


const yup = require('yup')

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const inputSchema = yup.object().shape({
  fullName: yup.string().trim().min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong).required(),
  size: yup.string().oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect).required(validationErrors.sizeIncorrect),
  toppings: yup.array().of(yup.number())
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
    const [successMessage, setSuccessMessage] = useState('')
    const [failureMessage, setFailureMessage] = useState('')
    const [isFormValid, setIsFormValid] = useState(false)
    const [fullName, setFullName] = useState('')
    const [size, setSize] = useState('')
    const [selectedToppings, setSelectedToppings] = useState([])

    const handleToppingChange = (event) => {
      const {name, checked} = event.target
      setSelectedToppings(currentToppings => {
        if (checked) {
          return [...currentToppings, name]
        }

        return currentToppings.filter(toppingId => toppingId !== name)
      })
    }

  const handleSubmit = async event => {
    event.preventDefault()
    // 👇 Here you will handle the form submission.
    // if(validationErrors.fullNameTooShort || validationErrors.fullNameTooLong 
    //   || validationErrors.sizeIncorrect) {
    //     alert('Form has errors. Please fix them before submitting.')
    //     return
    //   }
       useEffect(() => {
        const validateForm = async () => {
          try {
            const response = axios.post('http://localhost:9009/api/order', newOrder);
            setSuccessMessage(response.data.message);
           setFailureMessage('');
            const newOrder = {
               fullName,
               size,
               toppings: selectedToppings,
      } 
              inputSchema.isFormValid(newOrder).then(valid => {
                         setIsFormValid(valid);
              })

          }catch (error) {
            setFailureMessage('Something went wrong');
            setSuccessMessage('');
          }
        }
        validateForm();
      }, [fullName, size, selectedToppings]);
     
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {/* {true && <div className='success'>Thank you for your order!</div>}
      {true && <div className='failure'>Something went wrong</div>} */}
     {successMessage && <div className="success">{successMessage}</div>}
     {failureMessage && <div className="failure">{failureMessage}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input 
          placeholder="Type full name" 
          id="fullName" 
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)} />
        </div>
        {true && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
             <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {true && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {/* Green Peppers */}
        {/* Pineapple */}
        {/* Mushrooms */}
        {/* Ham */}
        {/* <label key="1">
          <input
            name="Pepperoni"
            type="checkbox"
          />
          Pepperoni<br />
        </label>
        <label key="2">
          <input
            name="Green Peppers"
            type="checkbox"
          />
          Green Peppers<br />
        </label>
        <label key="3">
          <input
            name="Pineapple"
            type="checkbox"
          />
          Pineapple<br />
        </label>
        <label key="4">
          <input
            name="Mushrooms"
            type="checkbox"
          />
          Mushrooms<br />
        </label>
        <label key="5">
          <input
            name="Ham"
            type="checkbox"
          />
          Ham<br />
        </label> */}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" />
    </form>
  )
}

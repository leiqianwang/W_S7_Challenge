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

  const initialForm = {
    fullName: '',
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
    // const [fullName, setFullName] = useState('')
    // const [size, setSize] = useState('')
    // const [selectedToppings, setSelectedToppings] = useState([])

    // const handleToppingChange = (event) => {
    //   const {name, checked} = event.target
    //   setSelectedToppings(currentToppings => {
    //     if (checked) {
    //       return [...currentToppings, name]
    //     }

    //     return currentToppings.filter(toppingId => toppingId !== name)
    //   })
    // }

    const onChange = async event => {
         const {type, name, value, checked} = event.target
         let newForm 

         if(type === 'checkbox') {
          newForm = {
            ...form, 
            toppings: checked ? [...form.toppings, name] : form.toppings.filter(toppingId => 
               toppingId !== name),
            }
          }else {
            newForm = {
              ...form, 
              [name]: value,
            }
          }
          setForm(newForm)

          if(type !== 'checkbox') {
            try {
              await inputSchema.validateAt(name, newForm)

              setErrors(currentErrors => ({
                ...currentErrors, [name]: '',
              }))
            } catch (error) {
              setErrors(currentErrors => ({
                ...currentErrors,
                [name]: error.message
              }))
            }
          }
        }

          useEffect(() => {
            inputSchema.isValid(form).then(valid => {
                 setIsFormValid(valid)
            })
          }, [form])



  const handleSubmit = async event => {
    event.preventDefault()
    // 👇 Here you will handle the form submission.
    
    if(!isFormValid) {
      return   
  }

  try {
     const response = await axios.post('http://localhost:9009/api/order', form)

     setSuccessMessage(response.data.message)
     setFailureMessage('')

     setForm(initialForm)

     setErrors({
      fullName: '',
      size: '',
      selectedToppings: ''
     })
  }  catch(error) {
     setSuccessMessage('')
      setFailureMessage(error.response.data.message)  
  }
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
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={onChange} />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={form.size} onChange={onChange}>
            {/* //Drop down menu size options rendering */}
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
             <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {/* Green Peppers */}
        {/* Pineapple */}
        {/* Mushrooms */}
        {/* Ham */}

        {toppings.map(topping => (
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
      <input type="submit" disabled={!isFormValid}/>
    </form>
  )
    }
  

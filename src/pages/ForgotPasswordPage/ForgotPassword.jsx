import React, { useState } from 'react'
import api from '../../axiosApi/api'
import { toast } from 'react-toastify'
import { signupSchema } from '../../validations/signupValidation.js'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('') 
  const [loading, setLoading] = useState(false)

  const handleChange = async (e) => {
    const newValue = e.target.value
    setEmail(newValue)

    try {
      await signupSchema.validateAt('email', { email: e.target.value })
      setError('') 
    } catch (err) {
      setError(err.message) 
    }
    
  }

//   const handleBlur = async(e)=>{
// try {
//       await signupSchema.validateAt('email', { email: e.target.value })
//       setError('') 
//     } catch (err) {
//       setError(err.message) 
//     }
//   }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/api/v1/auth/forgot-password', { email })
      toast.success(response.data.message)
      setError('')
    } catch (err) {
       
      setError(err.response.data.message )
      toast.error(err.response.data.message )
    } finally {
      setLoading(false)
     
     
    }
  }

  const isInValid = !email || error || loading

  return (
    <div className="forgot-password-page">
      <div className="container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              // onBlur={handleBlur}
            
              required
            />
           
            <small className="errors">{error}</small>
          </div>
          
          <div className="btn-container">
            <button 
              type="submit" 
              disabled={isInValid}
              className={isInValid ? 'disabled-btn' : 'normal-btn'}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
import React, { useState } from 'react'
import './SignInPage.css'
import * as Yup from 'yup'
import api from '../../axiosApi/api.js'
import { toast } from 'react-toastify'
import { signinSchema } from '../../validations/signInValidation.js'
import { Link, useNavigate } from 'react-router-dom'
const SignInPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      await signinSchema.validate(formData, { abortEarly: false })
      const response = await api.post('/api/v1/auth/signin', formData, {
        withCredentials: true,
      })
      console.log(`response.data`, response.data)
      const accessToken = response.data.data.accessToken
      localStorage.setItem('accessToken', accessToken)
      toast.success(response.data.message)
      navigate('/dashboard')
    } catch (error) {
      console.log(`error`, error.response.data.message)
      setError(error.response.data.message)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
      setError({})
      setFormData({
        email: '',
        password: '',
      })
    }
  }

  const validateField = async (name, value) => {
    try {
      await Yup.reach(signinSchema, name).validate(value)
      setError((prev) => ({ ...prev, [name]: '' }))
    } catch (err) {
      setError((prev) => ({ ...prev, [name]: err.message }))
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
     if(error[id]){
      validateField(id, value);
     }
   
  }

   const handleBlur = (e) => {
  const {  id,  value } = e.target;
  
  validateField(id, value);
   }

   const isSchemaValid = signinSchema.isValidSync(formData);

  const isFormInvalid =
    error.email || error.password ||
    !formData.email ||
    !formData.password ||
    !isSchemaValid


  return (
    <div className="signin-page">
      <div className="container">
        <div className="head">
          <h2>Sign in to your account.</h2>
        </div>
        <form className="inputs" onSubmit={(e) => handleSubmit(e)}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name='email'
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <small className="errors">{error.email}</small>
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name='password'
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <small className="errors">{error.password}</small>
          </div>

          <div className="btn">
            <button
              className={isFormInvalid ? 'disabled-btn' : 'normal-btn'}
              disabled={isFormInvalid || loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className='links'>
          <div>
            <Link className="forgot-password-link" to="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <div>Create Account?{' '}
            <Link className='signup-page-link' to="/">Sign up</Link>
          </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignInPage

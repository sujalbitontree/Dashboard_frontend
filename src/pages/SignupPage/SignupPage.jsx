import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import './SignupPage.css'
import { signupSchema } from '../../validations/signupValidation'
import api from '../../axiosApi/api.js'
import { toast } from 'react-toastify'
import { Link,useNavigate } from 'react-router-dom'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
  })

  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.confirmPassword !== formData.password) {
      setError((prev) => ({ ...prev, confirmPassword: 'Password must match' }))
      return
    }

    setLoading(true)

    try {
      await signupSchema.validate(formData, { abortEarly: false })
      const response = await api.post('/api/v1/auth/signup', formData)
      console.log(`response.data`, response.data)
      toast.success(response.data.message)
      navigate('/signin')
    } catch (error) {
      console.log(`error`, error.response.data.message)
      setError(error.response.data.message)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
      setError({})
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        gender: '',
      })
    }
  }

  const validateField = async (name, value) => {
    try {
      const dataToValidate = { ...formData, [name]: value }
      await signupSchema.validateAt(name, dataToValidate)

      setError((prev) => ({ ...prev, [name]: '' }))
    } catch (err) {
      setError((prev) => ({ ...prev, [name]: err.message }))
    }
  }

 const handleChange = (e) => {
  const { name, value, type } = e.target;
  const finalValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;

 
  setFormData(prev => ({ ...prev, [name]: finalValue }));

  if(error[name]){
  validateField(name, finalValue);
  }
};

  const handleBlur = (e) => {
  const { name, value, type } = e.target;
  const finalValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
  
  validateField(name, finalValue);
}
  useEffect(()=>{
    if(formData.confirmPassword){
      validateField('confirmPassword',formData.confirmPassword)
    }
  },[formData.confirmPassword,formData.password])


  const isSchemaValid = signupSchema.isValidSync(formData);
  
  const isFormInvalid =
    !isSchemaValid ||
    !formData.username ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    !formData.age ||
    !formData.gender

  return (
    <div className="signup-page">
      <div className="container">
        <div className="head">
          <FontAwesomeIcon icon={faUser} className="icons" />
          <h2>Create account.</h2>
        </div>
        <form className="inputs" onSubmit={(e) => handleSubmit(e)}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name='username'
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <small className="errors">{error.username}</small>
          </div>
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
          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="text"
              id="confirmPassword"
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
               onBlur={handleBlur}
              required
            />
            <small className="errors">{error.confirmPassword}</small>
          </div>
          <div className="field">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name='age'
              value={formData.age}
              onChange={handleChange}
               onBlur={handleBlur}
              required
            />
            <small className="errors">{error.age}</small>
          </div>
          <div className="radio-btn">
            <span>Select your gender:</span>
            <div className="radio">
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                   onBlur={handleBlur}
                  checked={formData.gender === 'male'}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                   onBlur={handleBlur}
                  checked={formData.gender === 'female'}
                />
                <label htmlFor="female">Female</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  onChange={handleChange}
                   onBlur={handleBlur}
                  checked={formData.gender === 'other'}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            <small className="errors">{error.gender}</small>
          </div>
          <div className="btn">
            <button
              className={isFormInvalid ? 'disabled-btn' : 'normal-btn'}
              disabled={isFormInvalid || loading}
            >
              Sign up
            </button>
          </div>
          <div className="footer">
            <span>Already Have an account?</span>{' '}
            <Link className='signin-page-link' to="/signin">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage

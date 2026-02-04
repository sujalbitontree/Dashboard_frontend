import React, { useState, useEffect } from 'react'
import api from '../../axiosApi/api'
import { toast } from 'react-toastify'
import { EditProfileSchema } from '../../validations/editProflieValidation'
import { useNavigate } from 'react-router-dom'
import './EditProfile.css'
import ChangePassword from '../ChangePassword/ChangePassword'
const EditProfile = () => {
  const [userData, setUserData] = useState({})
  const [error, setError] = useState({})
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    age: '',
    gender: '',
  })
  const navigate = useNavigate()

  const validateField = async (name, value) => {
    try {
      const dataToValidate = { ...formData, [name]: value }
      await EditProfileSchema.validateAt(name, dataToValidate)

      setError((prev) => ({ ...prev, [name]: '' }))
    } catch (err) {
      setError((prev) => ({ ...prev, [name]: err.message }))
    }
  }
  const fetchUser = async () => {
    try {
      const response = await api.get('/api/v1/auth/dashboard')
      console.log(`response.data`, response.data)
      setUserData(response.data.user)
      setFormData({
        username: response.data.user.username,
        id: response.data.user.id,
        age: response.data.user.age,
        gender: response.data.user.gender,
      })
      console.log(`user`, userData)
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    const finalValue =
      type === 'number' ? (value === '' ? '' : Number(value)) : value

    setFormData((prev) => ({ ...prev, [name]: finalValue }))

    if (error[name]) {
      validateField(name, finalValue)
    }
  }

  const handleBlur = (e) => {
    const { name, value, type } = e.target
    const finalValue =
      type === 'number' ? (value === '' ? '' : Number(value)) : value

    validateField(name, finalValue)
  }

  const isSchemaValid = EditProfileSchema.isValidSync(formData)

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/api/v1/auth/edit-profile', formData)
      console.log(`response.data`, response.data)
      setUserData(formData)
      toast.success(response.data.message)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setError({})
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleBack = () => {
    navigate('/dashboard', { replace: true })
  }

  const isInvalid =
    !isSchemaValid ||
    !formData.username ||
    !formData.age ||
    !formData.gender ||
    error.username ||
    error.age ||
    error.gender

  return (
    <div>
      <div className="container">
        <form onSubmit={handleUpdateUser}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <small className="errors">{error.username}</small>
          </div>
          <div className="field">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              required
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
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
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label htmlFor="female">Female</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            <small className="errors">{error.gender}</small>
          </div>
          <div className="btn">
            <button
              type="submit"
              className={isInvalid ? 'disable-btn' : 'normal-btn'}
              disabled={isInvalid}
            >
              Save
            </button>
            <button type='button' className="normal-btn back-btn" onClick={handleBack}>
          Back
        </button>
          </div>
        </form>
        
        <div>
          <ChangePassword />
        </div>
      </div>
    </div>
  )
}

export default EditProfile

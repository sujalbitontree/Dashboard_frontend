import React from 'react'
import { useState } from 'react'
import api from '../../axiosApi/api'
import { toast } from 'react-toastify'
import { changePasswordSchema } from '../../validations/changePasswordValidation'
import './ChangePassword.css'
const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' })
  const [error, setError] = useState({})
  const [togglePassword, setTogglePassword] = useState(false)

    const isSchemaValid = changePasswordSchema.isValidSync(formData);

  const validateField = async (name, value) => {
    try {
      const dataToValidate = { ...formData, [name]: value }
      await changePasswordSchema.validateAt(name, dataToValidate)
      setError((prev) => ({ ...prev, [name]: '' }))
    } catch (err) {
      setError((prev) => ({ ...prev, [name]: err.message }))
      console.log(`error`, error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
     if(error[name]){
      validateField(name, value)
     }
  }

  const handleBlur = (e)=>{
     const { name, value } = e.target
     validateField(name, value)
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post(
        '/api/v1/auth/dashboard/change-password',
        formData,
      )
      console.log(`response`, response)
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      setError(error.response.data.message)
    } finally {
      setFormData({
        oldPassword: '',
        newPassword: '',
      })
      setError({})
    }
  }

  const isInValid =
    !isSchemaValid
    !formData.newPassword ||
    !formData.oldPassword ||
    error.newPassword ||
    error.oldPassword

  return (
  <div className="change-password-wrapper">
    <button 
      type="button" 
      className="password-toggle-btn" 
      onClick={() => setTogglePassword(!togglePassword)}
    >
      {togglePassword ? 'Cancel Password Change? Click here' : 'Change Password? Click here'}
    </button>

    {togglePassword && (
      <form onSubmit={handleSubmit} className="password-form-container">
        <div className="password-input-group">
          <label htmlFor="oldPassword">Current Password</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            
            value={formData.oldPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <small className="errors">{error.oldPassword}</small>
        </div>

        <div className="password-input-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
             onBlur={handleBlur}
          />
           <small className="errors">{error.newPassword}</small>
        </div>

        <button type="submit" className="submit-password-btn" disabled={isInValid}>
          Update Password
        </button>

      </form>
    )}
  </div>
)
}

export default ChangePassword

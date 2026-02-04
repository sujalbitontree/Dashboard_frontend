import React, { useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../axiosApi/api'
import { signupSchema } from '../../validations/signupValidation.js'
import { toast } from 'react-toastify'
import './ResetPassword.css'
const ResetPassword = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const { token } = useParams()
  const navigate = useNavigate()

 
  const validateField = async (name, value) => {
    try {
     
      const dataToValidate = { ...formData, [name]: value }
      await signupSchema.validateAt(name, dataToValidate)
      setErrors(prev => ({ ...prev, [name]: '' }))
    } catch (err) {
      setErrors(prev => ({ ...prev, [name]: err.message }))
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))

    if(errors[id]){
validateField(id, value)
    }
    
  }
  const handleBlur = (e)=>{
     const { id, value } = e.target
      validateField(id, value)
  }

  // const isSchemaValid = signupSchema.isValidSync(formData);
  const isInvalid = 
  // !isSchemaValid ||
    loading || 
    !formData.password || 
    !formData.confirmPassword || 
    errors.password || 
    errors.confirmPassword ||
    formData.password !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoading(true)

    try {
      await api.post(`/api/v1/auth/reset-password/${token}`, { password: formData.password })
      toast.success('Password updated successfully!')
      navigate('/signin')
    } catch (err) {
      toast.error( err.response.data.message )
    } finally {
      setLoading(false)
      setErrors({})
      setFormData({
        password :'',
        confirmPassword :''
      })
    }
  }

  return (
    <div className="reset-password-page">
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="field">
          <label>New Password</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
           
          />
          {errors.password && <small className='errors'>{errors.password}</small>}
        </div>

        <div className="field">
          <label>Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
             onBlur={handleBlur}
        
          />
          
          {errors.confirmPassword && <small className='errors'>{errors.confirmPassword}</small>}
        </div>

        <div className="btn">
          <button 
            type="submit" 
            disabled={isInvalid}
            className={isInvalid ? 'btn-disabled' : 'normal-btn'}
          >
           {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default ResetPassword
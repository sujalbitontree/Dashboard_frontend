import React from 'react'
import { useNavigate } from 'react-router-dom'
const ErrorPage = () => {
  const navigate = useNavigate()
  const handleBack = () => [navigate('/signin')]
  return (
    <>
      <h1>404 Page Not Found.</h1>
      <button onClick={handleBack}>Back to Sign up page.</button>
    </>
  )
}

export default ErrorPage

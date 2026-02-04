import React, { useState, useEffect } from 'react'
import api from '../../axiosApi/api'
import { Link, useNavigate } from 'react-router-dom'
import './DashboardPage.css'

const DashboardPage = () => {
  const [user, setUser] = useState({})
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/v1/auth/dashboard')
      setUser(response.data.user)
    } catch (error) {
      console.log(`error from dashboard`, error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleLogout = async() => {
  try {
    await api.post('/api/v1/auth/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    localStorage.removeItem('accessToken');
    window.location.href = '/signin';
  }
  }

  return (
    <div>
      <header>
        <h2>Dashboard</h2>
        <nav className="navbar">
          <Link to="/edit-profile" className="profile">
            Edit Profile
          </Link>
          <button className="logout-link" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main>
        <div>Welcome {user.username}!</div>
      </main>
    </div>
  )
}

export default DashboardPage

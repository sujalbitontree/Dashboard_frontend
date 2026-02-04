import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  console.log(`config`, config)
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const skipUrl = '/api/v1/auth/forgot-password';

    if (error.config.url.includes(skipUrl)) {
      return Promise.reject(error); 
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const res = await axios.post(
          'http://localhost:3000/api/v1/auth/refresh',
          {},
          { withCredentials: true },
        )
        const { accessToken } = res.data
        console.log(`accessToken`, accessToken);
        localStorage.setItem('accessToken', accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (error) {
        console.error('Refresh token expired. Logging out...')
        localStorage.removeItem('accessToken')
        window.location.href = '/signin'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error);
  },
)

export default api

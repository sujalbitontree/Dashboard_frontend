import ForgotPassword from './pages/ForgotPasswordPage/ForgotPassword'
import SignInPage from './pages/SignInPage/SignInPage'
import SignupPage from './pages/SignupPage/SignupPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ResetPassword from './pages/ResetPasswordPage/ResetPassword'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import PublicRoute from './Routes/PublicRoute'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import EditProfile from './Components/Profile/EditProfile'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

       
       {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        

        <Route path='*' element={<ErrorPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

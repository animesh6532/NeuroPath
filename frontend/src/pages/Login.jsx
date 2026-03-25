import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/endpoints'
import { AuthContext } from '../context/AuthContext'
import Toast from '../components/Toast'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await authAPI.login({ email, password })
      
      // Store token and user data
      login(res.data.access_token, { email })
      
      setToast({ message: 'Login Successful! 🎉', type: 'success' })
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (err) {
      console.error(err.response?.data)
      setToast({
        message: err.response?.data?.detail || 'Login failed',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Login</h1>
        <p className="auth-subtitle">Welcome back to NeuroPath AI</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          New user? <a href="/register">Create an account</a>
        </p>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Login

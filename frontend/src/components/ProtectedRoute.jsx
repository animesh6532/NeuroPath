import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) return <LoadingSpinner />

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute

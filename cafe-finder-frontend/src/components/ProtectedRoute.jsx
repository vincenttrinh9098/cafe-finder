import { Navigate } from 'react-router-dom'

// This will eventually come from Supabase — hardcoded for now to learn the pattern
const isLoggedIn = false

export function ProtectedRoute({ children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return children
}
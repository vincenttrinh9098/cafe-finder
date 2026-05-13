import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

export function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const response = await supabase.auth.getSession()
      const session = response.data.session

      // Since we call setUser() & setLoading(), it triggers a re-render
      // Component function runs again from the top
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }

      setLoading(false)
    }

    checkUser()
  }, [])

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />
  
  return children
}
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export function ProtectedRoute() {
  const { status } = useAuth()
  if (status === 'ready') return <Outlet />
  if (status === 'signedOut') return <Navigate to="/login" replace />
  return null
}

export function GuestRoute() {
  const { status } = useAuth()
  if (status === 'ready') return <Navigate to="/" replace />
  if (status === 'init') return null
  return <Outlet />
}

// `permission` is a key from permissions.js, or 'admin'
export function RequirePermission({ permission }) {
  const { can } = useAuth()
  return can(permission) ? <Outlet /> : <Navigate to="/" replace />
}

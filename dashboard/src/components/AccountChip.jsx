import { useAuth } from '../auth/AuthContext.jsx'
import { displayName, roleLabel } from '../auth/permissions.js'
import './AccountChip.css'

// Signed-in user: initial avatar + name (+ "مدير النظام" for admins).
// `variant` matches the background it sits on: 'dark' or 'light'.
export default function AccountChip({ variant = 'dark', className = '' }) {
  const { profile } = useAuth()
  const name = displayName(profile)
  const role = roleLabel(profile)

  return (
    <div className={`account-chip ${variant} ${className}`.trim()} title={profile?.email}>
      <div className="account-avatar">{name.trim().charAt(0).toUpperCase() || '?'}</div>
      <div className="account-text">
        <div className="account-name">{name}</div>
        {role && <div className="account-role">{role}</div>}
      </div>
    </div>
  )
}

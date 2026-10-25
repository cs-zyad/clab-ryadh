import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext.jsx'
import PortalShell from './PortalShell.jsx'

const ERROR_MESSAGES = {
  'auth/too-many-requests': 'محاولات كثيرة، حاول مرة أخرى لاحقاً.',
  'auth/network-request-failed': 'تعذّر الاتصال بالخادم، تحقق من اتصال الإنترنت.',
}
const DEFAULT_ERROR = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'

function noticeMessage(notice) {
  if (!notice) return ''
  if (notice.reason === 'no-profile') {
    return `لا يوجد ملف صلاحيات لهذا الحساب. تواصل مع مدير النظام. (UID: ${notice.uid})`
  }
  if (notice.reason === 'deleted') return 'تم حذف هذا الحساب. تواصل مع مدير النظام.'
  if (notice.reason === 'error') return 'تعذّر تحميل صلاحيات الحساب، حاول مرة أخرى.'
  return 'هذا الحساب غير مفعّل. تواصل مع مدير النظام.'
}

export default function LoginPage() {
  const { login, status, notice } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // On success the auth state changes and GuestRoute redirects to the chooser
      await login(email.trim(), password)
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || DEFAULT_ERROR)
    } finally {
      setSubmitting(false)
    }
  }

  const busy = submitting || status === 'loading'
  const message = error || noticeMessage(notice)

  return (
    <PortalShell>
      <div className="login-card">
        <div className="login-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        </div>
        <h1 className="login-title">تسجيل دخول الإدارة</h1>
        <p className="login-subtitle">بوابة التحكم في محتوى نادي ريادة الأعمال</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailInput">البريد الإلكتروني</label>
            <input
              type="email"
              id="emailInput"
              className="form-control"
              required
              placeholder="name@example.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">كلمة المرور</label>
            <input
              type="password"
              id="passwordInput"
              className="form-control"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
          <p className="error-message" style={message ? { display: 'block' } : undefined}>
            {message}
          </p>
        </form>
      </div>
    </PortalShell>
  )
}

import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import AccountChip from './AccountChip.jsx'

// Frame of the light panel pages (events, media, users): signed-in account in the
// top-right, then the card with its header. `icon` is the section's icon from the
// landing page; the section colour comes from the tone-* class on <body>.
// `wide` is for pages with two columns. Styles live in styles/panel.css.
export default function PanelPage({ title, icon: Icon, wide = false, children }) {
  const { logout } = useAuth()
  const width = wide ? ' wide' : ''

  return (
    <>
      <div className={`panel-topbar${width}`}>
        <AccountChip variant="light" />
      </div>

      <div className={`dashboard-container${width}`}>
        <div className="dashboard-header">
          <div className="header-side">
            <Link to="/" className="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              لوحة الاختيار
            </Link>
          </div>
          <h2>
            {Icon && <span className="header-icon"><Icon size={22} /></span>}
            {title}
          </h2>
          <div className="header-side end">
            <button className="logout-btn" onClick={logout}>تسجيل خروج</button>
          </div>
        </div>
        <div className="dashboard-body">{children}</div>
      </div>
    </>
  )
}

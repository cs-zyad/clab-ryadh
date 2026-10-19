import { usePageShell } from '../../hooks/usePageShell.js'
import './portal.css'

// `topbar` is pinned to the top corners of the page, outside the centred content
export default function PortalShell({ wide = false, topbar = null, children }) {
  usePageShell('بوابة الإدارة | نادي ريادة الأعمال', 'page-portal')

  return (
    <>
      {/* Clipped layer so the glow orbs never make the page wider than the screen */}
      <div className="glow-layer" aria-hidden="true">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>
      {topbar}
      <div className={`portal-wrapper${wide ? ' wide' : ''}`}>{children}</div>
    </>
  )
}

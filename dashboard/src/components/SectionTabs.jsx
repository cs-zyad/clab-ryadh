import { NavLink } from 'react-router-dom'
import { Globe } from 'lucide-react'

// Tabs at the top of the events and media pages (add / list), plus a link to the
// matching page of the public website. Styles live in styles/panel.css.
// tabs: [{ to, label, Icon, end }]
export default function SectionTabs({ tabs, siteUrl }) {
  return (
    <div className="section-toolbar">
      <nav className="section-tabs">
        {tabs.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="section-tab">
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="site-link">
        <Globe size={16} /> معاينة الموقع
      </a>
    </div>
  )
}

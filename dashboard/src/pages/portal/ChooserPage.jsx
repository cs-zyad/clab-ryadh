import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Megaphone, UsersRound } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext.jsx'
import AccountChip from '../../components/AccountChip.jsx'
import { loadEvents, loadMedia, loadUsers } from '../../routes/loaders.js'
import PortalShell from './PortalShell.jsx'

// Each section has its own colour (tone) so the cards are easy to tell apart
const SECTIONS = [
  {
    to: '/events',
    permission: 'events_view',
    preload: loadEvents,
    tone: 'gold',
    Icon: CalendarDays,
    title: 'الفعاليات والأنشطة',
    desc: 'أضف الفعاليات واللقاءات، وعدّل الموعد والبوستر وحالة التسجيل، لتظهر مباشرة في صفحة الأنشطة.',
  },
  {
    to: '/media',
    permission: 'posts_view',
    preload: loadMedia,
    tone: 'sky',
    Icon: Megaphone,
    title: 'الأخبار والمنشورات',
    desc: 'انشر التغريدات وصور الإعلانات لتظهر فوراً في قسم أحدث الأخبار بالصفحة الرئيسية.',
  },
  {
    to: '/users',
    permission: 'admin',
    preload: loadUsers,
    tone: 'violet',
    Icon: UsersRound,
    title: 'المستخدمون والصلاحيات',
    desc: 'أضف حسابات أعضاء الفريق، وحدّد صلاحيات كل عضو، أو أوقف الحسابات.',
    badge: 'للمدير فقط',
  },
]

export default function ChooserPage() {
  const { logout, can, profile } = useAuth()
  const sections = SECTIONS.filter((s) => can(s.permission))
  const greeting = profile?.name ? `مرحباً ${profile.name}!` : 'مرحباً بك!'

  const wide = sections.length > 2

  // Top bar as wide as the cards: account on the right, logout on the left
  const topbar = (
    <div className={`portal-bar${wide ? ' wide' : ''}`}>
      <AccountChip />
      <button className="logout-top-btn" onClick={logout}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
        تسجيل الخروج
      </button>
    </div>
  )

  return (
    <PortalShell wide={wide} topbar={topbar}>
      <div className="chooser-container">
        <div className="chooser-header">
          <span className="chooser-eyebrow">نادي ريادة الأعمال · لوحة التحكم</span>
          <h1 className="chooser-title">بوابة إدارة المحتوى</h1>
          <p className="chooser-subtitle">{greeting} اختر القسم الذي تريد إدارته.</p>
        </div>

        {sections.length === 0 ? (
          <p className="chooser-subtitle no-access">لا توجد صلاحيات مفعّلة لحسابك حالياً. تواصل مع مدير النظام.</p>
        ) : (
          <div className={`chooser-grid cols-${sections.length}`}>
            {sections.map(({ to, preload, tone, Icon, title, desc, badge }) => (
              <Link
                key={to}
                to={to}
                className={`chooser-card tone-${tone}`}
                // Start downloading the section's code as soon as the user points at it
                onMouseEnter={preload}
                onFocus={preload}
              >
                <div className="card-top">
                  <div className="card-icon"><Icon size={26} /></div>
                  {badge && <span className="card-badge">{badge}</span>}
                </div>
                <h3 className="card-title">{title}</h3>
                <p className="card-desc">{desc}</p>
                <span className="card-cta">
                  الدخول
                  <ArrowLeft size={18} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  )
}

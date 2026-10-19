import { useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { CirclePlus, LayoutList, Megaphone, PenLine } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext.jsx'
import { useCollection } from '../../hooks/useCollection.js'
import { usePageShell } from '../../hooks/usePageShell.js'
import { useToast } from '../../hooks/useToast.js'
import { SITE_URL } from '../../lib/site.js'
import PanelPage from '../../components/PanelPage.jsx'
import SectionTabs from '../../components/SectionTabs.jsx'
import { EMPTY_DRAFT } from './constants.js'
import '../../styles/panel.css'
import './media.css'

const NO_POSTS = []

// Same structure as the events page: tabs for "add" and "list"
export default function MediaLayout() {
  usePageShell('لوحة الميديا | نادي ريادة الأعمال', 'page-panel page-media tone-sky')
  const { can } = useAuth()

  // Newest first, matching the homepage which shows posts[0]
  const [postsData, postsError] = useCollection('posts', 'date')
  const posts = postsData ?? NO_POSTS
  const [toast, showToast] = useToast('تم النشر بنجاح!')

  // Kept here so the draft and the filter survive switching tabs
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [filter, setFilter] = useState('all')

  const outletContext = useMemo(
    () => ({ posts, postsError, draft, setDraft, filter, setFilter, showToast }),
    [posts, postsError, draft, filter, showToast],
  )

  const isEditing = draft.editingId !== null
  const tabs = [
    // The form tab is for adding, or for finishing an edit started from the list
    ...(can('posts_create') || isEditing
      ? [{ to: '/media', end: true, label: isEditing ? 'تعديل المنشور' : 'إضافة منشور جديد', Icon: isEditing ? PenLine : CirclePlus }]
      : []),
    { to: '/media/posts', label: 'المنشورات المضافة', Icon: LayoutList },
  ]

  return (
    <>
      <PanelPage title="الأخبار والمنشورات" icon={Megaphone} wide>
        <SectionTabs tabs={tabs} siteUrl={SITE_URL} />
        <Outlet context={outletContext} />
      </PanelPage>

      <div className={`toast${toast.show ? ' show' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        <span>{toast.msg}</span>
      </div>
    </>
  )
}

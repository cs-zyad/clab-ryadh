import { useCallback, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { CalendarDays, CirclePlus, LayoutList, PenLine } from 'lucide-react'
import { db } from '../../lib/db.js'
import { SITE_URL } from '../../lib/site.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { useCollection } from '../../hooks/useCollection.js'
import { usePageShell } from '../../hooks/usePageShell.js'
import { useToast } from '../../hooks/useToast.js'
import PanelPage from '../../components/PanelPage.jsx'
import SectionTabs from '../../components/SectionTabs.jsx'
import '../../styles/panel.css'
import './events.css'

const EMPTY_FORM = {
  title: '',
  category: 'meeting',
  date: '',
  time: '',
  location: '',
  status: 'open',
  regLink: '',
  desc: '',
}

// Same structure as the media page: tabs for "add" and "list". The form state lives
// here so it survives switching tabs and the list can load an event into it.
export default function EventsLayout() {
  usePageShell('لوحة التحكم | إدارة الفعاليات', 'page-panel page-events tone-gold')
  const { can } = useAuth()
  const navigate = useNavigate()

  const [events, eventsError] = useCollection('events', 'createdAt')
  const [toast, showToast] = useToast()

  const [form, setForm] = useState(EMPTY_FORM)
  // Newly picked poster { image (compressed data URL), name }, or null
  const [poster, setPoster] = useState(null)
  // { id, image } of the event being edited, or null when adding a new one
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  const updateField = useCallback((name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
  }, [])

  function resetForm() {
    setForm(EMPTY_FORM)
    setPoster(null)
    setEditing(null)
  }

  function cancelEdit() {
    resetForm()
    navigate('/events/list')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const image = poster?.image || editing?.image || null
      const data = {
        title: form.title.trim(),
        category: form.category,
        date: form.date,
        time: form.time,
        location: form.location.trim(),
        status: form.status,
        regLink: form.regLink.trim(),
        desc: form.desc.trim(),
        image,
      }

      if (editing) {
        await updateDoc(doc(db, 'events', editing.id), data)
        showToast('✅ تم تحديث الفعالية!')
        cancelEdit()
      } else {
        data.createdAt = new Date().toISOString()
        await addDoc(collection(db, 'events'), data)
        showToast('✅ تمت إضافة الفعالية!')
        resetForm()
      }
    } catch (err) {
      console.error(err)
      showToast('❌ حدث خطأ، حاول مجدداً')
    } finally {
      setSaving(false)
    }
  }

  // The live list already holds the latest data, so no extra fetch is needed to edit
  const startEdit = useCallback(
    (ev) => {
      setEditing({ id: ev.id, image: ev.image || null })
      setForm({
        title: ev.title || '',
        category: ev.category || 'meeting',
        date: ev.date || '',
        time: ev.time || '',
        location: ev.location || '',
        status: ev.status || 'open',
        regLink: ev.regLink || '',
        desc: ev.desc || '',
      })
      navigate('/events')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [navigate],
  )

  const deleteEvent = useCallback(
    async (id) => {
      if (!confirm('هل أنت متأكد من حذف هذه الفعالية؟')) return
      try {
        await deleteDoc(doc(db, 'events', id))
        showToast('🗑️ تم حذف الفعالية')
      } catch (err) {
        console.error(err)
        showToast('❌ فشل الحذف')
      }
    },
    [showToast],
  )

  const isEditing = editing !== null
  const tabs = [
    // The form tab is for adding, or for finishing an edit started from the list
    ...(can('events_create') || isEditing
      ? [{ to: '/events', end: true, label: isEditing ? 'تعديل الفعالية' : 'إضافة فعالية جديدة', Icon: isEditing ? PenLine : CirclePlus }]
      : []),
    { to: '/events/list', label: 'الفعاليات المضافة', Icon: LayoutList },
  ]

  const outletContext = {
    events,
    eventsError,
    filter,
    setFilter,
    form,
    updateField,
    poster,
    setPoster,
    editing,
    saving,
    handleSubmit,
    cancelEdit,
    startEdit,
    deleteEvent,
  }

  return (
    <>
      <PanelPage title="الفعاليات والأنشطة" icon={CalendarDays} wide>
        <SectionTabs tabs={tabs} siteUrl={`${SITE_URL}activities/`} />
        <Outlet context={outletContext} />
      </PanelPage>

      <div className={`toast${toast.show ? ' show' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        <span>{toast.msg}</span>
      </div>
    </>
  )
}

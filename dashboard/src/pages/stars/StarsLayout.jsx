import { useCallback, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { CirclePlus, LayoutList, PenLine, Star } from 'lucide-react'
import { db } from '../../lib/db.js'
import { SITE_URL } from '../../lib/site.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { useCollection } from '../../hooks/useCollection.js'
import { usePageShell } from '../../hooks/usePageShell.js'
import { useToast } from '../../hooks/useToast.js'
import PanelPage from '../../components/PanelPage.jsx'
import SectionTabs from '../../components/SectionTabs.jsx'
import '../../styles/panel.css'
import './stars.css'

const EMPTY_FORM = { name: '', department: '' }

// Same structure as the events page: tabs for "add" and "list". The form state lives
// here so it survives switching tabs and the list can load a star into it.
export default function StarsLayout() {
  usePageShell('لوحة التحكم | نجوم الشهر', 'page-panel page-stars tone-emerald')
  const { can } = useAuth()
  const navigate = useNavigate()

  const [stars, starsError] = useCollection('stars', 'date')
  const [toast, showToast] = useToast()

  const [form, setForm] = useState(EMPTY_FORM)
  // Newly picked photo { image (compressed data URL), name }, or null
  const [photo, setPhoto] = useState(null)
  // { id, image } of the star being edited, or null when adding a new one
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const updateField = useCallback((name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
  }, [])

  function resetForm() {
    setForm(EMPTY_FORM)
    setPhoto(null)
    setEditing(null)
  }

  function cancelEdit() {
    resetForm()
    navigate('/stars/list')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const name = form.name.trim()
    const department = form.department.trim()
    if (!name || !department) return

    setSaving(true)
    try {
      const image = photo?.image || editing?.image || null
      const data = { name, department, image }

      if (editing) {
        await updateDoc(doc(db, 'stars', editing.id), data)
        showToast('✅ تم تحديث بيانات النجم!')
        cancelEdit()
      } else {
        data.date = new Date().toISOString()
        await addDoc(collection(db, 'stars'), data)
        showToast('✅ تمت الإضافة بنجاح!')
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
    (star) => {
      setEditing({ id: star.id, image: star.image || null })
      setForm({ name: star.name || '', department: star.department || '' })
      navigate('/stars')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [navigate],
  )

  const deleteStar = useCallback(
    async (id) => {
      if (!confirm('هل أنت متأكد من حذف هذا النجم؟')) return
      try {
        await deleteDoc(doc(db, 'stars', id))
        showToast('🗑️ تم الحذف')
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
    ...(can('stars_create') || isEditing
      ? [{ to: '/stars', end: true, label: isEditing ? 'تعديل النجم' : 'إضافة نجم جديد', Icon: isEditing ? PenLine : CirclePlus }]
      : []),
    { to: '/stars/list', label: 'نجوم الشهر المضافة', Icon: LayoutList },
  ]

  const outletContext = {
    stars,
    starsError,
    form,
    updateField,
    photo,
    setPhoto,
    editing,
    saving,
    handleSubmit,
    cancelEdit,
    startEdit,
    deleteStar,
  }

  return (
    <>
      <PanelPage title="نجوم الشهر" icon={Star} wide>
        <SectionTabs tabs={tabs} siteUrl={`${SITE_URL}members/`} />
        <Outlet context={outletContext} />
      </PanelPage>

      <div className={`toast${toast.show ? ' show' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        <span>{toast.msg}</span>
      </div>
    </>
  )
}

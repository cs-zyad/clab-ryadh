import { useEffect, useState } from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { CloudUpload, Send, Trophy, Users } from 'lucide-react'
import { db } from '../../lib/db.js'
import { compressImage } from '../../lib/compressImage.js'
import { useAuth } from '../../auth/AuthContext.jsx'

const DOC_REF = () => doc(db, 'settings', 'bestDepartment')
const EMPTY_FORM = { department: '', caption: '' }

// "أفضل قسم" tab: a single settings-like document (not a list), shown separately
// on the members page below the member stars.
export default function BestDepartmentPage() {
  const { showToast } = useOutletContext()
  const { can } = useAuth()

  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [savedImage, setSavedImage] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    getDoc(DOC_REF())
      .then((snap) => {
        if (cancelled || !snap.exists()) return
        const data = snap.data()
        setForm({ department: data.department || '', caption: data.caption || '' })
        setSavedImage(data.image || null)
      })
      .catch((err) => console.error('Error loading best department: ', err))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  if (!can('stars_edit')) {
    return <Navigate to="/stars/list" replace />
  }

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
  })

  async function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      setPhoto({ image: await compressImage(file), name: file.name })
    } catch (err) {
      console.error(err)
    }
  }

  const image = photo?.image || savedImage || null

  async function handleSubmit(e) {
    e.preventDefault()
    const department = form.department.trim()
    const caption = form.caption.trim()
    if (!department || !caption) return

    setSaving(true)
    try {
      await setDoc(DOC_REF(), { department, caption, image: image || null, updatedAt: new Date().toISOString() })
      setSavedImage(image)
      setPhoto(null)
      showToast('✅ تم تحديث أفضل قسم لهذا الشهر!')
    } catch (err) {
      console.error(err)
      showToast('❌ فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="section-hint">جاري التحميل...</p>

  let uploadText = 'اضغط لرفع صورة القسم'
  if (photo) uploadText = photo.name
  else if (savedImage) uploadText = 'صورة محفوظة (اضغط لتغييرها)'

  return (
    <>
      <h3>أفضل قسم لهذا الشهر</h3>
      <p className="section-hint">يظهر هذا القسم فوراً في صفحة أعضاء النادي أسفل نجوم الشهر.</p>

      <div className="editor-grid">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>اسم القسم <span className="req">*</span></label>
            <input type="text" className="form-control" required placeholder="مثال: قسم التطوير والابتكار" {...field('department')} />
          </div>

          <div className="form-group">
            <label>وصف مختصر <span className="req">*</span></label>
            <textarea className="form-control" required placeholder="اكتب سبب التكريم..." {...field('caption')}></textarea>
          </div>

          <div className="form-group">
            <label>صورة القسم (اختياري)</label>
            <div className={`upload-zone${image ? ' has-image' : ''}`}>
              <input key={photo?.name ?? 'empty'} type="file" accept="image/*" onChange={handlePhoto} />
              <CloudUpload size={34} className="upload-icon" />
              <div className="upload-text">{uploadText}</div>
              <div className="upload-hint">PNG، JPG — حجم أقصى 5MB</div>
              {image && <img src={image} className="upload-preview" alt="معاينة" />}
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={saving} style={{ background: 'var(--accent-gold)', color: 'var(--primary-navy)', fontSize: '1.1rem' }}>
            <Send size={18} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </form>

        <aside className="preview-panel">
          <div className="star-preview-card">
            <div className="star-preview-photo">
              {image ? <img src={image} alt="" /> : <Users size={34} />}
              <span className="star-preview-badge"><Trophy size={14} /></span>
            </div>
            <h4 className={`star-preview-title${form.department ? '' : ' empty'}`}>{form.department || 'اسم القسم'}</h4>
            <p className={`star-preview-name${form.caption ? '' : ' empty'}`}>{form.caption || 'الوصف المختصر'}</p>
          </div>
        </aside>
      </div>
    </>
  )
}

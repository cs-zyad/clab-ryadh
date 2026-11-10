import { useState } from 'react'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { Calendar, CloudUpload, Image as ImageIcon, MessageSquareText, Send } from 'lucide-react'
import { db } from '../../lib/db.js'
import { compressImage } from '../../lib/compressImage.js'
import TilePicker from '../../components/TilePicker.jsx'
import PostPreview from './PostPreview.jsx'
import { EMPTY_DRAFT } from './constants.js'

const TYPE_OPTIONS = [
  { value: 'tweet', label: 'تغريدة', Icon: MessageSquareText },
  { value: 'photo', label: 'صورة / إعلان', Icon: ImageIcon },
  { value: 'event', label: 'فعالية', Icon: Calendar },
]

const MAX_CHARS = 280

// Same colours as the events form: gold to add, green while editing
const submitStyles = {
  add: { background: 'var(--accent-gold)', color: 'var(--primary-navy)', fontSize: '1.1rem' },
  edit: { background: '#4ade80', color: '#fff', fontSize: '1.1rem' },
}

// Creates a post, or edits one when draft.editingId is set. The draft lives in the
// layout so the posts tab can load a post into it for editing.
// `onEditDone` runs after an edit is saved or cancelled.
export default function PostForm({ draft, setDraft, showToast, onEditDone }) {
  const [publishing, setPublishing] = useState(false)
  // Changing the key remounts the file input, which clears the selected file
  const [fileInputKey, setFileInputKey] = useState(0)
  const isEditing = draft.editingId !== null

  const setField = (name, value) => setDraft((d) => ({ ...d, [name]: value }))

  function resetForm() {
    setDraft(EMPTY_DRAFT)
    setFileInputKey((k) => k + 1)
  }

  function finishEdit() {
    resetForm()
    onEditDone?.()
  }

  async function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const image = await compressImage(file)
      setDraft((d) => ({ ...d, image, imageName: file.name }))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const text = draft.text.trim()
    if (!text) return

    const fields = {
      type: draft.type,
      text,
      image: draft.image || null,
      link: draft.link || null,
    }

    setPublishing(true)
    try {
      if (isEditing) {
        // `date` is left unchanged so editing doesn't change which post the homepage shows
        await updateDoc(doc(db, 'posts', draft.editingId), fields)
        showToast('✅ تم تحديث المنشور!')
        finishEdit()
      } else {
        await addDoc(collection(db, 'posts'), { ...fields, date: new Date().toISOString() })
        showToast('✅ تم النشر بنجاح!')
        resetForm()
      }
    } catch (err) {
      // Keep the draft so nothing typed is lost when saving fails
      console.error('Error saving post: ', err)
      showToast((isEditing ? '❌ فشل الحفظ: ' : '❌ فشل النشر: ') + err.message)
    } finally {
      setPublishing(false)
    }
  }

  const len = draft.text.length
  const countClass = 'char-count' + (len > MAX_CHARS ? ' over' : len > 240 ? ' warn' : '')

  let submitLabel = <><Send size={18} /> {isEditing ? 'حفظ التعديلات' : 'نشر الآن'}</>
  if (publishing) submitLabel = isEditing ? 'جاري الحفظ...' : 'جاري النشر...'

  return (
    <div className="editor-grid">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>نوع المنشور <span className="req">*</span></label>
          <TilePicker
            name="postType"
            options={TYPE_OPTIONS}
            value={draft.type}
            onChange={(type) => setField('type', type)}
          />
        </div>

        <div className="form-group">
          <label>النص <span className="req">*</span></label>
          <textarea
            className="form-control"
            placeholder="اكتب نص التغريدة أو المنشور هنا..."
            value={draft.text}
            onChange={(e) => setField('text', e.target.value)}
          ></textarea>
          {/* ltr so it reads "0 / 280", not "280 / 0" */}
          <div className={countClass} dir="ltr">{len} / {MAX_CHARS}</div>
        </div>

        <div className="form-group">
          <label>صورة (اختياري)</label>
          <div className={`upload-zone${draft.image ? ' has-image' : ''}`}>
            <input key={fileInputKey} type="file" accept="image/*" onChange={handleImage} />
            <CloudUpload size={34} className="upload-icon" />
            <div className="upload-text">{draft.imageName || 'اضغط لرفع صورة'}</div>
            <div className="upload-hint">PNG، JPG — حجم أقصى 5MB</div>
            {draft.image && (
              <img src={draft.image} className="upload-preview" alt="معاينة" />
            )}
          </div>
        </div>

        <div className="form-group">
          <label>رابط التغريدة على X (اختياري)</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://x.com/EntrClub_KAU/status/..."
            value={draft.link}
            onChange={(e) => setField('link', e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={publishing}
          style={isEditing ? submitStyles.edit : submitStyles.add}
        >
          {submitLabel}
        </button>
        {isEditing && (
          <button type="button" className="btn-cancel" onClick={finishEdit} disabled={publishing}>
            إلغاء التعديل
          </button>
        )}
      </form>

      <PostPreview text={draft.text} image={draft.image} type={draft.type} />
    </div>
  )
}

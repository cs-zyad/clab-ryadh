import { CloudUpload, Send } from 'lucide-react'
import { compressImage } from '../../lib/compressImage.js'
import StarPreview from './StarPreview.jsx'

// Same colours as the posts/events forms: gold to add, green while editing
const submitStyles = {
  add: { background: 'var(--accent-gold)', color: 'var(--primary-navy)', fontSize: '1.1rem' },
  edit: { background: '#4ade80', color: '#fff', fontSize: '1.1rem' },
}

// Same layout as the events form: fields on one side, live preview on the other.
// `photo` is the newly picked image { image, name }; `savedImage` is the star's current one.
export default function StarForm({
  form,
  onChange,
  photo,
  onPhotoChange,
  savedImage,
  isEditing,
  saving,
  onSubmit,
  onCancelEdit,
}) {
  const field = (name) => ({
    value: form[name],
    onChange: (e) => onChange(name, e.target.value),
  })

  async function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      // Compressed right away so the preview shows exactly what will be saved
      onPhotoChange({ image: await compressImage(file), name: file.name })
    } catch (err) {
      console.error(err)
    }
  }

  const image = photo?.image || savedImage || null
  let uploadText = 'اضغط لرفع صورة العضو'
  if (photo) uploadText = photo.name
  else if (savedImage) uploadText = 'صورة محفوظة (اضغط لتغييرها)'

  let submitLabel = <><Send size={18} /> {isEditing ? 'حفظ التعديلات' : 'إضافة النجم للموقع'}</>
  if (saving) submitLabel = 'جاري الحفظ...'

  return (
    <div className="editor-grid">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>اسم العضو <span className="req">*</span></label>
          <input type="text" className="form-control" required placeholder="اسم عضو النادي" {...field('name')} />
        </div>

        <div className="form-group">
          <label>القسم <span className="req">*</span></label>
          <input
            type="text"
            className="form-control"
            required
            placeholder="مثال: التسويق، العلاقات العامة، التطوير التقني..."
            {...field('department')}
          />
        </div>

        <div className="form-group">
          <label>صورة العضو (اختياري)</label>
          <div className={`upload-zone${image ? ' has-image' : ''}`}>
            {/* Remounted when the photo is cleared, so picking the same file again still works */}
            <input key={photo?.name ?? 'empty'} type="file" accept="image/*" onChange={handlePhoto} />
            <CloudUpload size={34} className="upload-icon" />
            <div className="upload-text">{uploadText}</div>
            <div className="upload-hint">PNG، JPG — حجم أقصى 5MB</div>
            {image && <img src={image} className="upload-preview" alt="معاينة" />}
          </div>
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={saving}
          style={isEditing ? submitStyles.edit : submitStyles.add}
        >
          {submitLabel}
        </button>
        {isEditing && (
          <button type="button" className="btn-cancel" onClick={onCancelEdit} disabled={saving}>
            إلغاء التعديل
          </button>
        )}
      </form>

      <StarPreview name={form.name} department={form.department} image={image} />
    </div>
  )
}

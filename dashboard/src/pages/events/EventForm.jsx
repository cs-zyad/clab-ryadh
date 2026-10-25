import { CircleCheck, CircleX, Clock, CloudUpload, GraduationCap, Send, Trophy, UsersRound } from 'lucide-react'
import { compressImage } from '../../lib/compressImage.js'
import TilePicker from '../../components/TilePicker.jsx'
import EventPreview from './EventPreview.jsx'

const CATEGORY_OPTIONS = [
  { value: 'meeting', label: 'لقاءات', Icon: UsersRound },
  { value: 'program', label: 'برامج', Icon: GraduationCap },
  { value: 'competition', label: 'مسابقات', Icon: Trophy },
]

const STATUS_OPTIONS = [
  { value: 'open', label: 'مفتوح للتسجيل', Icon: CircleCheck },
  { value: 'soon', label: 'قريباً', Icon: Clock },
  { value: 'ended', label: 'انتهى', Icon: CircleX },
]

// Same colours as the posts form: gold to add, green while editing
const submitStyles = {
  add: { background: 'var(--accent-gold)', color: 'var(--primary-navy)', fontSize: '1.1rem' },
  edit: { background: '#4ade80', color: '#fff', fontSize: '1.1rem' },
}

// Same layout as the posts form: fields on one side, live preview on the other.
// `poster` is the newly picked image { image, name }; `savedImage` is the event's current one.
export default function EventForm({
  form,
  onChange,
  poster,
  onPosterChange,
  savedImage,
  eventId,
  isEditing,
  saving,
  onSubmit,
  onCancelEdit,
}) {
  const field = (name) => ({
    value: form[name],
    onChange: (e) => onChange(name, e.target.value),
  })

  async function handlePoster(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      // Compressed right away so the preview shows exactly what will be saved
      onPosterChange({ image: await compressImage(file), name: file.name })
    } catch (err) {
      console.error(err)
    }
  }

  const image = poster?.image || savedImage || null
  let uploadText = 'اضغط لرفع صورة البوستر'
  if (poster) uploadText = poster.name
  else if (savedImage) uploadText = 'صورة محفوظة (اضغط لتغييرها)'

  let submitLabel = <><Send size={18} /> {isEditing ? 'تحديث بيانات الفعالية' : 'إضافة الفعالية للموقع'}</>
  if (saving) submitLabel = 'جاري الحفظ...'

  return (
    <div className="editor-grid">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>التصنيف <span className="req">*</span></label>
          <TilePicker
            name="eventCategory"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(value) => onChange('category', value)}
          />
        </div>

        <div className="form-group">
          <label>عنوان الفعالية <span className="req">*</span></label>
          <input type="text" className="form-control" required placeholder="مثال: معسكر رواد الأعمال" {...field('title')} />
        </div>

        <div className="form-group">
          <label>وصف مختصر <span className="req">*</span></label>
          <textarea className="form-control" required placeholder="اكتب نبذة عن الفعالية..." {...field('desc')}></textarea>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label>التاريخ <span className="req">*</span></label>
            <input type="date" className="form-control" required {...field('date')} />
          </div>
          <div className="form-group">
            <label>الوقت <span className="req">*</span></label>
            <input type="time" className="form-control" required {...field('time')} />
          </div>
        </div>

        <div className="form-group">
          <label>مكان اللقاء <span className="req">*</span></label>
          <input type="text" className="form-control" required placeholder="مثال: مقر النادي - مبنى 4" {...field('location')} />
        </div>

        <div className="form-group">
          <label>حالة التسجيل <span className="req">*</span></label>
          <TilePicker
            name="eventStatus"
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={(value) => onChange('status', value)}
          />
        </div>

        <div className="form-group">
          <label>رابط زر التسجيل (اختياري)</label>
          <input type="url" className="form-control" placeholder="https://forms.gle/..." {...field('regLink')} />
        </div>

        <div className="form-group">
          <label>صورة البوستر (اختياري)</label>
          <div className={`upload-zone${image ? ' has-image' : ''}`}>
            {/* Remounted when the poster is cleared, so picking the same file again still works */}
            <input key={poster?.name ?? 'empty'} type="file" accept="image/*" onChange={handlePoster} />
            <CloudUpload size={34} className="upload-icon" />
            <div className="upload-text">{uploadText}</div>
            <div className="upload-hint">PNG، JPG — يُفضَّل بوستر طولي</div>
            {image && <img src={image} className="upload-preview" alt="معاينة البوستر" />}
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

      <EventPreview form={form} image={image} eventId={eventId} />
    </div>
  )
}

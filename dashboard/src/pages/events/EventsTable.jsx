import { memo } from 'react'
import { loadErrorMessage } from '../../hooks/useCollection.js'
import { Calendar, ExternalLink, PenLine, Trash2 } from 'lucide-react'

const CATEGORY_LABELS = { meeting: 'لقاءات', program: 'برامج', competition: 'مسابقات' }
const CATEGORY_TONES = { meeting: 'tone-blue', program: 'tone-purple', competition: 'tone-amber' }

const STATUS_BADGES = {
  open: ['status-open', 'مفتوح'],
  soon: ['status-soon', 'قريباً'],
  ended: ['status-ended', 'انتهى'],
}

const dayFormat = new Intl.DateTimeFormat('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
const timeFormat = new Intl.DateTimeFormat('ar-SA', { hour: '2-digit', minute: '2-digit' })

const messageCell = { textAlign: 'center', padding: '30px', color: '#999' }
const errorCell = { ...messageCell, color: '#dc2626' }

// Same table as the posts page (styles in panel.css). `events` is null while loading.
function EventsTable({ events, error, canEdit, canDelete, onEdit, onDelete }) {
  let rows
  if (events === null && error) {
    rows = <tr><td colSpan={5} style={errorCell}>{loadErrorMessage(error)}</td></tr>
  } else if (events === null) {
    rows = <tr><td colSpan={5} style={messageCell}>جاري التحميل...</td></tr>
  } else if (events.length === 0) {
    rows = <tr><td colSpan={5} style={messageCell}>لا توجد فعاليات مضافة حالياً</td></tr>
  } else {
    rows = events.map((ev) => (
      <EventRow key={ev.id} ev={ev} canEdit={canEdit} canDelete={canDelete} onEdit={onEdit} onDelete={onDelete} />
    ))
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>الفعالية</th>
            <th>التصنيف</th>
            <th>الموعد</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

// The form stores the date ("2026-10-20") and time ("18:00") as separate strings
function formatWhen(date, time) {
  if (!date) return { day: '—', time: '' }
  const d = new Date(`${date}T${time || '00:00'}`)
  if (Number.isNaN(d.getTime())) return { day: date, time: time || '' }
  return { day: dayFormat.format(d), time: time ? timeFormat.format(d) : '' }
}

const EventRow = memo(function EventRow({ ev, canEdit, canDelete, onEdit, onDelete }) {
  const [statusClass, statusLabel] = STATUS_BADGES[ev.status] || ['status-soon', '—']
  const when = formatWhen(ev.date, ev.time)
  const hasActions = ev.regLink || canEdit || canDelete

  return (
    <tr>
      <td>
        <div className="cell-main">
          <div className="cell-thumb">
            {ev.image ? <img src={ev.image} alt="" decoding="async" /> : <Calendar size={20} />}
          </div>
          <div>
            <div className="cell-title">{ev.title}</div>
            {ev.location && <div className="cell-sub">{ev.location}</div>}
          </div>
        </div>
      </td>
      <td data-label="التصنيف">
        <span className={`type-badge ${CATEGORY_TONES[ev.category] || ''}`}>
          {CATEGORY_LABELS[ev.category] || ev.category}
        </span>
      </td>
      <td data-label="الموعد">
        <div>
          <div className="cell-date">{when.day}</div>
          {when.time && <div className="cell-time">{when.time}</div>}
        </div>
      </td>
      <td data-label="الحالة"><span className={`status-badge ${statusClass}`}>{statusLabel}</span></td>
      <td data-label="الإجراءات">
        {hasActions ? (
          // Edit and delete first so they line up on every row; the optional link comes last
          <div className="action-btns">
            {canEdit && (
              <button className="action-btn edit-btn" title="تعديل" onClick={() => onEdit(ev)}>
                <PenLine />
              </button>
            )}
            {canDelete && (
              <button className="action-btn delete-btn" title="حذف" onClick={() => onDelete(ev.id)}>
                <Trash2 />
              </button>
            )}
            {ev.regLink && (
              <a href={ev.regLink} target="_blank" rel="noopener noreferrer" className="action-btn open-btn" title="رابط التسجيل">
                <ExternalLink />
              </a>
            )}
          </div>
        ) : (
          '—'
        )}
      </td>
    </tr>
  )
})

export default memo(EventsTable)

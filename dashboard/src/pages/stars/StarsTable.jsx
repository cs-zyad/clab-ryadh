import { memo } from 'react'
import { loadErrorMessage } from '../../hooks/useCollection.js'
import { PenLine, Star, Trash2 } from 'lucide-react'

const dayFormat = new Intl.DateTimeFormat('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })

const messageCell = { textAlign: 'center', padding: '30px', color: '#999' }
const errorCell = { ...messageCell, color: '#dc2626' }

// Same table as the events/posts pages (styles in panel.css). `stars` is null while loading.
function StarsTable({ stars, error, canEdit, canDelete, onEdit, onDelete }) {
  let rows
  if (stars === null && error) {
    rows = <tr><td colSpan={4} style={errorCell}>{loadErrorMessage(error)}</td></tr>
  } else if (stars === null) {
    rows = <tr><td colSpan={4} style={messageCell}>جاري التحميل...</td></tr>
  } else if (stars.length === 0) {
    rows = <tr><td colSpan={4} style={messageCell}>لا يوجد نجوم مضافون حالياً</td></tr>
  } else {
    rows = stars.map((star) => (
      <StarRow key={star.id} star={star} canEdit={canEdit} canDelete={canDelete} onEdit={onEdit} onDelete={onDelete} />
    ))
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>العضو</th>
            <th>القسم</th>
            <th>التاريخ</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

const StarRow = memo(function StarRow({ star, canEdit, canDelete, onEdit, onDelete }) {
  const date = new Date(star.date)
  const hasActions = canEdit || canDelete

  return (
    <tr>
      <td>
        <div className="cell-main">
          <div className="cell-thumb">
            {star.image ? <img src={star.image} alt="" decoding="async" /> : <Star size={20} />}
          </div>
          <p className="cell-text">{star.name}</p>
        </div>
      </td>
      <td data-label="القسم">
        <span className="type-badge tone-amber">{star.department}</span>
      </td>
      <td data-label="التاريخ">
        <div className="cell-date">{Number.isNaN(date.getTime()) ? '—' : dayFormat.format(date)}</div>
      </td>
      <td data-label="الإجراءات">
        {hasActions ? (
          <div className="action-btns">
            {canEdit && (
              <button className="action-btn edit-btn" title="تعديل" onClick={() => onEdit(star)}>
                <PenLine />
              </button>
            )}
            {canDelete && (
              <button className="action-btn delete-btn" title="حذف" onClick={() => onDelete(star.id)}>
                <Trash2 />
              </button>
            )}
          </div>
        ) : (
          '—'
        )}
      </td>
    </tr>
  )
})

export default memo(StarsTable)

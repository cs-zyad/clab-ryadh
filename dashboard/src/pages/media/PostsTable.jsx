import { memo } from 'react'
import { loadErrorMessage } from '../../hooks/useCollection.js'
import { Calendar, ExternalLink, Image as ImageIcon, MessageSquareText, PenLine, Trash2 } from 'lucide-react'
import { TYPE_LABELS, TYPE_TONES } from './constants.js'

const TYPE_ICONS = { tweet: MessageSquareText, photo: ImageIcon, event: Calendar }

const dayFormat = new Intl.DateTimeFormat('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
const timeFormat = new Intl.DateTimeFormat('ar-SA', { hour: '2-digit', minute: '2-digit' })

const messageCell = { textAlign: 'center', padding: '30px', color: '#999' }
const errorCell = { ...messageCell, color: '#dc2626' }

// Same table as the events page (styles in panel.css). `liveId` is the post shown on the homepage.
function PostsTable({ posts, error, liveId, canEdit, canDelete, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>المنشور</th>
            <th>النوع</th>
            <th>التاريخ</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {error && posts.length === 0 ? (
            <tr><td colSpan={5} style={errorCell}>{loadErrorMessage(error)}</td></tr>
          ) : posts.length === 0 ? (
            <tr><td colSpan={5} style={messageCell}>لا توجد منشورات حتى الآن</td></tr>
          ) : (
            posts.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                isLive={post.id === liveId}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const PostRow = memo(function PostRow({ post, isLive, canEdit, canDelete, onEdit, onDelete }) {
  const TypeIcon = TYPE_ICONS[post.type] || MessageSquareText
  const date = new Date(post.date)
  const hasActions = post.link || canEdit || canDelete

  return (
    <tr className={isLive ? 'is-live' : undefined}>
      <td>
        <div className="cell-main">
          <div className="cell-thumb">
            {post.image ? <img src={post.image} alt="" decoding="async" /> : <TypeIcon size={20} />}
          </div>
          <p className="cell-text" title={post.text}>{post.text}</p>
        </div>
      </td>
      <td data-label="النوع">
        <span className={`type-badge ${TYPE_TONES[post.type] || ''}`}>{TYPE_LABELS[post.type]}</span>
      </td>
      <td data-label="التاريخ">
        <div>
          <div className="cell-date">{dayFormat.format(date)}</div>
          <div className="cell-time">{timeFormat.format(date)}</div>
        </div>
      </td>
      <td data-label="الحالة">
        {isLive ? (
          <span className="status-badge status-open">● معروض في الموقع</span>
        ) : (
          <span className="status-badge status-hidden">غير معروض</span>
        )}
      </td>
      <td data-label="الإجراءات">
        {hasActions ? (
          // Edit and delete first (same order as the events table) so they line up on
          // every row; the optional link comes last
          <div className="action-btns">
            {canEdit && (
              <button className="action-btn edit-btn" title="تعديل" onClick={() => onEdit(post)}>
                <PenLine />
              </button>
            )}
            {canDelete && (
              <button className="action-btn delete-btn" title="حذف" onClick={() => onDelete(post.id)}>
                <Trash2 />
              </button>
            )}
            {post.link && (
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="action-btn open-btn" title="فتح الرابط">
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

export default memo(PostsTable)

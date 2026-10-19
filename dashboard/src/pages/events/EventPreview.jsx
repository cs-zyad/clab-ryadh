import { memo } from 'react'
import { Calendar, Clock, Image as ImageIcon } from 'lucide-react'

// Same wording the activities page (activities/index.html) uses for each status
const STATUS = {
  open: { text: 'متاح الآن', tone: 'open', label: 'التسجيل متاح', action: 'التفاصيل' },
  soon: { text: 'قريباً', tone: 'soon', action: 'التفاصيل' },
  ended: { text: 'انتهى التسجيل', tone: 'ended', action: 'انتهى', stamp: 'انتهى' },
}

// Live preview: a compact version of the ticket card shown on the website's activities page
function EventPreview({ form, image, eventId }) {
  const status = STATUS[form.status] || STATUS.open

  return (
    <aside className="preview-panel">
      <div className={`ticket-preview${form.status === 'ended' ? ' ended' : ''}`}>
        {status.stamp && <div className="tp-stamp">{status.stamp}</div>}

        <div className="tp-poster">
          {image ? <img src={image} alt="" /> : <ImageIcon size={30} />}
        </div>

        <div className="tp-body">
          <div className="tp-top">
            {status.label && <span className="tp-label">{status.label}</span>}
            <span className={`tp-status ${status.tone}`}>{status.text}</span>
          </div>
          <h4 className={`tp-title${form.title ? '' : ' empty'}`}>{form.title || 'عنوان الفعالية'}</h4>
          <p className={`tp-desc${form.desc ? '' : ' empty'}`}>{form.desc || 'سيظهر وصف الفعالية هنا...'}</p>
          <div className="tp-meta">
            <span><Calendar size={15} /> {form.date || '----/--/--'}</span>
            <span><Clock size={15} /> {form.time || '--:--'}</span>
          </div>
        </div>

        <div className="tp-divider">
          <span className="tp-cut start"></span>
          <span className="tp-cut end"></span>
        </div>

        <div className="tp-side">
          <span className="tp-id">TR-{eventId ? eventId.slice(-4) : '0000'}</span>
          <span className="tp-action">{status.action}</span>
        </div>
      </div>
    </aside>
  )
}

export default memo(EventPreview)

import { memo } from 'react'
import logoUrl from '@site/assets/image.png'
import { TYPE_LABELS, TYPE_TONES } from './constants.js'

const dateFormat = new Intl.DateTimeFormat('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })

function PostPreview({ text, image, type }) {
  return (
    <aside className="preview-panel">
      <div className="preview-card">
        <div className="preview-header">
          <div className="preview-avatar">
            <img src={logoUrl} alt="شعار النادي" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
          <div>
            <div className="preview-name">نادي ريادة الأعمال</div>
            <div className="preview-handle">@EntrClub_KAU</div>
          </div>
        </div>
        <div className={`preview-text${text ? '' : ' empty'}`}>
          {text || 'سيظهر نص المنشور هنا...'}
        </div>
        {image && <img src={image} className="preview-image" style={{ display: 'block' }} alt="صورة المنشور" />}
        <div className="preview-footer">
          <span className="preview-date">{dateFormat.format(new Date())}</span>
          <span className={`type-badge ${TYPE_TONES[type]}`}>{TYPE_LABELS[type]}</span>
        </div>
      </div>
    </aside>
  )
}

export default memo(PostPreview)

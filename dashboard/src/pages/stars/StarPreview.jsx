import { memo } from 'react'
import { Star, User } from 'lucide-react'

// Live preview: a compact version of the star card shown on the website's members page
function StarPreview({ name, department, image }) {
  return (
    <aside className="preview-panel">
      <div className="star-preview-card">
        <div className="star-preview-photo">
          {image ? <img src={image} alt="" /> : <User size={34} />}
          <span className="star-preview-badge"><Star size={14} /></span>
        </div>
        <h4 className={`star-preview-title${department ? '' : ' empty'}`}>
          {department ? `نجم ${department}` : 'نجم القسم'}
        </h4>
        <p className={`star-preview-name${name ? '' : ' empty'}`}>{name || 'اسم العضو'}</p>
      </div>
    </aside>
  )
}

export default memo(StarPreview)

import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import StarsTable from './StarsTable.jsx'

// "نجوم الشهر المضافة" tab
export default function StarsListPage() {
  const { stars, starsError, startEdit, deleteStar } = useOutletContext()
  const { can } = useAuth()

  return (
    <>
      <div className="list-header">
        <h3>نجوم الشهر المضافة</h3>
      </div>

      <StarsTable
        stars={stars}
        error={starsError}
        canEdit={can('stars_edit')}
        canDelete={can('stars_delete')}
        onEdit={startEdit}
        onDelete={deleteStar}
      />
    </>
  )
}

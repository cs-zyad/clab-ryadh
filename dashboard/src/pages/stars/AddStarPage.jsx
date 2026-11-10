import { Navigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import StarForm from './StarForm.jsx'

// "إضافة نجم جديد" tab (also used to edit a star picked from the list)
export default function AddStarPage() {
  const ctx = useOutletContext()
  const { can } = useAuth()

  const isEditing = ctx.editing !== null
  if (!can(isEditing ? 'stars_edit' : 'stars_create')) {
    return <Navigate to="/stars/list" replace />
  }

  return (
    <>
      <h3>{isEditing ? 'تعديل النجم' : 'إضافة نجم جديد'}</h3>
      <p className="section-hint">
        {isEditing
          ? 'عدّل البيانات ثم اضغط حفظ التعديلات.'
          : 'يظهر العضو فوراً في قسم نجوم الشهر بصفحة أعضاء النادي.'}
      </p>
      <StarForm
        form={ctx.form}
        onChange={ctx.updateField}
        photo={ctx.photo}
        onPhotoChange={ctx.setPhoto}
        savedImage={ctx.editing?.image}
        isEditing={isEditing}
        saving={ctx.saving}
        onSubmit={ctx.handleSubmit}
        onCancelEdit={ctx.cancelEdit}
      />
    </>
  )
}

import { Navigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import EventForm from './EventForm.jsx'

// "إضافة فعالية جديدة" tab (also used to edit an event picked from the list)
export default function AddEventPage() {
  const ctx = useOutletContext()
  const { can } = useAuth()

  const isEditing = ctx.editing !== null
  if (!can(isEditing ? 'events_edit' : 'events_create')) {
    return <Navigate to="/events/list" replace />
  }

  return (
    <>
      <h3>{isEditing ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}</h3>
      <p className="section-hint">
        {isEditing
          ? 'عدّل البيانات ثم اضغط تحديث بيانات الفعالية.'
          : 'تظهر الفعالية فوراً في صفحة الأنشطة في الموقع.'}
      </p>
      <EventForm
        form={ctx.form}
        onChange={ctx.updateField}
        poster={ctx.poster}
        onPosterChange={ctx.setPoster}
        savedImage={ctx.editing?.image}
        eventId={ctx.editing?.id}
        isEditing={isEditing}
        saving={ctx.saving}
        onSubmit={ctx.handleSubmit}
        onCancelEdit={ctx.cancelEdit}
      />
    </>
  )
}

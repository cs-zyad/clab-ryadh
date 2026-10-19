import { Navigate, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import PostForm from './PostForm.jsx'

// "إضافة منشور جديد" tab (also used to edit a post picked from the list)
export default function AddPostPage() {
  const { draft, setDraft, showToast } = useOutletContext()
  const { can } = useAuth()
  const navigate = useNavigate()

  const isEditing = draft.editingId !== null
  if (!can(isEditing ? 'posts_edit' : 'posts_create')) {
    return <Navigate to="/media/posts" replace />
  }

  return (
    <>
      <h3>{isEditing ? 'تعديل المنشور' : 'إضافة منشور جديد'}</h3>
      <p className="section-hint">
        {isEditing
          ? 'عدّل المحتوى ثم اضغط حفظ التعديلات.'
          : 'يظهر المنشور فوراً في قسم أحدث الأخبار في الصفحة الرئيسية.'}
      </p>
      <PostForm
        draft={draft}
        setDraft={setDraft}
        showToast={showToast}
        onEditDone={() => navigate('/media/posts')}
      />
    </>
  )
}

import { useCallback, useMemo } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/db.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import FilterTabs from '../../components/FilterTabs.jsx'
import PostsTable from './PostsTable.jsx'
import { SAVED_IMAGE_LABEL, TYPE_LABELS } from './constants.js'

const FILTERS = [
  ['all', 'الكل'],
  ['tweet', 'تغريدات'],
  ['photo', 'صور'],
  ['event', 'فعاليات'],
]

// "المنشورات المضافة" tab
export default function PostsPage() {
  const { posts, postsError, filter, setFilter, setDraft, showToast } = useOutletContext()
  const { can } = useAuth()
  const navigate = useNavigate()

  const filtered = useMemo(
    () => (filter === 'all' ? posts : posts.filter((p) => p.type === filter)),
    [posts, filter],
  )

  // Load the post into the form on the first tab
  const editPost = useCallback(
    (post) => {
      setDraft({
        type: TYPE_LABELS[post.type] ? post.type : 'tweet',
        text: post.text || '',
        image: post.image || null,
        imageName: post.image ? SAVED_IMAGE_LABEL : '',
        link: post.link || '',
        editingId: post.id,
      })
      navigate('/media')
    },
    [setDraft, navigate],
  )

  const deletePost = useCallback(
    async (id) => {
      if (!confirm('حذف هذا المنشور؟')) return
      try {
        await deleteDoc(doc(db, 'posts', id))
        showToast('تم الحذف بنجاح!')
      } catch (err) {
        console.error('Error deleting document: ', err)
        showToast('❌ فشل الحذف')
      }
    },
    [showToast],
  )

  return (
    <>
      <div className="list-header">
        <h3>المنشورات المضافة</h3>
        <FilterTabs filters={FILTERS} items={posts} field="type" value={filter} onChange={setFilter} />
      </div>

      <PostsTable
        posts={filtered}
        error={postsError}
        // The homepage shows only the newest post
        liveId={posts[0]?.id}
        canEdit={can('posts_edit')}
        canDelete={can('posts_delete')}
        onEdit={editPost}
        onDelete={deletePost}
      />
    </>
  )
}

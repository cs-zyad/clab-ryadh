import { useCallback, useMemo } from 'react'
import { UsersRound } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../lib/firebase.js'
import { db } from '../../lib/db.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { emptyPermissions } from '../../auth/permissions.js'
import { loadErrorMessage, useCollection } from '../../hooks/useCollection.js'
import { usePageShell } from '../../hooks/usePageShell.js'
import { useToast } from '../../hooks/useToast.js'
import PanelPage from '../../components/PanelPage.jsx'
import NewUserForm from './NewUserForm.jsx'
import UserCard from './UserCard.jsx'
import '../../styles/panel.css'
import './users.css'

const messageStyle = { textAlign: 'center', padding: '30px', color: '#999' }

// Admins first, then alphabetical
function compareUsers(a, b) {
  const byAdmin = Number(b.admin === true) - Number(a.admin === true)
  return byAdmin || String(a.name || a.email || '').localeCompare(String(b.name || b.email || ''), 'ar')
}

export default function UsersPage() {
  usePageShell('لوحة التحكم | إدارة المستخدمين والصلاحيات', 'page-panel tone-violet')
  const { user } = useAuth()
  // No orderBy: it would hide profiles missing the field (e.g. the first admin added by hand)
  const [users, usersError] = useCollection('users')
  const visibleUsers = useMemo(
    () => users && users.filter((u) => u.deleted !== true).sort(compareUsers),
    [users],
  )
  const [toast, showToast] = useToast()

  const updateUser = useCallback(
    async (uid, changes, successMsg = '✅ تم حفظ التغييرات') => {
      try {
        await updateDoc(doc(db, 'users', uid), changes)
        showToast(successMsg)
      } catch (err) {
        console.error(err)
        showToast('❌ فشل الحفظ')
      }
    },
    [showToast],
  )

  // Deleting the Firebase Auth login itself needs the Admin SDK (paid plan), so the
  // profile is marked deleted instead: hidden here, blocked from signing in, and
  // restored if the same email is added again.
  const deleteUser = useCallback(
    async (u) => {
      if (!confirm(`حذف حساب "${u.name || u.email}"؟ لن يتمكن من الدخول إلى لوحة التحكم.`)) return
      await updateUser(
        u.id,
        { deleted: true, active: false, admin: false, permissions: emptyPermissions() },
        '🗑️ تم حذف الحساب',
      )
    },
    [updateUser],
  )

  const sendReset = useCallback(
    async (email) => {
      if (!confirm(`إرسال رابط تعيين كلمة المرور إلى ${email}؟`)) return
      try {
        await sendPasswordResetEmail(auth, email)
        showToast('📧 تم إرسال رابط تعيين كلمة المرور')
      } catch (err) {
        console.error(err)
        showToast('❌ تعذّر إرسال الرابط')
      }
    },
    [showToast],
  )

  let list
  if (visibleUsers === null && usersError) list = <p style={{ ...messageStyle, color: '#dc2626' }}>{loadErrorMessage(usersError)}</p>
  else if (visibleUsers === null) list = <p style={messageStyle}>جاري التحميل...</p>
  else if (visibleUsers.length === 0) list = <p style={messageStyle}>لا يوجد مستخدمون حالياً</p>
  else {
    list = visibleUsers.map((u) => (
      <UserCard
        key={u.id}
        user={u}
        isSelf={u.id === user.uid}
        onUpdate={updateUser}
        onDelete={deleteUser}
        onSendReset={sendReset}
      />
    ))
  }

  return (
    <>
      <PanelPage title="المستخدمون والصلاحيات" icon={UsersRound}>
        <h3>إضافة مستخدم جديد</h3>
        <NewUserForm users={users} showToast={showToast} />

        <div className="manage-section">
          <h3>المستخدمون والصلاحيات</h3>
          <p className="section-hint">أي تغيير في الصلاحيات يُحفظ مباشرة ويُطبَّق على المستخدم فوراً.</p>
          <div className="users-list">{list}</div>
        </div>
      </PanelPage>

      <div className={`toast${toast.show ? ' show' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        <span>{toast.msg}</span>
      </div>
    </>
  )
}

import { useState } from 'react'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../lib/firebase.js'
import { db } from '../../lib/db.js'
import { createAccount } from '../../lib/createAccount.js'
import { emptyPermissions } from '../../auth/permissions.js'
import PermissionEditor from './PermissionEditor.jsx'

const ERROR_MESSAGES = {
  'auth/email-already-in-use': '❌ هذا البريد الإلكتروني مستخدم مسبقاً',
  'auth/invalid-email': '❌ البريد الإلكتروني غير صحيح',
  'auth/weak-password': '❌ كلمة المرور ضعيفة (6 أحرف على الأقل)',
  'auth/operation-not-allowed': '❌ تسجيل الدخول بالبريد غير مفعّل في Firebase',
  'permission-denied': '❌ قواعد Firestore رفضت حفظ المستخدم (permission-denied)',
}

const errorMessage = (err) => ERROR_MESSAGES[err.code] || `❌ حدث خطأ: ${err.code || err.message}`

const emptyForm = () => ({ name: '', email: '', password: '', admin: false, permissions: emptyPermissions() })

// `users` is every profile, including deleted ones (used to restore a deleted account)
export default function NewUserForm({ users, showToast }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const setField = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    // Firebase Auth stores emails in lowercase
    const email = form.email.trim().toLowerCase()
    const existing = users?.find((u) => (u.email || '').toLowerCase() === email)
    if (existing && existing.deleted !== true) {
      showToast(ERROR_MESSAGES['auth/email-already-in-use'])
      return
    }

    const profile = {
      name: form.name.trim(),
      email,
      admin: form.admin,
      active: true,
      deleted: false,
      permissions: form.permissions,
    }

    setSaving(true)
    try {
      if (existing) {
        // A deleted account keeps its Firebase login (and old password), so restore the
        // profile and let the person choose a new password from the reset email
        await updateDoc(doc(db, 'users', existing.id), profile)
        await sendPasswordResetEmail(auth, email)
        showToast('✅ تمت استعادة الحساب، وأُرسل رابط تعيين كلمة المرور إلى بريده')
      } else {
        const uid = await createAccount(email, form.password)
        await setDoc(doc(db, 'users', uid), { ...profile, createdAt: new Date().toISOString() })
        showToast('✅ تمت إضافة المستخدم!')
      }
      setForm(emptyForm())
    } catch (err) {
      console.error('Error adding user: ', err)
      showToast(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="grid-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>الاسم</label>
        <input type="text" className="form-control" required placeholder="مثال: عبدالله أحمد" value={form.name} onChange={setField('name')} />
      </div>
      <div className="form-group">
        <label>البريد الإلكتروني</label>
        <input type="email" className="form-control" required placeholder="name@example.com" autoComplete="off" value={form.email} onChange={setField('email')} />
      </div>
      <div className="form-group full-width">
        <label>كلمة المرور (6 أحرف على الأقل)</label>
        <input type="password" className="form-control" required minLength={6} autoComplete="new-password" placeholder="••••••••" value={form.password} onChange={setField('password')} />
      </div>
      <div className="form-group full-width">
        <label>الصلاحيات</label>
        <PermissionEditor
          admin={form.admin}
          permissions={form.permissions}
          onAdminChange={(admin) => setForm((f) => ({ ...f, admin }))}
          onPermissionChange={(key, value) =>
            setForm((f) => ({ ...f, permissions: { ...f.permissions, [key]: value } }))
          }
        />
      </div>
      <div className="form-group full-width">
        <button
          type="submit"
          className="btn-submit"
          disabled={saving}
          style={{ background: 'var(--accent-gold)', color: 'var(--primary-navy)', fontSize: '1.1rem' }}
        >
          {saving ? 'جاري الإضافة...' : 'إضافة المستخدم'}
        </button>
      </div>
    </form>
  )
}

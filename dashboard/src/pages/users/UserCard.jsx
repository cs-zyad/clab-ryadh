import { memo } from 'react'
import PermissionEditor from './PermissionEditor.jsx'
import Switch from './Switch.jsx'

function UserCard({ user, isSelf, onUpdate, onDelete, onSendReset }) {
  const active = user.active === true
  const initial = String(user.name || user.email || '?').trim().charAt(0).toUpperCase()

  return (
    <div className={`user-card${active ? '' : ' inactive'}`}>
      <div className="user-head">
        <div className="user-avatar">{initial}</div>
        <div className="user-id">
          <div className="user-name">
            {user.name ? String(user.name) : '—'}
            {isSelf && <span className="tag tag-self">أنت</span>}
          </div>
          <div className="user-email">{String(user.email || '')}</div>
        </div>
        <div className="user-tags">
          {user.admin === true && <span className="tag tag-admin">مدير النظام</span>}
          <span className={`tag ${active ? 'tag-active' : 'tag-inactive'}`}>{active ? 'مفعّل' : 'موقوف'}</span>
        </div>
      </div>

      <PermissionEditor
        admin={user.admin === true}
        permissions={user.permissions && typeof user.permissions === 'object' ? user.permissions : {}}
        // You can't remove your own admin rights or deactivate yourself (avoids locking everyone out)
        lockAdmin={isSelf}
        onAdminChange={(admin) =>
          onUpdate(user.id, { admin }, admin ? '✅ تم منح صلاحية المدير' : '✅ تم سحب صلاحية المدير')
        }
        onPermissionChange={(key, value) => onUpdate(user.id, { [`permissions.${key}`]: value })}
      />

      <div className="user-actions">
        <Switch
          label="الحساب مفعّل"
          checked={active}
          disabled={isSelf}
          onChange={(value) =>
            onUpdate(user.id, { active: value }, value ? '✅ تم تفعيل الحساب' : '⛔ تم إيقاف الحساب')
          }
        />
        <div className="user-links">
          <button type="button" className="link-btn" onClick={() => onSendReset(user.email)}>
            إرسال رابط تعيين كلمة المرور
          </button>
          {!isSelf && (
            <button type="button" className="link-btn danger" onClick={() => onDelete(user)}>
              حذف الحساب
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(UserCard)

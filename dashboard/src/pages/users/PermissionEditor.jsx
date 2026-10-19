import { PERMISSION_GROUPS, viewKey } from '../../auth/permissions.js'
import Switch from './Switch.jsx'

// Toggles for the admin flag and every permission. Shows *effective* access:
// admins have everything, and actions are off while the section's view is off.
export default function PermissionEditor({ admin, permissions = {}, onAdminChange, onPermissionChange, lockAdmin = false }) {
  return (
    <div className="perm-editor">
      <Switch
        label="مدير النظام — جميع الصلاحيات وإدارة المستخدمين"
        checked={admin}
        disabled={lockAdmin}
        onChange={onAdminChange}
      />
      {admin && <p className="admin-note">المدير يملك جميع الصلاحيات تلقائياً.</p>}

      <div className="perm-groups">
        {PERMISSION_GROUPS.map((group) => {
          const canView = admin || permissions[viewKey(group.id)] === true
          return (
            <div className="perm-group" key={group.id}>
              <h4>{group.title}</h4>
              {group.permissions.map(({ key, label }) => {
                const isView = key === viewKey(group.id)
                return (
                  <Switch
                    key={key}
                    label={label}
                    checked={admin || (permissions[key] === true && (isView || canView))}
                    disabled={admin || (!isView && !canView)}
                    onChange={(value) => onPermissionChange(key, value)}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

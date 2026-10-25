// Every permission a user can be given. Keys are stored in users/{uid}.permissions and
// checked by firestore.rules, so keep the two in sync when adding one.
export const PERMISSION_GROUPS = [
  {
    id: 'posts',
    title: 'الأخبار والمنشورات',
    permissions: [
      { key: 'posts_view', label: 'عرض الأخبار والمنشورات' },
      { key: 'posts_create', label: 'إضافة منشور' },
      { key: 'posts_edit', label: 'تعديل منشور' },
      { key: 'posts_delete', label: 'حذف منشور' },
    ],
  },
  {
    id: 'events',
    title: 'الفعاليات والأنشطة',
    permissions: [
      { key: 'events_view', label: 'عرض الفعاليات' },
      { key: 'events_create', label: 'إضافة فعالية' },
      { key: 'events_edit', label: 'تعديل فعالية' },
      { key: 'events_delete', label: 'حذف فعالية' },
    ],
  },
]

export const viewKey = (sectionId) => `${sectionId}_view`

// Only admins get a label; everyone else is shown by name only
export const roleLabel = (profile) => (profile?.admin === true ? 'مدير النظام' : '')

export const displayName = (profile) => String(profile?.name || profile?.email || '')

export function emptyPermissions() {
  return Object.fromEntries(
    PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => [p.key, false])),
  )
}

// Admins can do everything. Other users need the permission itself plus the
// section's view permission (posts_create is useless without posts_view).
export function hasPermission(profile, key) {
  if (!profile || profile.active !== true) return false
  if (profile.admin === true) return true
  if (key === 'admin') return false
  const perms = profile.permissions || {}
  const section = key.split('_')[0]
  return perms[key] === true && perms[viewKey(section)] === true
}

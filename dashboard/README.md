# Admin Dashboard (React + Vite)

React version of the old `admin/` HTML pages, with Firebase Authentication and per-user permissions.
Same design and the same Firestore data (`posts`, `events`) that the public site reads.

## Run

```bash
cd dashboard
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dashboard/dist
```

## Routes

| Path           | Page                         | Needs            |
| -------------- | ---------------------------- | ---------------- |
| `/login`       | Login                        | —                |
| `/`            | Section chooser              | signed in        |
| `/events`      | Events – add / edit tab      | `events_view` + `events_create` (or `events_edit` while editing) |
| `/events/list` | Events – list tab (filters + table) | `events_view` |
| `/media`       | Posts – add / edit tab       | `posts_view` + `posts_create` (or `posts_edit` while editing) |
| `/media/posts` | Posts – list tab (filters + table) | `posts_view` |
| `/users`       | Users & permissions          | admin            |

## Accounts & permissions

Accounts are Firebase Auth users. Each one has a profile document `users/{uid}`:

```js
{
  name: 'Abdullah', email: 'a@example.com',
  active: true,           // false = blocked from signing in
  admin: false,           // true = every permission + the users page
  permissions: {
    posts_view: true,  posts_create: true,  posts_edit: false, posts_delete: false,
    events_view: true, events_create: false, events_edit: false, events_delete: false,
  },
}
```

- An action only counts if the section's `_view` permission is on too.
- The list of permissions lives in `src/auth/permissions.js`; `firestore.rules` (repo root) enforces the same rules on the database. Keep them in sync when adding a permission.
- Buttons and pages the user can't use are hidden; the rules block the action even if someone calls Firebase directly.
- Permission changes apply live — the user doesn't need to sign in again.

### One-time setup

1. **Firebase Console → Authentication → Sign-in method** → enable **Email/Password**.
2. **Authentication → Users → Add user** → create the first admin's email + password. Copy its **User UID**.
3. **Firestore Database → Data → Start collection** `users` → Document ID = that UID, fields:
   - `name` (string), `email` (string)
   - `admin` (boolean) = `true`
   - `active` (boolean) = `true`
4. **Firestore Database → Rules** → paste the contents of `firestore.rules` → **Publish**
   (or `firebase deploy --only firestore:rules` with the Firebase CLI).

After that, the admin signs in and adds everyone else from the **إدارة المستخدمين والصلاحيات** card.

### Free (Spark) plan notes

- New accounts are created from the dashboard with a temporary second Firebase app instance, so the admin stays signed in — no Cloud Functions needed.
- **حذف الحساب** in the dashboard marks the profile `deleted: true`: it disappears from the list and can't sign in. The Firebase Auth login itself stays (removing it needs the Admin SDK / paid plan), so adding the same email again restores the account and emails a password-reset link. To remove the login completely, delete it in Firebase Console → Authentication.
- Admins can't change someone's password directly; they can send a password-reset email.

## Structure

```
src/
  auth/          AuthContext (Firebase Auth + live profile), permissions, route guards
  hooks/         useCollection (live Firestore), useToast, usePageShell
  lib/           firebase (app + auth), db (Firestore), createAccount, image compression
  pages/
    portal/      login + chooser
    events/      layout (tabs), add/edit event tab, events list tab
    media/       layout (tabs), add/edit post tab (form + preview), posts list tab
    users/       new-user form, user cards, permission switches
  routes/        lazy-loaded page chunks
  styles/        base + shared light panel styles
```

- The Firebase config and the club logo come from the main site (`../js/firebase-config.js`, `../assets/image.png`) via the `@site` alias.
- Each page's CSS is scoped by a class on `<body>`: `page-portal` (login, chooser), `page-panel` (events, users, media frame) and `page-media` (media extras).
- The login page loads only Firebase Auth; Firestore and the section pages load after sign-in.

## Hosting notes

- It's a single-page app: the host must serve `index.html` for every path (SPA fallback), otherwise refreshing `/media/posts` gives a 404.
- If it's served under a sub-path (e.g. `/admin/`), build with `npx vite build --base=/admin/`.
- "معاينة الموقع" opens the public site at https://clab-ryadh1.vercel.app/. If the site moves to another domain, set `VITE_SITE_URL` in `dashboard/.env.local`.

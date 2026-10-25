// Shared by React.lazy and by hover-prefetching on the chooser cards,
// so both resolve to the same cached chunk.
export const loadEvents = () => import('../pages/events/index.js')
export const loadMedia = () => import('../pages/media/index.js')
export const loadUsers = () => import('../pages/users/UsersPage.jsx')

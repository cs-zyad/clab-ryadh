import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { GuestRoute, ProtectedRoute, RequirePermission } from './auth/routeGuards.jsx'
import LoginPage from './pages/portal/LoginPage.jsx'
import ChooserPage from './pages/portal/ChooserPage.jsx'
import { loadEvents, loadMedia, loadUsers } from './routes/loaders.js'

// Events, media and users pages (and the Firestore SDK they pull in) are split into
// their own chunks, so the login screen loads without them.
const UsersPage = lazy(loadUsers)
const EventsLayout = lazy(() => loadEvents().then((m) => ({ default: m.EventsLayout })))
const AddEventPage = lazy(() => loadEvents().then((m) => ({ default: m.AddEventPage })))
const EventsListPage = lazy(() => loadEvents().then((m) => ({ default: m.EventsListPage })))
const MediaLayout = lazy(() => loadMedia().then((m) => ({ default: m.MediaLayout })))
const AddPostPage = lazy(() => loadMedia().then((m) => ({ default: m.AddPostPage })))
const PostsPage = lazy(() => loadMedia().then((m) => ({ default: m.PostsPage })))

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<ChooserPage />} />

                {/* Events and media share one structure: an "add" tab and a "list" tab */}
                <Route element={<RequirePermission permission="events_view" />}>
                  <Route path="/events" element={<EventsLayout />}>
                    <Route index element={<AddEventPage />} />
                    <Route path="list" element={<EventsListPage />} />
                  </Route>
                </Route>

                <Route element={<RequirePermission permission="posts_view" />}>
                  <Route path="/media" element={<MediaLayout />}>
                    <Route index element={<AddPostPage />} />
                    <Route path="posts" element={<PostsPage />} />
                  </Route>
                </Route>

                <Route element={<RequirePermission permission="admin" />}>
                  <Route path="/users" element={<UsersPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}

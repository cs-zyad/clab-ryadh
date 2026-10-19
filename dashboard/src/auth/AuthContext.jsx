import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../lib/firebase.js'
import { hasPermission } from './permissions.js'

const AuthContext = createContext(null)

// status:
//   'init'      – first check on page load (render nothing yet)
//   'signedOut' – no user
//   'loading'   – just signed in, loading the user's permissions
//   'ready'     – signed in with an active profile
export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'init', user: null, profile: null })
  // { reason: 'no-profile' | 'inactive' | 'deleted' | 'error', uid } after an account was signed out
  // because it has no usable profile
  const [notice, setNotice] = useState(null)
  const stopProfile = useRef(null)

  const endProfileListener = () => {
    stopProfile.current?.()
    stopProfile.current = null
  }

  useEffect(() => {
    let cancelled = false

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      endProfileListener()
      if (!user) {
        setState({ status: 'signedOut', user: null, profile: null })
        return
      }
      // On page load stay in 'init' so the login page doesn't flash before the redirect
      setState((s) => (s.status === 'init' ? s : { status: 'loading', user, profile: null }))

      // Firestore is loaded on demand so the login page doesn't download it
      const [{ doc, onSnapshot }, { db }] = await Promise.all([
        import('firebase/firestore'),
        import('../lib/db.js'),
      ])
      if (cancelled || auth.currentUser?.uid !== user.uid) return

      const blockAccount = (reason) => {
        endProfileListener()
        setNotice({ reason, uid: user.uid })
        signOut(auth)
      }

      // Live listener: permission changes made by an admin apply immediately
      stopProfile.current = onSnapshot(
        doc(db, 'users', user.uid),
        (snap) => {
          if (!snap.exists()) {
            console.warn(`No profile document at users/${user.uid}`)
            blockAccount('no-profile')
            return
          }
          const profile = snap.data()
          if (profile.deleted === true) {
            blockAccount('deleted')
          } else if (profile.active === true) {
            setState({ status: 'ready', user, profile })
          } else {
            console.warn(`users/${user.uid} has active =`, profile.active, `(${typeof profile.active})`)
            blockAccount('inactive')
          }
        },
        (err) => {
          console.error('Error loading profile: ', err)
          blockAccount('error')
        },
      )
    })

    return () => {
      cancelled = true
      unsubAuth()
      endProfileListener()
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setNotice(null)
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const logout = useCallback(() => {
    endProfileListener()
    return signOut(auth)
  }, [])

  const { status, user, profile } = state
  const can = useCallback((key) => hasPermission(profile, key), [profile])

  const value = useMemo(
    () => ({ status, user, profile, notice, can, login, logout }),
    [status, user, profile, notice, can, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

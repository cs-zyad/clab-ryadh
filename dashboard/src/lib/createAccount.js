import { deleteApp, initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  inMemoryPersistence,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { firebaseConfig } from '@site/js/firebase-config.js'

// Creating a user on the main Auth instance would sign the admin out and sign in as the
// new user. A short-lived second app instance creates the account without touching the
// admin's session (and needs no Cloud Functions, so it works on the free plan).
// Returns the new account's UID.
export async function createAccount(email, password) {
  const tempApp = initializeApp(firebaseConfig, `create-account-${Date.now()}`)
  const tempAuth = initializeAuth(tempApp, { persistence: inMemoryPersistence })
  try {
    try {
      const { user } = await createUserWithEmailAndPassword(tempAuth, email, password)
      return user.uid
    } catch (err) {
      if (err.code !== 'auth/email-already-in-use') throw err
      // The login exists but has no profile (an earlier attempt failed half-way).
      // If the admin typed that account's password, sign in to recover its UID.
      try {
        const { user } = await signInWithEmailAndPassword(tempAuth, email, password)
        return user.uid
      } catch {
        throw err
      }
    }
  } finally {
    // Cleanup problems must never hide an account that was already created
    await signOut(tempAuth).catch(() => {})
    await deleteApp(tempApp).catch(() => {})
  }
}

import { initializeApp } from 'firebase/app'
import { browserSessionPersistence, initializeAuth } from 'firebase/auth'
import { firebaseConfig } from '@site/js/firebase-config.js'

export const app = initializeApp(firebaseConfig)

// Session persistence: closing the tab signs out, like the old dashboard did
export const auth = initializeAuth(app, { persistence: browserSessionPersistence })

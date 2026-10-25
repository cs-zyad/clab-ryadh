import { getFirestore } from 'firebase/firestore'
import { app } from './firebase.js'

// Kept separate from firebase.js so the login page can load Auth without the Firestore SDK
export const db = getFirestore(app)

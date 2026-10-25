import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/db.js'

// Live list of a Firestore collection, newest first when `orderField` is given.
// Returns [items, error]: items is null until the first snapshot arrives;
// error is the Firestore error (e.g. permission-denied) if the read was refused.
export function useCollection(name, orderField) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ref = collection(db, name)
    const q = orderField ? query(ref, orderBy(orderField, 'desc')) : ref
    return onSnapshot(
      q,
      (snapshot) => {
        setError(null)
        setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
      },
      (err) => {
        console.error(`Error loading ${name}: `, err)
        setError(err)
      },
    )
  }, [name, orderField])

  return [items, error]
}

// Arabic message for a failed list read, with the code so it can be reported
export function loadErrorMessage(error) {
  const code = error?.code || error?.message || 'unknown'
  if (code === 'permission-denied') return `لا تملك صلاحية عرض هذه البيانات (${code})`
  return `تعذّر تحميل البيانات (${code})`
}

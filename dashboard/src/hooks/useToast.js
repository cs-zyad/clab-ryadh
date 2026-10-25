import { useCallback, useEffect, useRef, useState } from 'react'

export function useToast(initialMsg = '', duration = 3000) {
  const [toast, setToast] = useState({ msg: initialMsg, show: false })
  const timer = useRef(null)

  const showToast = useCallback(
    (msg) => {
      clearTimeout(timer.current)
      setToast({ msg, show: true })
      timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), duration)
    },
    [duration],
  )

  useEffect(() => () => clearTimeout(timer.current), [])

  return [toast, showToast]
}

import { useLayoutEffect } from 'react'

// Each dashboard page had its own <title> and body styling; the body class(es) scope
// that page's stylesheet so the pages don't leak styles into each other.
// `bodyClass` may hold several space-separated classes.
export function usePageShell(title, bodyClass) {
  useLayoutEffect(() => {
    const classes = bodyClass.split(' ').filter(Boolean)
    document.title = title
    document.body.classList.add(...classes)
    return () => document.body.classList.remove(...classes)
  }, [title, bodyClass])
}

import { Component } from 'react'

const RELOAD_FLAG = 'chunk-reload-attempted'

// A page that failed to download (e.g. after a deploy, or Vite re-bundling in dev)
const isChunkLoadError = (error) =>
  /dynamically imported module|Importing a module script failed|Failed to fetch/i.test(error?.message || '')

// Shows what went wrong instead of a blank page. A failed page download is
// retried once with a full reload.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Page crashed: ', error, info?.componentStack)
    if (isChunkLoadError(error) && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1')
      window.location.reload()
    }
  }

  componentDidMount() {
    sessionStorage.removeItem(RELOAD_FLAG)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div style={styles.wrap}>
        <div style={styles.card}>
          <h2 style={styles.title}>حدث خطأ أثناء فتح الصفحة</h2>
          <p style={styles.text}>جرّب إعادة تحميل الصفحة. إذا تكرر الخطأ أرسل النص التالي للدعم:</p>
          <pre style={styles.code}>{error.message || String(error)}</pre>
          <button style={styles.button} onClick={() => window.location.reload()}>إعادة تحميل الصفحة</button>
        </div>
      </div>
    )
  }
}

// Inline so it still renders when a page's stylesheet failed to load
const styles = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#f4f4f7', fontFamily: "'Cairo', sans-serif", direction: 'rtl' },
  card: { maxWidth: 520, width: '100%', background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 10px 40px rgba(35,32,85,0.08)', textAlign: 'center', color: '#232055' },
  title: { fontSize: '1.3rem', fontWeight: 800, marginBottom: 10 },
  text: { color: '#6b7280', fontSize: '0.92rem', marginBottom: 14 },
  code: { direction: 'ltr', textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f8fafc', border: '1px solid #eee', borderRadius: 10, padding: 12, fontSize: '0.8rem', color: '#991b1b', marginBottom: 18 },
  button: { background: '#ecb02e', color: '#232055', border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" },
}

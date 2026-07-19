import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100dvh', padding: '2rem',
          background: 'var(--bg-body)', color: 'var(--text)',
          fontFamily: "'Nunito', sans-serif", textAlign: 'center', gap: '1rem',
        }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--accent)' }}>¡Ups!</h1>
          <p>Algo salió mal. Intenta recargar la página.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem', border: 'none', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              color: 'var(--text-light)', fontWeight: 800, cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

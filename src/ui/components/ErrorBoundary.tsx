import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

import styles from './ErrorBoundary.module.css'

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
        <div className={styles.container} role="alert">
          <h1 className={styles.title}>¡Ups!</h1>
          <p>Algo salió mal. Intenta recargar la página.</p>
          <button className={styles.btn} onClick={() => window.location.reload()}>
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

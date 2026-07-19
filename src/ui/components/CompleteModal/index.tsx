import { memo, useEffect, useRef, useState } from 'react'
import type { PlayerResult } from '@/core/types'
import Confetti from '../Confetti'
import Stats from './Stats'
import ResultsTable from './Results'
import styles from './styles.module.css'

interface Props {
  results: PlayerResult[]
  onBackToMenu: () => void
  cardImages: string[]
}

const WAIT_SECONDS = 10

const CompleteModal = memo((props: Props) => {
  const { results, onBackToMenu, cardImages } = props

  const btnRef = useRef<HTMLButtonElement>(null)
  const [countdown, setCountdown] = useState(WAIT_SECONDS)

  useEffect(() => {
    if (countdown <= 0) return
    const id = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(id)
  }, [countdown])

  useEffect(() => {
    if (countdown > 0) return
    btnRef.current?.focus()
  }, [countdown])

  const disabled = countdown > 0

  return (
    <>
      <Confetti images={cardImages} />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Partida Finalizada"
      >
        <h2 className={styles.title}>
          <p>¡¡¡Partida Finalizada!!!</p>
          <p>🏆 🏆 🏆</p>
        </h2>
        <Stats results={results} />
        <ResultsTable results={results} isMulti={results.length > 1} />
        <button
          ref={btnRef}
          className={`${styles.btn}${disabled ? ` ${styles.disabled}` : ''}`}
          onClick={onBackToMenu}
          disabled={disabled}
          aria-disabled={disabled}
        >
          {disabled ? `Volver al menú (${countdown})` : 'Volver al menú'}
        </button>
      </div>
    </>
  )
})

export default CompleteModal

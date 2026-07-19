import { memo, useCallback, useEffect, useState } from 'react'
import type { PlayerConfig } from '@/core/types'
import styles from './styles.module.css'

interface Props {
  vsCount: number
  vsNames: string[]
  defaultNames: string[]
  show: boolean
  onChangeCount: (count: number) => void
  onChangeName: (idx: number, name: string) => void
  onDone: (players: PlayerConfig[]) => void
  onClose: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

type Step = 'config' | 'shuffling' | 'ready'

const SHUFFLE_INTERVAL = 200
const SHUFFLE_DURATION = 3 // segundos de shuffle
const SHUFFLE_TICKS = (SHUFFLE_DURATION * 1000) / SHUFFLE_INTERVAL
const COUNTDOWN_START = 5

const VsModal = memo((props: Props) => {
  const { vsCount, vsNames, defaultNames, show, onChangeCount, onChangeName, onDone, onClose, onKeyDown } = props

  const [step, setStep] = useState<Step>('config')
  const [shuffledNames, setShuffledNames] = useState<string[]>([])
  const [flipIdx, setFlipIdx] = useState(-1)
  const [countdown, setCountdown] = useState(COUNTDOWN_START)

  useEffect(() => {
    setStep('config')
    setCountdown(COUNTDOWN_START)
  }, [show])

  const handleAccept = useCallback(() => {
    setShuffledNames(vsNames)
    setStep('shuffling')
  }, [vsNames])

  useEffect(() => {
    if (step !== 'shuffling') return
    let tick = 0
    const id = setInterval(() => {
      setShuffledNames((prev) => {
        const arr = [...prev]
        const i = Math.floor(Math.random() * arr.length)
        let j = Math.floor(Math.random() * arr.length)
        while (j === i) j = Math.floor(Math.random() * arr.length);
        [arr[i], arr[j]] = [arr[j], arr[i]]
        return arr
      })
      setFlipIdx(Math.floor(Math.random() * vsCount))
      tick++
      if (tick >= SHUFFLE_TICKS) {
        clearInterval(id)
        setFlipIdx(-1)
        setStep('ready')
      }
    }, SHUFFLE_INTERVAL)
    return () => clearInterval(id)
  }, [step, vsCount])

  useEffect(() => {
    if (step !== 'ready') return
    if (countdown <= 0) {
      onDone(shuffledNames.map((name) => ({ name })))
      return
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [step, countdown, shuffledNames, onDone])

  const size = 64
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = countdown / COUNTDOWN_START

  if (!show) return null

  return (
    <div
      className={styles.vsOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="Configurar VS"
      onKeyDown={onKeyDown}
    >
      <div className={styles.vsModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.vsModalOverlay} />
        <div className={styles.vsModalInner}>
          {step === 'config' && (
            <>
              <p className={styles.vsTitle}>👥 ¿Cuántos jugadores?</p>

              <div className={styles.vsCountRow}>
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    className={`${styles.vsCountBtn}${n === vsCount ? ` ${styles.vsCountActive}` : ''}`}
                    onClick={() => onChangeCount(n)}
                    aria-pressed={n === vsCount}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <div className={styles.vsNames}>
                {vsNames.map((name, i) => (
                  <input
                    key={i}
                    className={styles.vsNameInput}
                    value={name}
                    onChange={(e) => onChangeName(i, e.target.value)}
                    placeholder={defaultNames[i]}
                    maxLength={10}
                    autoFocus={i === 0}
                    aria-label={`Jugador ${i + 1}`}
                  />
                ))}
              </div>

              <div className={styles.vsActions}>
                <button className={styles.vsCancelBtn} onClick={onClose}>
                  Cancelar
                </button>
                <button className={styles.vsAcceptBtn} onClick={handleAccept}>
                  Aceptar
                </button>
              </div>
            </>
          )}

          {step === 'shuffling' && (
            <>
              <p className={styles.vsTitle}>🔄 Orden de Jugadores</p>
              <div className={styles.nameList}>
                {shuffledNames.map((name, i) => (
                  <div
                    key={`${name}-${i}`}
                    className={`${styles.nameCard} ${i === flipIdx ? styles.nameFlip : ''}`}
                    style={{ transitionDelay: `${i * 0.05}s` }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 'ready' && (
            <>
              <p className={styles.vsTitle}>✅ Orden de Jugadores</p>
              <div className={styles.nameList}>
                {shuffledNames.map((name, i) => (
                  <div
                    key={`${name}-${i}`}
                    className={`${styles.nameCard} ${styles.nameSettle}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {name}
                  </div>
                ))}
              </div>
              <div className={styles.countdownWrap}>
                <svg width={size} height={size}>
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(128,128,128,0.2)"
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    className={styles.countdownCircle}
                  />
                </svg>
                <span className={styles.countdownNum}>{countdown}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

export default VsModal

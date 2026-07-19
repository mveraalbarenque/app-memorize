import { memo, useCallback, useEffect, useState } from 'react'
import styles from './styles.module.css'

interface LevelTime {
  level: number
  label: string
  time: string
}

interface Props {
  matchedPairs: number
  attempts: number
  time: string
  levelLabel: string
  onNextLevel: (() => void) | undefined
  onRestart: () => void
  levelTimes: LevelTime[]
}

const COUNTDOWN_START = 5

const InfoModal = memo((props: Props) => {
  const { matchedPairs, attempts, time, levelLabel, onNextLevel, onRestart, levelTimes } = props

  const [countdown, setCountdown] = useState(COUNTDOWN_START)
  const isLast = !onNextLevel

  useEffect(() => {
    if (countdown <= 0) return
    const id = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(id)
  }, [countdown])

  useEffect(() => {
    if (countdown > 0) return
    if (onNextLevel) onNextLevel()
    else onRestart()
  }, [countdown, onNextLevel, onRestart])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onNextLevel) onNextLevel()
        else onRestart()
      }
    },
    [onNextLevel, onRestart]
  )

  const size = 64
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = countdown / COUNTDOWN_START

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-label="Juego completado"
      onKeyDown={handleKeyDown}
    >
      {!isLast && <span className={styles.badge}>Nivel: {levelLabel}</span>}
      <h2 className={styles.title}>
        <div>
          <p>{isLast ? '¡Juego completado!' : '¡Completado!'}</p>
          <p>{isLast ? '🏆 🏆 🏆' : '🎉 🎉 🎉'}</p>
        </div>
      </h2>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Pares</p>
          <p className={styles.statValue}>{matchedPairs}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Intentos</p>
          <p className={styles.statValue}>{attempts}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Tiempo</p>
          <p className={styles.statValue}>{time}</p>
        </div>
      </div>

      {isLast && levelTimes.length > 1 && (
        <div className={styles.times}>
          <p className={styles.timesTitle}>Tiempos por nivel</p>
          {levelTimes.map((lt) => (
            <div key={lt.level} className={styles.timeRow}>
              <span>{lt.label}</span>
              <strong>{lt.time}</strong>
            </div>
          ))}
        </div>
      )}

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
    </div>
  )
})

export default InfoModal

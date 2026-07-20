import { memo } from 'react'

import styles from './styles.module.css'

interface Props {
  countdown: number
  progress: number
  size?: number
  className?: string
}

const SIZE = 64
const STROKE = 4

const CountdownCircle = memo((props: Props) => {
  const { countdown, progress, size = SIZE, className } = props

  const radius = (size - STROKE) / 2
  const circumference = 2 * Math.PI * radius

  const classes = [styles.wrap, className].filter(Boolean).join(' ')

  const propsSvg = { width: size, height: size }

  return (
    <div className={classes}>
      <svg {...propsSvg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(128,128,128,0.2)"
          strokeWidth={STROKE}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={STROKE}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={styles.circle}
        />
      </svg>
      <span className={styles.num}>{countdown}</span>
    </div>
  )
})

export default CountdownCircle

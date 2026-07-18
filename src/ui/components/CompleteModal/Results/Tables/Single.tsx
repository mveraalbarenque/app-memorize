import { memo } from 'react'
import type { PlayerResult } from '@/core/types'
import styles from './styles.module.css'

interface Props {
  result: PlayerResult
}

const Single = memo(({ result }: Props) => (
  <div className={styles.timesSection}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Nivel</th>
          <th>Intentos</th>
          <th data-player="0">{result.name}</th>
        </tr>
      </thead>
      <tbody>
        {result.levels.map((l, li) => (
          <tr key={li}>
            <td className={styles.levelCell}>{l.label}</td>
            <td className={styles.attemptsCell}>{l.attempts}</td>
            <td>
              <span className={styles.resultTime}>{l.time}</span>
            </td>
          </tr>
        ))}
        <tr className={styles.totalRow}>
          <td className={styles.levelCell}>Total</td>
          <td className={styles.attemptsCell}>{result.totalAttempts}</td>
          <td>
            <span className={styles.resultTime}>{result.totalTime}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
))

export default Single

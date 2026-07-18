import { memo } from 'react'
import type { PlayerResult } from '@/core/types'
import styles from '../../styles.module.css'

interface Props {
  results: PlayerResult[]
}

const Multi = memo(({ results }: Props) => (
  <div className={styles.timesSection}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Nivel</th>
          {results.map((r, i) => (
            <th key={r.name} data-player={i}>
              {r.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results[0].levels.map((_, li) => (
          <tr key={li}>
            <td className={styles.levelCell}>
              {results[0].levels[li].label}
            </td>
            {results.map((r) => (
              <td key={r.name}>
                <span className={styles.resultTime}>
                  {r.levels[li].time}
                </span>
              </td>
            ))}
          </tr>
        ))}
        <tr className={styles.totalRow}>
          <td className={styles.levelCell}>Total</td>
          {results.map((r) => (
            <td key={r.name}>
              <span className={styles.resultTime}>{r.totalTime}</span>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
))

export default Multi

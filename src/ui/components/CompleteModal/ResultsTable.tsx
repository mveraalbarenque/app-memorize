import { memo } from 'react';
import type { PlayerResult } from '@/core/types';
import styles from './styles.module.css';

interface Props {
  results: PlayerResult[];
  isMulti: boolean;
}

const ResultsTable = memo((props: Props) => {
  const { results, isMulti } = props;

  if (isMulti) {
    return (
      <div className={styles.timesSection}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nivel</th>
              {results.map((r, i) => (
                <th key={r.name} data-player={i}>{r.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results[0].levels.map((_, li) => (
              <tr key={li}>
                <td className={styles.levelCell}>{results[0].levels[li].label}</td>
                {results.map((r) => (
                  <td key={r.name}>
                    <span className={styles.resultTime}>{r.levels[li].time}</span>
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
    );
  }

  return (
    <div className={styles.timesSection}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nivel</th>
            <th>Intentos</th>
            <th data-player="0">{results[0].name}</th>
          </tr>
        </thead>
        <tbody>
          {results[0].levels.map((l, li) => (
            <tr key={li}>
              <td className={styles.levelCell}>{l.label}</td>
              <td className={styles.attemptsCell}>{l.attempts}</td>
              <td><span className={styles.resultTime}>{l.time}</span></td>
            </tr>
          ))}
          <tr className={styles.totalRow}>
            <td className={styles.levelCell}>Total</td>
            <td className={styles.attemptsCell}>{results[0].totalAttempts}</td>
            <td><span className={styles.resultTime}>{results[0].totalTime}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default ResultsTable;

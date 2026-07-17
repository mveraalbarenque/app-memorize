import { memo } from 'react';
import type { PlayerResult } from '@/core/types';
import styles from './styles.module.css';

interface Props {
  result: PlayerResult;
}

const SingleStats = memo((props: Props) => {
  const { result } = props;

  return (
    <div className={styles.stats}>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Pares</span>
        <span className={styles.statValue}>
          {result.levels.reduce((s, l) => s + l.matchedPairs, 0)}
        </span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Intentos</span>
        <span className={styles.statValue}>{result.totalAttempts}</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Tiempo</span>
        <span className={styles.statValue}>{result.totalTime}</span>
      </div>
    </div>
  );
});

export default SingleStats;

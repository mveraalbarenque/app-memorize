import { memo } from 'react';
import type { PlayerResult } from '@/core/types';
import styles from '../../styles.module.css';

interface Props {
  result: PlayerResult;
  index: number;
  isWinner: boolean;
  isLoser: boolean;
  hidden?: boolean;
}

const PlayerStatsCard = memo((props: Props) => {
  const { result: r, index: i, isWinner, isLoser, hidden } = props;

  const cls = [
    styles.statCard,
    isWinner ? styles.winnerCard : '',
    isLoser ? styles.loserCard : '',
    hidden ? styles.hidden : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <p className={styles.statPlayer} data-player={i}>
        {r.name}
      </p>
      <div className={styles.statCardRow}>
        <span className={styles.statLabel}>Pares</span>
        <span className={styles.statValue}>
          {r.levels.reduce((s, l) => s + l.matchedPairs, 0)}
        </span>
      </div>
      <div className={styles.statCardRow}>
        <span className={styles.statLabel}>Intentos</span>
        <span className={styles.statValue}>{r.totalAttempts}</span>
      </div>
      <div className={styles.statCardRow}>
        <span className={styles.statLabel}>Tiempo</span>
        <span className={styles.statValue}>{r.totalTime}</span>
      </div>
    </div>
  );
});

export default PlayerStatsCard;

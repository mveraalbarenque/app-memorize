import { memo } from 'react';
import type { PlayerConfig } from '@/core/types';
import styles from './styles.module.css';

interface Props {
  players: PlayerConfig[];
}

const PlayerChips = memo((props: Props) => {
  const { players } = props;

  if (players.length === 0) return null;

  return (
    <div className={styles.playersRow}>
      {players.map((p, i) => (
        <span key={i} className={styles.playerChip} data-player={i}>
          {p.name}
        </span>
      ))}
    </div>
  );
});

export default PlayerChips;

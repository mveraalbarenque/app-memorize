import { memo } from 'react';
import styles from './styles.module.css';

interface Props {
  playerCount: number;
  onSolo: () => void;
  onOpenVs: () => void;
}

const ModeButtons = memo((props: Props) => {
  const { playerCount, onSolo, onOpenVs } = props;

  return (
    <div className={styles.modeRow}>
      <button
        className={`${styles.modeBtn} ${styles.soloBtn}${playerCount === 1 ? ` ${styles.modeActive}` : ''}`}
        onClick={onSolo}
        aria-pressed={playerCount === 1}
      >
        <span className={styles.modeIcon}>
          <img src="/icons/player.svg" alt="1 jugador" />
        </span>
      </button>
      <button
        className={`${styles.modeBtn} ${styles.vsBtn}${playerCount > 1 ? ` ${styles.modeActive}` : ''}`}
        onClick={onOpenVs}
        aria-pressed={playerCount > 1}
      >
        <span className={styles.modeIcon}>
          <img src="/icons/players.svg" alt="2-4 jugadores" />
        </span>
      </button>
    </div>
  );
});

export default ModeButtons;

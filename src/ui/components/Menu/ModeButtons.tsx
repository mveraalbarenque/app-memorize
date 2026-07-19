import { memo } from 'react';
import styles from './styles.module.css';

interface Props {
  playerCount: number;
  onSolo: () => void;
  onOpenVs: () => void;
}

const ModeButtons = memo((props: Props) => {
  const { playerCount, onSolo, onOpenVs } = props;

  const propsBntSolo = {
    className: `${styles.modeBtn} ${styles.soloBtn}${playerCount === 1 ? ` ${styles.modeActive}` : ''}`,
    onClick: onSolo,
  };

  const propsBntVS = {
    className: `${styles.modeBtn} ${styles.vsBtn}${playerCount > 1 ? ` ${styles.modeActive}` : ''}`,
    onClick: onOpenVs,
  };

  return (
    <div className={styles.modeRow}>
      <button aria-pressed={playerCount === 1} {...propsBntSolo}>
        <span className={styles.modeIcon}>
          <img src="/icons/player.svg" alt="" />
        </span>
        <span className={styles.modeLabel}>Solo</span>
      </button>
      <button aria-pressed={playerCount > 1} {...propsBntVS}>
        <span className={styles.modeIcon}>
          <img src="/icons/players.svg" alt="" />
        </span>
        <span className={styles.modeLabel}>VS</span>
      </button>
    </div>
  );
});

export default ModeButtons;

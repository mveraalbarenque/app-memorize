import { memo, useCallback, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface LevelTime {
  level: number;
  label: string;
  time: string;
}

interface Props {
  matchedPairs: number;
  attempts: number;
  time: string;
  levelLabel: string;
  onNextLevel: (() => void) | undefined;
  onRestart: () => void;
  levelTimes: LevelTime[];
}

const InfoModal = memo((props: Props) => {
  const {
    matchedPairs,
    attempts,
    time,
    levelLabel,
    onNextLevel,
    onRestart,
    levelTimes,
  } = props;

  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onNextLevel) onNextLevel();
        else onRestart();
      }
    },
    [onNextLevel, onRestart]
  );

  const isLast = !onNextLevel;

  const propsModal = {
    className: styles.modal,
    role: 'dialog' as const,
    'aria-modal': 'true' as const,
    'aria-label': 'Juego completado',
    onKeyDown: handleKeyDown,
  };

  const propsButton = {
    ref: btnRef,
    className: styles.btn,
    onClick: onNextLevel ?? onRestart,
  };

  return (
    <div {...propsModal}>
      {!isLast && <span className={styles.badge}>{levelLabel}</span>}
      <h2 className={styles.title}>
        <div>
          {isLast ? <p>'¡Juego completado!'</p> : <p>'¡Completado!'</p>}
          {isLast ? <p>'🏆 🏆 🏆'</p> : <p>🎉 🎉 🎉'</p>}
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

      <button {...propsButton}>
        {onNextLevel ? 'Siguiente nivel →' : 'Nueva partida'}
      </button>
    </div>
  );
});

export default InfoModal;

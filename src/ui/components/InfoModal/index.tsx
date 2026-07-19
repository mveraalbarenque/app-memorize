import { memo, useCallback, useRef } from 'react';
import { useFocusTrap } from '@/ui/hooks/useFocusTrap';
import { useCountdown } from '@/ui/hooks/useCountdown';
import CountdownCircle from '@/ui/components/CountdownCircle';
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

const COUNTDOWN_START = 5;

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
  const trapRef = useFocusTrap(true);
  const skipAutoRef = useRef(false);
  const isLast = !onNextLevel;

  const handleDone = useCallback(() => {
    if (skipAutoRef.current) return
    if (onNextLevel) onNextLevel()
    else onRestart()
  }, [onNextLevel, onRestart])

  const { countdown, progress } = useCountdown(COUNTDOWN_START, true, handleDone)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipAutoRef.current = true;
        if (onNextLevel) onNextLevel();
        else onRestart();
      }
    },
    [onNextLevel, onRestart]
  );

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-label={isLast ? 'Juego completado' : 'Nivel completado'}
      onKeyDown={handleKeyDown}
      ref={trapRef}
    >
      {!isLast && <span className={styles.badge}>Nivel: {levelLabel}</span>}
      <h2 className={styles.title}>
        <div>
          <p>{isLast ? '¡Juego completado!' : '¡Completado!'}</p>
          <div className={styles.celebrationIcons}>
            <img
              src="/icons/confetti.svg"
              alt=""
              className={styles.celebIcon}
            />
            <img
              src="/icons/confetti.svg"
              alt=""
              className={styles.celebIcon}
            />
            <img
              src="/icons/confetti.svg"
              alt=""
              className={styles.celebIcon}
            />
          </div>
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

      <CountdownCircle countdown={countdown} progress={progress} className={styles.countdownWrap} />
    </div>
  );
});

export default InfoModal;

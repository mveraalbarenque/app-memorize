import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './styles.module.css';

interface Props {
  matchedPairs: number;
  attempts: number;
  time: string;
  levelLabel: string;
  onNextLevel: (() => void) | undefined;
  cardImages: string[];
}

interface Piece {
  img: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
}

const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
const PIECES = MOBILE ? 100 : 4000;

const CompleteModal = memo((props: Props) => {
  const { matchedPairs, attempts, time, levelLabel, onNextLevel, cardImages } =
    props;

  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && onNextLevel) onNextLevel();
    },
    [onNextLevel],
  );

  const pieces = useMemo<Piece[]>(() => {
    if (!cardImages.length) return [];
    return Array.from({ length: PIECES }, () => ({
      img: cardImages[Math.floor(Math.random() * cardImages.length)],
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 2,
      size: 12 + Math.random() * 24,
      rotate: Math.random() * 360,
    }));
  }, [cardImages]);

  const confettiElements = useMemo(
    () =>
      pieces.map((p, i) => (
        <div
          key={i}
          className={styles.piece}
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundImage: `url(${p.img})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            rotate: `${p.rotate}deg`,
          }}
        />
      )),
    [pieces],
  );

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Juego completado"
      onKeyDown={onNextLevel ? handleKeyDown : undefined}
    >
      <div className={styles.confetti}>{confettiElements}</div>
      <div className={styles.modal}>
        <h2 className={styles.title}>¡Completado!</h2>
        <p className={styles.stat}>
          {levelLabel} — {matchedPairs} pares
        </p>
        <p className={styles.stat}>Intentos: {attempts}</p>
        <p className={styles.stat}>Tiempo: {time}</p>
        {onNextLevel ? (
          <button ref={btnRef} className={styles.btn} onClick={onNextLevel}>
            Siguiente nivel →
          </button>
        ) : (
          <p className={styles.end}>Máximo nivel alcanzado</p>
        )}
      </div>
    </div>
  );
});

export default CompleteModal;

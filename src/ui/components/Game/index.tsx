import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Level } from '@/application/grid';
import type { ImageData } from '@/core/types';
import { LEVELS } from '@/application/grid';
import { useGame } from '@/application/useGame';

import Display from '../Display';
import styles from './styles.module.css';

interface Props {
  category: string;
  level: Level;
  levelIdx: number;
  playerName: string;
  onLevelComplete: (time: number, attempts: number) => void;
}

const Game = (props: Props) => {
  const { category, level, levelIdx, playerName, onLevelComplete } = props;

  const {
    cards,
    error,
    handleCardClick,
    isFlipped,
    isMatched,
    isSelected,
    attempts,
    totalPairs,
    matchedPairs,
  } = useGame(category, level.pairs);

  const [cs, setCs] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const done = matchedPairs.size === totalPairs && totalPairs > 0;
  const doneRef = useRef(false);
  const startRef = useRef(0);
  const accruedRef = useRef(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (done) return;

    if (isPaused) {
      accruedRef.current += Math.floor((Date.now() - startRef.current) / 10);
      clearInterval(intervalRef.current);
      return;
    }

    startRef.current = Date.now();
    const tick = () => {
      setCs(accruedRef.current + Math.floor((Date.now() - startRef.current) / 10));
    };
    tick();
    intervalRef.current = window.setInterval(tick, 50);

    return () => clearInterval(intervalRef.current);
  }, [done, isPaused]);

  const togglePause = useCallback(() => setIsPaused((p) => !p), []);

  const wrappedHandleCardClick = useCallback(
    (card: ImageData) => {
      if (isPaused) return;
      handleCardClick(card);
    },
    [isPaused, handleCardClick]
  );

  const fmt = useMemo(() => {
    const m = Math.floor(cs / 6000);
    const s = Math.floor((cs % 6000) / 100);
    const cent = cs % 100;
    return `${m}:${s.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
  }, [cs]);

  useEffect(() => {
    if (done && !doneRef.current) {
      doneRef.current = true;
      onLevelComplete(cs, attempts);
    }
  }, [done, cs, attempts, onLevelComplete]);

  const swapOnMobile =
    levelIdx === 1 || levelIdx === 2 || levelIdx === 3 || levelIdx === 5;
  const columns = swapOnMobile && isMobile ? level.rows : level.cols;

  const propsDisplay = useMemo(
    () => ({
      cards,
      isFlipped,
      isMatched,
      isSelected,
      onCardClick: wrappedHandleCardClick,
      columns,
    }),
    [cards, isFlipped, isMatched, isSelected, wrappedHandleCardClick, columns]
  );

  return (
    <main className={styles.area}>
      <button
        className={styles.pauseBtn}
        onClick={togglePause}
        title={isPaused ? 'Reanudar' : 'Pausar'}
      >
        <span className={styles.pauseIcon}>
          <img src={isPaused ? '/icons/play.svg' : '/icons/pause.svg'} alt={isPaused ? 'Reanudar' : 'Pausar'} />
        </span>
      </button>
      <div className={styles.cardArea}>
        {error ? (
          <p className={styles.message}>{error}</p>
        ) : !cards.length ? (
          <p className={styles.message}>Cargando...</p>
        ) : (
          <Display {...propsDisplay} />
        )}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.botRow}>
          <span className={styles.botPlayer}>{playerName}</span>
          <div className={styles.levelNav}>
            <span className={styles.botPlayer}>Nivel Actual: </span>
            {LEVELS.map((_, i) => (
              <span
                key={i}
                className={`${styles.levelDot}${i === levelIdx ? ` ${styles.levelDotActive}` : ''}`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.botScore}>
          <span>
            Pares{' '}
            <strong>
              {matchedPairs.size}/{totalPairs}
            </strong>
          </span>
          <span>
            Intentos <strong>{attempts}</strong>
          </span>
          <span>
            Tiempo <strong>{fmt}</strong>
          </span>
        </div>
        <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
          {matchedPairs.size} pares de {totalPairs}, {attempts} intentos
        </div>
      </div>
    </main>
  );
};

export default Game;

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Level } from '@/core/constants';
import type { ImageData } from '@/core/types';
import { LEVELS } from '@/core/constants';
import { useGame } from '@/application/useGame';
import { useTimer } from '@/application/hooks/useTimer';
import { formatTime } from '@/application/services/format';
import Cards from '../Cards';

import styles from './styles.module.css';

interface Props {
  category: string;
  level: Level;
  levelIdx: number;
  levelRange: [number, number];
  playerName: string;
  onLevelComplete: (time: number, attempts: number) => void;
}

const Game = (props: Props) => {
  const { category, level, levelIdx, levelRange, playerName, onLevelComplete } = props;

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

  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const done = matchedPairs.size === totalPairs && totalPairs > 0;
  const doneRef = useRef(false);
  const { cs } = useTimer(!done && !isPaused);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const togglePause = useCallback(() => setIsPaused((p) => !p), []);

  const wrappedHandleCardClick = useCallback(
    (card: ImageData) => {
      if (isPaused) return;
      handleCardClick(card);
    },
    [isPaused, handleCardClick]
  );

  const fmt = useMemo(() => formatTime(cs), [cs]);

  useEffect(() => {
    if (done && !doneRef.current) {
      doneRef.current = true;
      onLevelComplete(cs, attempts);
    }
  }, [done, cs, attempts, onLevelComplete]);

  const swapOnMobile = [1, 2, 3, 5].includes(levelIdx);
  const columns = swapOnMobile && isMobile ? level.rows : level.cols;

  const propsCards = useMemo(
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
          <img
            src={isPaused ? '/icons/play.svg' : '/icons/pause.svg'}
            alt={isPaused ? 'Reanudar' : 'Pausar'}
          />
        </span>
      </button>
      <div className={styles.cardArea}>
        {error ? (
          <p className={styles.message}>{error}</p>
        ) : !cards.length ? (
          <p className={styles.message}>Cargando...</p>
        ) : (
          <div className={styles.cardContainer}>
            <Cards {...propsCards} />
          </div>
        )}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.botRow}>
          <span className={styles.botPlayer}>{playerName}</span>
          <div className={styles.levelNav}>
            <span className={styles.botPlayer}>Nivel Actual: </span>
            {LEVELS.filter((_, i) => i >= levelRange[0] - 1 && i <= levelRange[1] - 1).map((_, i) => {
              const actualIdx = i + levelRange[0] - 1;
              return (
                <span
                  key={actualIdx}
                  className={`${styles.levelDot}${actualIdx === levelIdx ? ` ${styles.levelDotActive}` : ''}`}
                >
                  {actualIdx + 1}
                </span>
              );
            })}
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

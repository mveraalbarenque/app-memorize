import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Level } from '@/application/grid';
import { useGame } from '@/application/useGame';
import { fetchAllImages } from '@/infrastructure/dataService';

import Display from '../Display';
import Categories from '../Categories';
import Levels from '../Levels';

import type { Category } from '@/core/types';
import styles from './styles.module.css';

interface LevelTime {
  level: number;
  label: string;
  time: string;
}

interface Props {
  category: Category;
  level: Level;
  levelIdx: number;
  theme: string;
  levelTimes: LevelTime[];
  onToggleTheme: () => void;
  onSelectCategory: (cat: Category) => void;
  onSelectLevel: (idx: number) => void;
  onNextLevel: (() => void) | undefined;
  onRestart: () => void;
  onLevelComplete: (level: number, label: string, time: string) => void;
}

const CompleteModal = lazy(() => import('../CompleteModal'));

const Game = (props: Props) => {
  const {
    category,
    level,
    levelIdx,
    theme,
    levelTimes,
    onToggleTheme,
    onSelectCategory,
    onSelectLevel,
    onNextLevel,
    onRestart,
    onLevelComplete,
  } = props;

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
  const [allImages, setAllImages] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const done = matchedPairs.size === totalPairs && totalPairs > 0;
  const doneRef = useRef(false);
  const startRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    fetchAllImages().then(setAllImages).catch(() => setAllImages([]));
  }, []);

  useEffect(() => {
    if (done) return;
    startRef.current = Date.now();
    setCs(0);
    const id = setInterval(
      () => setCs(Math.floor((Date.now() - startRef.current) / 10)),
      50,
    );
    return () => clearInterval(id);
  }, [done]);

  const fmt = useMemo(() => {
    const m = Math.floor(cs / 6000);
    const s = Math.floor((cs % 6000) / 100);
    const cent = cs % 100;
    return `${m}:${s.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
  }, [cs]);

  useEffect(() => {
    if (done && !doneRef.current) {
      doneRef.current = true;
      onLevelComplete(levelIdx, level.label, fmt);
    }
  }, [done, fmt, levelIdx, level.label, onLevelComplete]);

  const swapOnMobile = levelIdx === 1 || levelIdx === 2 || levelIdx === 3 || levelIdx === 5;
  const columns = swapOnMobile && isMobile ? level.rows : level.cols;

  const propsDisplay = useMemo(
    () => ({
      cards,
      isFlipped,
      isMatched,
      isSelected,
      onCardClick: handleCardClick,
      columns,
    }),
    [cards, isFlipped, isMatched, isSelected, handleCardClick, columns],
  );

  const propsCompleteModal = useMemo(
    () => ({
      matchedPairs: matchedPairs.size,
      attempts,
      time: fmt,
      levelLabel: level.label,
      onNextLevel,
      onRestart,
      levelTimes,
      cardImages: allImages,
    }),
    [matchedPairs, attempts, fmt, level.label, onNextLevel, onRestart, levelTimes, allImages],
  );

  const propsCategories = useMemo(
    () => ({ category, onSelectCategory }),
    [category, onSelectCategory],
  );

  const propsLevels = useMemo(
    () => ({ levelIdx, onSelectLevel }),
    [levelIdx, onSelectLevel],
  );

  return (
    <div className={styles.area}>
      <button className={styles.themeBtn} onClick={onToggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <div className={styles.topBar}>
        <nav className={styles.catNav}>
          <Categories {...propsCategories} />
        </nav>
        <div className={styles.hudScore}>
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
        <div
          aria-live="polite"
          aria-atomic="true"
          className={styles.srOnly}
        >
          {matchedPairs.size} pares de {totalPairs}, {attempts} intentos
        </div>
      </div>

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
        <span className={styles.pairsLabel}>Nivel</span>
        <nav className={styles.pairNav}>
          <Levels {...propsLevels} />
        </nav>
      </div>

      {done && (
        <Suspense fallback={null}>
          <CompleteModal {...propsCompleteModal} />
        </Suspense>
      )}
    </div>
  );
};

export default Game;

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Level } from '@/application/grid';
import { useGame } from '@/application/useGame';
import { fetchAllImages } from '@/infrastructure/dataService';

import Display from '../Display';
import Categories from '../Categories';
import Levels from '../Levels';

import type { Category } from '@/core/types';
import styles from './styles.module.css';

interface Props {
  category: Category;
  level: Level;
  levelIdx: number;
  theme: string;
  onToggleTheme: () => void;
  onSelectCategory: (cat: Category) => void;
  onSelectLevel: (idx: number) => void;
  onNextLevel: (() => void) | undefined;
}

const CompleteModal = lazy(() => import('../CompleteModal'));

const Game = (props: Props) => {
  const {
    category,
    level,
    levelIdx,
    theme,
    onToggleTheme,
    onSelectCategory,
    onSelectLevel,
    onNextLevel,
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
  const done = matchedPairs.size === totalPairs && totalPairs > 0;
  const startRef = useRef(0);

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

  const propsDisplay = {
    cards,
    isFlipped,
    isMatched,
    isSelected,
    onCardClick: handleCardClick,
    columns: level.cols,
  };

  const propsCompleteModal = useMemo(
    () => ({
      matchedPairs: matchedPairs.size,
      attempts,
      time: fmt,
      levelLabel: level.label,
      onNextLevel,
      cardImages: allImages,
    }),
    [matchedPairs, attempts, fmt, level.label, onNextLevel, allImages],
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
      <div className={styles.topBar}>
        <button className={styles.themeBtn} onClick={onToggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
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

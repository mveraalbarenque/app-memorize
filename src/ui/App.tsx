import { useEffect, useState } from 'react';
import { LEVELS } from '@/application/grid';
import type { Category } from '@/core/types';
import Game from './components/Game';
import styles from './styles.module.css';

const getInitial = (): string => {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

interface LevelTime {
  level: number;
  label: string;
  time: string;
}

const App = () => {
  const [theme, setTheme] = useState(getInitial);
  const [category, setCategory] = useState<Category>('tools');
  const [levelIdx, setLevelIdx] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [levelTimes, setLevelTimes] = useState<LevelTime[]>([]);

  const level = LEVELS[levelIdx];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLevelComplete = (idx: number, label: string, time: string) => {
    setLevelTimes((prev) => {
      const exists = prev.some((lt) => lt.level === idx);
      if (exists) return prev;
      return [...prev, { level: idx, label, time }];
    });
  };

  const nextLevel = () => {
    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx(levelIdx + 1);
      setGameKey((k) => k + 1);
    }
  };

  const restartGame = () => {
    setLevelTimes([]);
    setLevelIdx(0);
    setGameKey((k) => k + 1);
  };

  const propsGame = {
    key: `${category}-${levelIdx}-${gameKey}`,
    category,
    level,
    theme,
    levelIdx,
    levelTimes,
    onToggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    onSelectCategory: setCategory,
    onSelectLevel: setLevelIdx,
    onNextLevel: levelIdx < LEVELS.length - 1 ? nextLevel : undefined,
    onRestart: restartGame,
    onLevelComplete: handleLevelComplete,
  };

  return (
    <div className={styles.layout}>
      <Game {...propsGame} />
    </div>
  );
};

export default App;

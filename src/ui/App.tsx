import { lazy, Suspense, useCallback, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import type { Difficulty } from './components/Categories/categories';
import { DEFAULT_CATEGORY } from './components/Categories/categories';
import { useTheme } from '@/ui/hooks/useTheme';
import ErrorBoundary from './components/ErrorBoundary';
import CategoryModal from './components/CategoryModal';
import FloatButtons from './components/FloatButtons';
import MenuScreen from './screens/MenuScreen';

import styles from './styles.module.css';

const GameScreen = lazy(() => import('./screens/GameScreen'));

const Spinner = () => (
  <div className={styles.spinnerWrap}>
    <div className={styles.spinner} />
  </div>
);

const App = () => {
  const { theme, toggleTheme } = useTheme();

  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [gameKey, setGameKey] = useState(0);
  const [gamePlayers, setGamePlayers] = useState<PlayerConfig[]>([]);
  const [gameCategory, setGameCategory] = useState('');
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>('easy');
  const [isMuted, setIsMuted] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  const toggleSound = useCallback(() => setIsMuted((m) => !m), []);

  const selectCategory = useCallback((cat: string, diff?: Difficulty) => {
    setCategory(cat);
    if (diff) setGameDifficulty(diff);
    setShowCatModal(false);
  }, []);

  const handleStart = useCallback((players: PlayerConfig[], cat: string, diff: Difficulty) => {
    setGamePlayers(players);
    setGameCategory(cat);
    setGameDifficulty(diff);
    setGameKey((k) => k + 1);
    setScreen('game');
  }, []);

  const handleBackToMenu = useCallback(() => {
    setGamePlayers([]);
    setGameCategory('');
    setScreen('menu');
  }, []);

  const renderScreen = () => {
    const propsMenuScreen = { onStart: handleStart, category, difficulty: gameDifficulty };
    const propsGameScreen = {
      players: gamePlayers, category: gameCategory,
      difficulty: gameDifficulty,
      onBackToMenu: handleBackToMenu, isMuted,
    };
    if (screen === 'menu') return <MenuScreen {...propsMenuScreen} />;
    return (
      <Suspense fallback={<Spinner />}>
        <GameScreen key={gameKey} {...propsGameScreen} />
      </Suspense>
    );
  };

  return (
    <ErrorBoundary>
      <div className={styles.layout}>
        <a href="#main-content" className="skip-link">Saltar al contenido</a>
        <CategoryModal show={showCatModal} onSelect={selectCategory} category={category} />
        <FloatButtons showCatButton={screen === 'menu'} isMuted={isMuted}
          onToggleSound={toggleSound} onToggleTheme={toggleTheme}
          onOpenCategories={() => setShowCatModal(true)} theme={theme} />
        {renderScreen()}
      </div>
    </ErrorBoundary>
  );
};

export default App;

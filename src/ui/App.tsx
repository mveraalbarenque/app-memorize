import { lazy, Suspense, useCallback, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import { useTheme } from '@/ui/hooks/useTheme';
import { DEFAULT_CATEGORY } from './components/Categories/categories';
import CategoryModal from './components/CategoryModal';
import FloatButtons from './components/FloatButtons';
import LiquidFilter from './components/LiquidFilter';
import MenuScreen from './screens/MenuScreen';
import styles from './styles.module.css';

const GameScreen = lazy(() => import('./screens/GameScreen'));

const App = () => {
  const { theme, toggleTheme } = useTheme();

  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [gameKey, setGameKey] = useState(0);
  const [gamePlayers, setGamePlayers] = useState<PlayerConfig[]>([]);
  const [gameCategory, setGameCategory] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  const toggleSound = useCallback(() => setIsMuted((m) => !m), []);

  const selectCategory = useCallback((cat: string) => {
    setCategory(cat);
    setShowCatModal(false);
  }, []);

  const handleStart = useCallback((players: PlayerConfig[], cat: string) => {
    setGamePlayers(players);
    setGameCategory(cat);
    setGameKey((k) => k + 1);
    setScreen('game');
  }, []);

  const handleBackToMenu = useCallback(() => {
    setGamePlayers([]);
    setGameCategory('');
    setScreen('menu');
  }, []);

  const propsCategoryModal = {
    show: showCatModal,
    onSelect: selectCategory,
    category,
  };

  const propsFloatButtons = {
    showCatButton: screen === 'menu',
    isMuted,
    onToggleSound: toggleSound,
    onToggleTheme: toggleTheme,
    onOpenCategories: () => setShowCatModal(true),
    theme,
  };

  const propsGameScreen = {
    players: gamePlayers,
    category: gameCategory,
    onBackToMenu: handleBackToMenu,
  };

  return (
    <div className={styles.layout}>
      <LiquidFilter />
      <CategoryModal {...propsCategoryModal} />
      <FloatButtons {...propsFloatButtons} />
      {screen === 'menu' ? (
        <MenuScreen category={category} onStart={handleStart} />
      ) : (
        <Suspense fallback={null}>
          <GameScreen key={gameKey} {...propsGameScreen} />
        </Suspense>
      )}
    </div>
  );
};

export default App;

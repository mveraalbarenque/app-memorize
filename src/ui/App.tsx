import { lazy, Suspense, useCallback, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import { useTheme } from '@/ui/hooks/useTheme';
import { DEFAULT_CATEGORY } from './components/Categories/categories';
import CategoryModal from './components/CategoryModal';
import FloatButtons from './components/FloatButtons';
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

  const renderScreen = () => {
    const propsMenuScreen = {
      onStart: handleStart,
      category,
    };

    const propsGameScreen = {
      players: gamePlayers,
      category: gameCategory,
      onBackToMenu: handleBackToMenu,
      isMuted,
    };
    if (screen === 'menu') return <MenuScreen {...propsMenuScreen} />;

    return (
      <Suspense fallback={null}>
        <GameScreen key={gameKey} {...propsGameScreen} />
      </Suspense>
    );
  };
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

  return (
    <div className={styles.layout}>
      <CategoryModal {...propsCategoryModal} />
      <FloatButtons {...propsFloatButtons} />
      {renderScreen()}
    </div>
  );
};

export default App;

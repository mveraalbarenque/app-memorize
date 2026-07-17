import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import Categories, { DEFAULT_CATEGORY } from './components/Categories';
import MenuScreen from './screens/MenuScreen';
import styles from './styles.module.css';

const GameScreen = lazy(() => import('./screens/GameScreen'));

const getInitial = (): string => {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const App = () => {
  const [theme, setTheme] = useState(getInitial);
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [gameKey, setGameKey] = useState(0);
  const [gamePlayers, setGamePlayers] = useState<PlayerConfig[]>([]);
  const [gameCategory, setGameCategory] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  const selectCategory = useCallback((cat: string) => {
    setCategory(cat);
    setShowCatModal(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleSound = useCallback(
    () => setIsMuted((m) => !m),
    [],
  );

  const handleStart = useCallback(
    (players: PlayerConfig[], cat: string) => {
      setGamePlayers(players);
      setGameCategory(cat);
      setGameKey((k) => k + 1);
      setScreen('game');
    },
    [],
  );

  const handleBackToMenu = useCallback(() => {
    setGamePlayers([]);
    setGameCategory('');
    setScreen('menu');
  }, []);

  const handleKeyDownCat = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setShowCatModal(false);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  );

  return (
    <div className={styles.layout}>
      <svg style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, zIndex: -1 }} aria-hidden="true">
        <filter id="liquidSpecular" x="-20%" y="-20%" width="140%" height="140%">
          <feSpecularLighting
            in="SourceAlpha"
            specularExponent={40}
            lightingColor="#fff"
            result="spec"
          >
            <fePointLight x={100} y={50} z={120} />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specMasked" />
          <feBlend in="SourceGraphic" in2="specMasked" mode="screen" />
        </filter>
      </svg>

      {showCatModal && (
        <div
          className={styles.catOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Seleccionar categoría"
          onKeyDown={handleKeyDownCat}
          onClick={() => setShowCatModal(false)}
        >
          <div className={styles.catModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.catModalOverlay} />
            <div className={styles.catModalInner}>
              <p className={styles.catTitle}>Categoría</p>
              <Categories
                category={category}
                onSelectCategory={selectCategory}
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.fabGroup}>
        {screen === 'menu' && (
          <button
            className={styles.fab}
            onClick={() => setShowCatModal(true)}
            title="Categorías"
          >
            <span className={styles.fabIcon}>
              <img src="/icons/categories.svg" alt="Categorías" />
            </span>
          </button>
        )}
        <button
          className={styles.fab}
          onClick={toggleSound}
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          <span className={styles.fabIcon}>
            <img src={isMuted ? '/icons/off.svg' : '/icons/on.svg'} alt={isMuted ? 'Activar sonido' : 'Silenciar'} />
          </span>
        </button>
        <button
          className={styles.fab}
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          <span className={styles.fabIcon}>
            <img src={theme === 'dark' ? '/icons/sun.svg' : '/icons/moon.svg'} alt={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'} />
          </span>
        </button>
      </div>

      {screen === 'menu' ? (
        <MenuScreen category={category} onStart={handleStart} />
      ) : (
        <Suspense fallback={null}>
          <GameScreen
            key={gameKey}
            players={gamePlayers}
            category={gameCategory}
            onBackToMenu={handleBackToMenu}
          />
        </Suspense>
      )}
    </div>
  );
};

export default App;

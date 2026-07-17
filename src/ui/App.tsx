import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleSound = useCallback(
    () => setIsMuted((m) => !m),
    [],
  );

  const handleStart = useCallback(
    (players: PlayerConfig[], category: string) => {
      setGamePlayers(players);
      setGameCategory(category);
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

      <div className={styles.fabGroup}>
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
        <MenuScreen onStart={handleStart} />
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

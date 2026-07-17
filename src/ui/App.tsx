import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import { useGameSession } from '@/application/useGameSession';
import { LEVELS } from '@/application/grid';
import { fetchAllImages, fetchCategories } from '@/infrastructure/dataService';
import Menu from './components/Menu';
import Categories from './components/Categories';
import Game from './components/Game';
import Confetti from './components/Confetti';
import styles from './styles.module.css';

const getInitial = (): string => {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const formatTime = (cs: number): string => {
  const m = Math.floor(cs / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const cent = cs % 100;
  return `${m}:${s.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
};

const CompleteModal = lazy(() => import('./components/CompleteModal'));
const InfoModal = lazy(() => import('./components/InfoModal'));
const TurnModal = lazy(() => import('./components/TurnModal'));

interface GameScreenProps {
  players: PlayerConfig[];
  category: string;
  onBackToMenu: () => void;
}

const GameScreen = (props: GameScreenProps) => {
  const { players, category, onBackToMenu } = props;

  const session = useGameSession(players);
  const [turnVisible, setTurnVisible] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [lastTime, setLastTime] = useState(0);
  const [lastAttempts, setLastAttempts] = useState(0);
  const [cardImages, setCardImages] = useState<string[]>([]);

  useEffect(() => {
    fetchAllImages().then(setCardImages).catch(() => setCardImages([]));
  }, []);

  const currentPlayer = session.currentPlayer;
  const currentLevel = session.currentLevel;
  const levelIdx = session.currentLevelIdx;

  const handleLevelComplete = useCallback(
    (time: number, attempts: number) => {
      session.recordLevel(time, attempts);

      const isLast =
        levelIdx >= LEVELS.length - 1 &&
        session.currentPlayerIdx >= players.length - 1;

      if (isLast) {
        session.advanceTurn();
      } else {
        setLastTime(time);
        setLastAttempts(attempts);
        setShowLevelComplete(true);
      }
    },
    [session.recordLevel, session.advanceTurn, levelIdx, session.currentPlayerIdx, players.length],
  );

  const handleNextLevel = useCallback(() => {
    session.advanceTurn();
    setShowLevelComplete(false);
    if (players.length > 1) setTurnVisible(true);
  }, [session.advanceTurn, players.length]);

  const closeTurnModal = useCallback(() => {
    setTurnVisible(false);
  }, []);

  const fmtTime = formatTime(lastTime);

  const levelTimes = session.results[session.currentPlayerIdx]?.levels
    .slice(0, -1)
    .map((l) => ({
      level: l.level,
      label: l.label,
      time: l.time,
    })) ?? [];

  const propsGame = {
    key: `${levelIdx}-${session.currentPlayerIdx}`,
    category,
    level: currentLevel,
    levelIdx,
    playerName: currentPlayer.name,
    onLevelComplete: handleLevelComplete,
  };

  const propsInfo = {
    matchedPairs: currentLevel.pairs,
    attempts: lastAttempts,
    time: fmtTime,
    levelLabel: currentLevel.label,
    onNextLevel: handleNextLevel,
    onRestart: onBackToMenu,
    levelTimes,
  };

  const propsTurn = {
    playerName: currentPlayer.name,
    levelLabel: currentLevel.label,
    onStart: closeTurnModal,
  };

  const propsComplete = {
    results: session.results,
    onBackToMenu,
    cardImages,
  };

  const showTurn = turnVisible && !session.finished;

  return (
    <>
      <Game {...propsGame} />

      {showLevelComplete && (
        <>
          <div className={styles.overlay} />
          <Confetti images={cardImages} />
          <Suspense fallback={null}>
            <InfoModal {...propsInfo} />
          </Suspense>
        </>
      )}

      {showTurn && (
        <Suspense fallback={null}>
          <TurnModal {...propsTurn} />
        </Suspense>
      )}

      {session.finished && (
        <>
          <div className={styles.overlay} />
          <Suspense fallback={null}>
            <CompleteModal {...propsComplete} />
          </Suspense>
        </>
      )}
    </>
  );
};

const App = () => {
  const [theme, setTheme] = useState(getInitial);
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [gameKey, setGameKey] = useState(0);
  const [gamePlayers, setGamePlayers] = useState<PlayerConfig[]>([]);
  const [gameCategory, setGameCategory] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [isMuted, setIsMuted] = useState(false);
  const toggleSound = useCallback(
    () => setIsMuted((m) => !m),
    [],
  );

  const [category, setCategory] = useState('tools');
  const [showCatModal, setShowCatModal] = useState(false);

  useEffect(() => {
    fetchCategories().then((cats) => {
      if (cats.length > 0) setCategory(cats[0]);
    });
  }, []);

  const selectCategory = useCallback((cat: string) => {
    setCategory(cat);
    setShowCatModal(false);
  }, []);

  const handleKeyDownCat = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setShowCatModal(false);
  }, []);

  const handleStart = useCallback(
    (players: PlayerConfig[]) => {
      setGamePlayers(players);
      setGameCategory(category);
      setGameKey((k) => k + 1);
      setScreen('game');
    },
    [category],
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
        <Menu onStart={handleStart} />
      ) : (
        <GameScreen
          key={gameKey}
          players={gamePlayers}
          category={gameCategory}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default App;

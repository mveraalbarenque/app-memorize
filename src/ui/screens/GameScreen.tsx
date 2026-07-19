import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import { useGameSession } from '@/application/useGameSession';
import { formatTime } from '@/application/services/format';
import { fetchAllImages } from '@/infrastructure/dataService';
import { getLevelRange } from '../components/Categories/categories';
import { useSounds } from '@/application/hooks/useSounds';
import Game from '../components/Game';
import Confetti from '../components/Confetti';
import styles from '../styles.module.css';

const CompleteModal = lazy(() => import('../components/CompleteModal'));
const InfoModal = lazy(() => import('../components/InfoModal'));
const TurnModal = lazy(() => import('../components/TurnModal'));

interface Props {
  players: PlayerConfig[];
  category: string;
  onBackToMenu: () => void;
  isMuted: boolean;
}

const GameScreen = (props: Props) => {
  const { players, category, onBackToMenu, isMuted } = props;

  const levelRange = getLevelRange(category);
  const session = useGameSession(players, levelRange);
  const { recordLevel, advanceTurn, currentPlayerIdx, endIdx } = session;
  const [turnVisible, setTurnVisible] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [lastTime, setLastTime] = useState(0);
  const [lastAttempts, setLastAttempts] = useState(0);
  const [cardImages, setCardImages] = useState<string[]>([]);

  useEffect(() => {
    fetchAllImages().then(setCardImages).catch(() => setCardImages([]));
  }, []);

  const sounds = useSounds(isMuted);
  const { playFlip, playMatch, playMismatch, playLevelDone, playGameDone, playTurn, playStart } = sounds;

  const hasPlayedStartRef = useRef(false);
  useEffect(() => {
    if (!hasPlayedStartRef.current) {
      playStart();
      hasPlayedStartRef.current = true;
    }
  }, [playStart]);

  useEffect(() => {
    if (session.finished) playGameDone();
  }, [session.finished, playGameDone]);

  useEffect(() => {
    if (turnVisible && !session.finished) playTurn();
  }, [turnVisible, session.finished, playTurn]);

  const handlePairResult = useCallback(
    (result: 'match' | 'mismatch') => {
      if (result === 'match') playMatch();
      else playMismatch();
    },
    [playMatch, playMismatch],
  );

  const currentPlayer = session.currentPlayer;
  const currentLevel = session.currentLevel;
  const levelIdx = session.currentLevelIdx;

  const handleLevelComplete = useCallback(
    (time: number, attempts: number) => {
      recordLevel(time, attempts);
      playLevelDone();

      const isLast =
        levelIdx >= endIdx &&
        currentPlayerIdx >= players.length - 1;

      if (isLast) {
        advanceTurn();
      } else {
        setLastTime(time);
        setLastAttempts(attempts);
        setShowLevelComplete(true);
      }
    },
    [recordLevel, advanceTurn, levelIdx, endIdx, currentPlayerIdx, players.length, playLevelDone],
  );

  const handleNextLevel = useCallback(() => {
    advanceTurn();
    setShowLevelComplete(false);
    if (players.length > 1) setTurnVisible(true);
  }, [advanceTurn, players.length]);

  const closeTurnModal = useCallback(() => {
    setTurnVisible(false);
  }, []);

  const fmtTime = formatTime(lastTime);

  const levelTimes = session.results[currentPlayerIdx]?.levels
    .slice(0, -1)
    .map((l) => ({
      level: l.level,
      label: l.label,
      time: l.time,
    })) ?? [];

  const showTurn = turnVisible && !session.finished;
  const isGamePaused = showTurn;
  const gameKey = `${levelIdx}-${session.currentPlayerIdx}`

  const propsGame = {
    category,
    level: currentLevel,
    levelIdx,
    levelRange,
    playerName: currentPlayer.name,
    paused: isGamePaused,
    hideUI: session.finished,
    onLevelComplete: handleLevelComplete,
    onCardFlip: playFlip,
    onPairResult: handlePairResult,
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

  return (
    <>
      <Game key={gameKey} {...propsGame} />

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

export default GameScreen;
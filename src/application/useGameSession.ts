import { useCallback, useState } from 'react';
import type { PlayerConfig, PlayerResult, LevelResult } from '@/core/types';
import { LEVELS } from '@/core/constants';
import { formatTime } from '@/application/services/format';

interface GameSession {
  players: PlayerConfig[];
  currentPlayerIdx: number;
  currentLevelIdx: number;
  results: PlayerResult[];
  finished: boolean;
}

const initPlayerResults = (players: PlayerConfig[]): PlayerResult[] =>
  players.map((p) => ({
    name: p.name,
    levels: [],
    totalTime: '0:00.00',
    totalAttempts: 0,
  }));

export const useGameSession = (players: PlayerConfig[]) => {
  const [session, setSession] = useState<GameSession>(() => ({
    players,
    currentPlayerIdx: 0,
    currentLevelIdx: 0,
    results: initPlayerResults(players),
    finished: false,
  }));

  const currentPlayer = session.players[session.currentPlayerIdx];
  const currentLevel = LEVELS[session.currentLevelIdx];

  const recordLevel = useCallback(
    (time: number, attempts: number) => {
      setSession((prev) => {
        const level = LEVELS[prev.currentLevelIdx];
        const result: LevelResult = {
          level: prev.currentLevelIdx,
          label: level.label,
          time: formatTime(time),
          attempts,
          matchedPairs: level.pairs,
        };

        const newResults = prev.results.map((pr, i) => {
          if (i !== prev.currentPlayerIdx) return pr;
          const newLevels = [...pr.levels, result];
          const totalAttempts = newLevels.reduce(
            (sum, lr) => sum + lr.attempts,
            0,
          );
          const totalCs = newLevels.reduce((sum, lr) => {
            const [m, s, c] = lr.time.split(/[:.]/).map(Number);
            return sum + m * 6000 + s * 100 + c;
          }, 0);
          return {
            ...pr,
            levels: newLevels,
            totalTime: formatTime(totalCs),
            totalAttempts,
          };
        });

        return { ...prev, results: newResults };
      });
    },
    [],
  );

  const advanceTurn = useCallback(() => {
    setSession((prev) => {
      const nextPlayerIdx = prev.currentPlayerIdx + 1;
      const allPlayersDoneLevel = nextPlayerIdx >= prev.players.length;
      const nextLevelIdx = allPlayersDoneLevel
        ? prev.currentLevelIdx + 1
        : prev.currentLevelIdx;
      const finished = allPlayersDoneLevel && nextLevelIdx >= LEVELS.length;

      return {
        ...prev,
        currentPlayerIdx: finished
          ? prev.currentPlayerIdx
          : allPlayersDoneLevel
            ? 0
            : nextPlayerIdx,
        currentLevelIdx: finished ? prev.currentLevelIdx : nextLevelIdx,
        finished,
      };
    });
  }, []);

  return {
    currentPlayer,
    currentLevel,
    currentPlayerIdx: session.currentPlayerIdx,
    currentLevelIdx: session.currentLevelIdx,
    results: session.results,
    finished: session.finished,
    recordLevel,
    advanceTurn,
  };
};

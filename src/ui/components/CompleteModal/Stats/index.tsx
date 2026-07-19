import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { PlayerResult } from '@/core/types';
import SingleStats from './SingleStats';
import PlayerStatsCard from './PlayerStatsCard';

import styles from './styles.module.css';

interface Props {
  results: PlayerResult[];
}

const parseTime = (t: string): number => {
  const [m, rest] = t.split(':');
  const [s, c] = rest.split('.');
  return parseInt(m) * 6000 + parseInt(s) * 100 + parseInt(c);
};

const getWinnerIdx = (results: PlayerResult[]): number =>
  results.reduce(
    (best, r, i, arr) =>
      parseTime(r.totalTime) < parseTime(arr[best].totalTime) ? i : best,
    0
  );

const getLoserIdx = (results: PlayerResult[]): number =>
  results.reduce(
    (worst, r, i, arr) =>
      parseTime(r.totalTime) > parseTime(arr[worst].totalTime) ? i : worst,
    0
  );

const INTERVAL_MS = 4000;

const Stats = memo(({ results }: Props) => {
  const isMulti = results.length > 1;
  const winnerIdx = isMulti ? getWinnerIdx(results) : -1;
  const loserIdx = isMulti ? getLoserIdx(results) : -1;
  const [cardIndex, setCardIndex] = useState(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (!isMulti) return;

    intervalRef.current = window.setInterval(() => {
      setCardIndex((i) => (i + 1) % results.length);
    }, INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [isMulti, results.length]);

  const restartAuto = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCardIndex((i) => (i + 1) % results.length);
    }, INTERVAL_MS);
  }, [results.length]);

  const goToCard = useCallback(
    (i: number) => {
      setCardIndex(i);
      restartAuto();
    },
    [restartAuto]
  );

  if (!isMulti) return <SingleStats result={results[0]} />;

  return (
    <div className={styles.stats}>
      {results.map((r, i) => {
        const propsPlayerStatsCard = {
          result: r,
          index: i,
          isWinner: i === winnerIdx,
          isLoser: i === loserIdx,
          hidden: i !== cardIndex,
        };
        return <PlayerStatsCard key={r.name} {...propsPlayerStatsCard} />;
      })}

      <div className={styles.dots}>
        {results.map((_, i) => {
          const propsButton = {
            className: `${styles.dot}${i === cardIndex ? ` ${styles.dotActive}` : ''}`,
            onClick: () => goToCard(i),
          };
          const ariaLabel = `Ver jugador ${i + 1}`;
          return <button key={i} aria-label={ariaLabel} {...propsButton} />;
        })}
      </div>
    </div>
  );
});

export default Stats;

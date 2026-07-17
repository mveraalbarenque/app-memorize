import { memo, useEffect, useRef } from 'react';
import type { PlayerResult } from '@/core/types';
import Confetti from '../Confetti';
import PlayerStatsCard from './PlayerStatsCard';
import SingleStats from './SingleStats';
import ResultsTable from './ResultsTable';
import styles from './styles.module.css';

interface Props {
  results: PlayerResult[];
  onBackToMenu: () => void;
  cardImages: string[];
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
    0,
  );

const getLoserIdx = (results: PlayerResult[]): number =>
  results.reduce(
    (worst, r, i, arr) =>
      parseTime(r.totalTime) > parseTime(arr[worst].totalTime) ? i : worst,
    0,
  );

const CompleteModal = memo((props: Props) => {
  const { results, onBackToMenu, cardImages } = props;

  const isMulti = results.length > 1;
  const winnerIdx = isMulti ? getWinnerIdx(results) : -1;
  const loserIdx = isMulti ? getLoserIdx(results) : -1;

  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  return (
    <>
      <Confetti images={cardImages} />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Juego completado"
      >
        <h2 className={styles.title}>
          <div>
            <p>¡Juego completado!</p>
          </div>
        </h2>

        {isMulti ? (
          <div className={styles.stats}>
            {results.map((r, i) => (
              <PlayerStatsCard
                key={r.name}
                result={r}
                index={i}
                isWinner={i === winnerIdx}
                isLoser={isMulti && i === loserIdx}
              />
            ))}
          </div>
        ) : (
          <SingleStats result={results[0]} />
        )}

        <ResultsTable results={results} isMulti={isMulti} />

        <button ref={btnRef} className={styles.btn} onClick={onBackToMenu}>
          Volver al menú
        </button>
      </div>
    </>
  );
});

export default CompleteModal;

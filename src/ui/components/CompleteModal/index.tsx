import { memo, useEffect, useRef } from 'react';
import type { PlayerResult } from '@/core/types';
import Confetti from '../Confetti';
import Stats from './Stats';
import ResultsTable from './Results';
import styles from './styles.module.css';

interface Props {
  results: PlayerResult[];
  onBackToMenu: () => void;
  cardImages: string[];
}

const CompleteModal = memo((props: Props) => {
  const { results, onBackToMenu, cardImages } = props;

  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  const propsButton = {
    className: styles.btn,
    onClick: onBackToMenu,
    ref: btnRef,
  };

  return (
    <>
      <Confetti images={cardImages} />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Partida Finalizada"
      >
        <h2 className={styles.title}>
          <p>¡¡¡Partida Finalizada!!!</p>
          <p>🏆 🏆 🏆</p>
        </h2>
        <Stats results={results} />
        <ResultsTable results={results} isMulti={results.length > 1} />
        <button {...propsButton}>Volver al menú</button>
      </div>
    </>
  );
});

export default CompleteModal;

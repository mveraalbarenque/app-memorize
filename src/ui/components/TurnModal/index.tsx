import { memo, useCallback, useEffect, useRef } from 'react';
import { useFocusTrap } from '@/ui/hooks/useFocusTrap';

import styles from './styles.module.css';

interface Props {
  playerName: string;
  levelLabel: string;
  onStart: () => void;
}

const TurnModal = memo((props: Props) => {
  const { playerName, levelLabel, onStart } = props;

  const btnRef = useRef<HTMLButtonElement>(null);
  const trapRef = useFocusTrap(true);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart();
      }
      if (e.key === 'Escape') {
        onStart();
      }
    },
    [onStart],
  );

  const propsOverlay = {
    className: styles.overlay,
    role: 'dialog' as const,
  };

  return (
    <div {...propsOverlay} aria-modal="true" aria-label={`Turno de ${playerName}`} ref={trapRef}>
      <div className={styles.modal} onKeyDown={handleKeyDown}>
        <p className={styles.turnLabel}>Turno de</p>
        <p className={styles.playerName}>{playerName}</p>
        <p className={styles.levelLabel}>Nivel {levelLabel}</p>
        <button ref={btnRef} className={styles.btn} onClick={onStart}>
          Empezar
        </button>
      </div>
    </div>
  );
});

export default TurnModal;

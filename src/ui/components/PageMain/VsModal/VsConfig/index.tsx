import { memo, useCallback } from 'react';

import styles from '../styles.module.css';

interface Props {
  vsCount: number;
  vsNames: string[];
  defaultNames: string[];
  onChangeCount: (count: number) => void;
  onChangeName: (idx: number, name: string) => void;
  onAccept: () => void;
  onClose: () => void;
}

const VsConfig = memo((props: Props) => {
  const {
    vsCount,
    vsNames,
    defaultNames,
    onChangeCount,
    onChangeName,
    onAccept,
    onClose,
  } = props;

  const handleAccept = useCallback(() => {
    onAccept();
  }, [onAccept]);

  const propsCountBtn = (n: number) => ({
    className: [styles.vsCountBtn, n === vsCount ? styles.vsCountActive : '']
      .filter(Boolean)
      .join(' '),
  });

  return (
    <>
      <p className={styles.vsTitle}>👥 ¿Cuántos jugadores?</p>

      <div className={styles.vsCountRow}>
        {[2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => onChangeCount(n)}
            aria-pressed={n === vsCount}
            {...propsCountBtn(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <div className={styles.vsNames}>
        {vsNames.map((name, i) => (
          <input
            key={i}
            className={styles.vsNameInput}
            value={name}
            onChange={(e) => onChangeName(i, e.target.value)}
            placeholder={defaultNames[i]}
            maxLength={10}
            autoFocus={i === 0}
            aria-label={`Jugador ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.vsActions}>
        <button className={styles.vsCancelBtn} onClick={onClose}>
          Cancelar
        </button>
        <button className={styles.vsAcceptBtn} onClick={handleAccept}>
          Aceptar
        </button>
      </div>
    </>
  );
});

export default VsConfig;

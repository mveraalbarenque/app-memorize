import { memo } from 'react';
import styles from './styles.module.css';

interface Props {
  vsCount: number;
  vsNames: string[];
  defaultNames: string[];
  show: boolean;
  onChangeCount: (count: number) => void;
  onChangeName: (idx: number, name: string) => void;
  onAccept: () => void;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const VsModal = memo((props: Props) => {
  const {
    vsCount,
    vsNames,
    defaultNames,
    show,
    onChangeCount,
    onChangeName,
    onAccept,
    onClose,
    onKeyDown,
  } = props;

  if (!show) return null;

  return (
    <div
      className={styles.vsOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="Configurar VS"
      onKeyDown={onKeyDown}
      onClick={onClose}
    >
      <div className={styles.vsModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.vsModalOverlay} />
        <div className={styles.vsModalInner}>
          <p className={styles.vsTitle}>👥 ¿Cuántos jugadores?</p>

          <div className={styles.vsCountRow}>
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                className={`${styles.vsCountBtn}${n === vsCount ? ` ${styles.vsCountActive}` : ''}`}
                onClick={() => onChangeCount(n)}
                aria-pressed={n === vsCount}
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
                maxLength={20}
                autoFocus={i === 0}
                aria-label={`Jugador ${i + 1}`}
              />
            ))}
          </div>

          <div className={styles.vsActions}>
            <button className={styles.vsCancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button className={styles.vsAcceptBtn} onClick={onAccept}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default VsModal;

import { memo } from 'react';
import styles from '../styles.module.css';

interface Props {
  isMuted: boolean;
  onToggleSound: () => void;
}

const Mute = memo((props: Props) => {
  const { isMuted, onToggleSound } = props;

  const propsBtnMute = {
    className: styles.fab,
    onClick: onToggleSound,
    'aria-label': isMuted ? 'Activar sonido' : 'Silenciar',
  };

  const propsImgMute = {
    src: isMuted ? '/icons/off.svg' : '/icons/on.svg',
    alt: '',
  };

  return (
    <button {...propsBtnMute}>
      <span className={styles.fabIcon}>
        <img {...propsImgMute} />
      </span>
    </button>
  );
});

export default Mute;

import styles from '../styles.module.css';

interface Props {
  isMuted: boolean;
  onToggleSound: () => void;
}

const Mute = (props: Props) => {
  const { isMuted, onToggleSound } = props;

  const propsBtnMute = {
    className: styles.fab,
    onClick: onToggleSound,
    title: isMuted ? 'Activar sonido' : 'Silenciar',
  };

  const propsImgMute = {
    src: isMuted ? '/icons/off.svg' : '/icons/on.svg',
    alt: isMuted ? 'Activar sonido' : 'Silenciar',
  };

  return (
    <button {...propsBtnMute}>
      <span className={styles.fabIcon}>
        <img {...propsImgMute} />
      </span>
    </button>
  );
};

export default Mute;

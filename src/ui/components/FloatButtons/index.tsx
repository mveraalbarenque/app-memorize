import { memo } from 'react';
import Categories from './Categories';
import Mute from './Mute';

import styles from './styles.module.css';

interface Props {
  showCatButton: boolean;
  isMuted: boolean;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onOpenCategories: () => void;
  theme: string;
}

const FloatButtons = memo((props: Props) => {
  const {
    showCatButton,
    isMuted,
    onToggleSound,
    onToggleTheme,
    onOpenCategories,
    theme,
  } = props;

  const propsBtnMute = { isMuted, onToggleSound };

  return (
    <div className={styles.group}>
      {showCatButton && <Categories onOpenCategories={onOpenCategories} />}
      <Mute {...propsBtnMute} />
      <button
        className={styles.fab}
        onClick={onToggleTheme}
        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      >
        <span className={styles.fabIcon}>
          <img
            src={theme === 'dark' ? '/icons/sun.svg' : '/icons/moon.svg'}
            alt={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          />
        </span>
      </button>
    </div>
  );
});

export default FloatButtons;

import { memo } from 'react';
import Categories from './Categories';
import Mute from './Mute';
import DarkMode from './DarkMode';

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

  const propsBtnDarkMode = { onToggleTheme, theme };

  return (
    <div className={styles.group}>
      {showCatButton && <Categories onOpenCategories={onOpenCategories} />}
      <Mute {...propsBtnMute} />
      <DarkMode {...propsBtnDarkMode} />
    </div>
  );
});

export default FloatButtons;

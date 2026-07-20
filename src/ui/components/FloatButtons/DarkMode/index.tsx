import { memo } from 'react';

import styles from '../styles.module.css';

interface Props {
  onToggleTheme: () => void;
  theme: string;
}

const DarkMode = memo((props: Props) => {
  const { onToggleTheme, theme } = props;

  const propsBtnDarkMode = {
    className: [styles.fab, styles.fabDark].join(' '),
    onClick: onToggleTheme,
  };

  const propsImgDarkMode = {
    src: theme === 'dark' ? '/icons/sun.svg' : '/icons/moon.svg',
    alt: '',
  };

  return (
    <button {...propsBtnDarkMode} aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
      <span className={styles.fabIcon}>
        <img {...propsImgDarkMode} />
      </span>
    </button>
  );
});

export default DarkMode;

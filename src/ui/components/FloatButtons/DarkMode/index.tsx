import styles from '../styles.module.css';

interface Props {
  onToggleTheme: () => void;
  theme: string;
}

const DarkMode = (props: Props) => {
  const { onToggleTheme, theme } = props;

  const propsBtnDarkMode = {
    className: styles.fab,
    onClick: onToggleTheme,
    title: theme === 'dark' ? 'Modo claro' : 'Modo oscuro',
  };

  const propsImgDarkMode = {
    src: theme === 'dark' ? '/icons/sun.svg' : '/icons/moon.svg',
    alt: theme === 'dark' ? 'Modo claro' : 'Modo oscuro',
  };

  return (
    <button {...propsBtnDarkMode}>
      <span className={styles.fabIcon}>
        <img {...propsImgDarkMode} />
      </span>
    </button>
  );
};

export default DarkMode;

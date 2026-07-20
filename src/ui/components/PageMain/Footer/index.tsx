import { memo } from 'react';

import styles from './styles.module.css';

const Footer = memo(() => {
  return (
    <>
      <footer className={styles.footer}>
        <p className={styles.credit}>UI/UX Kiara Alai Vera Diaz.</p>
        <p className={styles.credit}>QA - Hugo Santiago Vera Diaz.</p>
        <div className={styles.developer}>
          <p>Desarrollador: Marcos Alexander Vera Albarenque.</p>
          <p>&copy; 2026 LatinSoft SpA</p>
        </div>
      </footer>
    </>
  );
});

export default Footer;

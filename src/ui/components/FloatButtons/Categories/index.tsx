import { memo } from 'react';

import styles from '../styles.module.css';

interface Props {
  onOpenCategories: () => void;
}

const Categories = memo((props: Props) => {
  const { onOpenCategories } = props;

  const propsBntCategories = {
    className: styles.fab,
    onClick: onOpenCategories,
  };

  const propsImgCategorie = {
    src: '/icons/categories.svg',
    alt: '',
  };

  return (
    <button {...propsBntCategories} aria-label="Categorías">
      <span className={styles.fabIcon}>
        <img {...propsImgCategorie} />
      </span>
    </button>
  );
});

export default Categories;

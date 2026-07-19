import { memo } from 'react';
import Categories from '../Categories';
import styles from './styles.module.css';

interface Props {
  show: boolean;
  category: string;
  onSelect: (cat: string) => void;
}

const CategoryModal = memo((props: Props) => {
  const { show, category, onSelect } = props;

  if (!show) return null;

  const propsCategories = {
    category,
    onSelectCategory: onSelect,
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Seleccionar categoría"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalOverlay} />
        <div className={styles.modalInner}>
          <p className={styles.title}>Categoría</p>
          <Categories {...propsCategories} />
        </div>
      </div>
    </div>
  );
});

export default CategoryModal;

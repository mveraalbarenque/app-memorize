import { memo, useCallback } from 'react';
import type { Difficulty } from '../Categories/categories';
import { useFocusTrap } from '@/ui/hooks/useFocusTrap';
import Categories from '../Categories';
import styles from './styles.module.css';

interface Props {
  show: boolean;
  category: string;
  onSelect: (cat: string, diff?: Difficulty) => void;
}

const CategoryModal = memo((props: Props) => {
  const { show, category, onSelect } = props;
  const trapRef = useFocusTrap(show);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onSelect(category);
    },
    [onSelect, category],
  );

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
      ref={trapRef}
      onKeyDown={handleKeyDown}
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

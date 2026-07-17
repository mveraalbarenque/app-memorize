import { useCallback, useEffect, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import { fetchCategories } from '@/infrastructure/dataService';
import Menu from '../components/Menu';
import Categories from '../components/Categories';
import styles from '../styles.module.css';

interface Props {
  onStart: (players: PlayerConfig[], category: string) => void;
}

const MenuScreen = (props: Props) => {
  const { onStart } = props;

  const [category, setCategory] = useState('tools');
  const [showCatModal, setShowCatModal] = useState(false);

  useEffect(() => {
    fetchCategories().then((cats) => {
      if (cats.length > 0) setCategory(cats[0]);
    });
  }, []);

  const selectCategory = useCallback((cat: string) => {
    setCategory(cat);
    setShowCatModal(false);
  }, []);

  const handleKeyDownCat = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setShowCatModal(false);
  }, []);

  const handleStart = useCallback(
    (players: PlayerConfig[]) => {
      onStart(players, category);
    },
    [onStart, category],
  );

  return (
    <>
      {showCatModal && (
        <div
          className={styles.catOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Seleccionar categoría"
          onKeyDown={handleKeyDownCat}
          onClick={() => setShowCatModal(false)}
        >
          <div className={styles.catModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.catModalOverlay} />
            <div className={styles.catModalInner}>
              <p className={styles.catTitle}>Categoría</p>
              <Categories
                category={category}
                onSelectCategory={selectCategory}
              />
            </div>
          </div>
        </div>
      )}

      <Menu onStart={handleStart} />
    </>
  );
};

export default MenuScreen;

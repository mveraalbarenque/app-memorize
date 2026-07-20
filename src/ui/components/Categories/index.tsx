import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { Difficulty } from './categories';
import type { ImageData } from '@/core/types';
import { CATEGORIES, DIFFICULTIES } from './categories';
import { fetchCardsByCategory } from '@/infrastructure/dataService';
import Button from '@/ui/components/Button';
import DifficultySelector from './DifficultySelector';
import CategoryList from './CategoryList';
import PreviewPanel from './PreviewPanel';

import styles from './styles.module.css';

interface Props {
  category: string;
  onSelectCategory: (cat: string, diff: Difficulty) => void;
}

const PREVIEW_COUNT = 6;

const getCategoryDifficulty = (cat: string): Difficulty => {
  for (const diff of DIFFICULTIES) {
    if (CATEGORIES[diff].categories.some((c) => c.key === cat)) return diff
  }
  return 'easy'
}

const Categories = memo(({ category, onSelectCategory }: Props) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(
    getCategoryDifficulty(category)
  );
  const [previewCat, setPreviewCat] = useState<string | null>(category);
  const [previewCards, setPreviewCards] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!previewCat) {
      setPreviewCards([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchCardsByCategory(previewCat, PREVIEW_COUNT)
      .then((cards) => {
        if (!cancelled) {
          setPreviewCards(cards);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewCards([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [previewCat]);

  const handleCategoryClick = useCallback(
    (cat: string) => {
      if (previewCat === cat) onSelectCategory(cat, difficulty);
      else setPreviewCat(cat);
    },
    [previewCat, onSelectCategory, difficulty]
  );

  const handleDifficultyChange = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const first = CATEGORIES[diff].categories[0];
    setPreviewCat(first?.key ?? null);
  }, []);

  const items = useMemo(
    () => CATEGORIES[difficulty].categories,
    [difficulty]
  );

  const propsDifficultySelector = {
    onChange: handleDifficultyChange,
    difficulty,
  };

  const propsCategoryList = {
    onSelect: handleCategoryClick,
    items,
    previewCat,
    category,
  };

  const propsBtnLoacOnGame = {
    className: styles.confirmBtn,
    onClick: () => onSelectCategory(previewCat ?? category, difficulty),
    variant: 'success' as const,
    size: 'md' as const,
  };

  return (
    <>
      <span className={styles.sectionLabel}>Dificultad</span>
      <DifficultySelector {...propsDifficultySelector} />

      <div className={styles.mainRow}>
        <span className={styles.sectionLabel}>Vista previa</span>
        <div className={styles.test}>
          <CategoryList {...propsCategoryList} />
          <PreviewPanel cards={previewCards} loading={loading} />
        </div>
        <Button {...propsBtnLoacOnGame}>Cargar al Juego</Button>
      </div>
    </>
  );
});

export default Categories;

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { CatEntry } from './categories';
import { CATEGORIES } from './categories';
import { fetchCardsByCategory } from '@/infrastructure/dataService';
import type { ImageData } from '@/core/types';
import Button from '@/ui/components/Button';
import DifficultySelector from './DifficultySelector';
import CategoryList from './CategoryList';
import PreviewPanel from './PreviewPanel';
import styles from './styles.module.css';

interface Props {
  category: string;
  onSelectCategory: (cat: string) => void;
}

const PREVIEW_COUNT = 6;

const getCategoryDifficulty = (cat: string): CatEntry['difficulty'] =>
  CATEGORIES.find((c) => c.key === cat)?.difficulty ?? 'easy';

const Categories = memo(({ category, onSelectCategory }: Props) => {
  const [difficulty, setDifficulty] = useState<CatEntry['difficulty']>(
    getCategoryDifficulty(category)
  );
  const [previewCat, setPreviewCat] = useState<string | null>(category);
  const [previewCards, setPreviewCards] = useState<ImageData[]>([]);

  useEffect(() => {
    if (!previewCat) {
      setPreviewCards([]);
      return;
    }
    let cancelled = false;
    fetchCardsByCategory(previewCat, PREVIEW_COUNT)
      .then((cards) => {
        if (!cancelled) setPreviewCards(cards);
      })
      .catch(() => {
        if (!cancelled) setPreviewCards([]);
      });
    return () => {
      cancelled = true;
    };
  }, [previewCat]);

  const handleCategoryClick = useCallback(
    (cat: string) => {
      if (previewCat === cat) onSelectCategory(cat);
      else setPreviewCat(cat);
    },
    [previewCat, onSelectCategory]
  );

  const handleDifficultyChange = useCallback((diff: CatEntry['difficulty']) => {
    setDifficulty(diff);
    const first = CATEGORIES.find((c) => c.difficulty === diff);
    setPreviewCat(first?.key ?? null);
  }, []);

  const items = useMemo(
    () => CATEGORIES.filter((c) => c.difficulty === difficulty),
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
    onClick: () => onSelectCategory(previewCat ?? category),
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
          <PreviewPanel cards={previewCards} />
        </div>
        <Button {...propsBtnLoacOnGame}>Cargar al Juego</Button>
      </div>
    </>
  );
});

export default Categories;

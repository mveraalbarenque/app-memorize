import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { CatEntry } from './categories';
import { CATEGORIES } from './categories';
import { fetchCardsByCategory } from '@/infrastructure/dataService';
import type { ImageData } from '@/core/types';
import Button from '@/ui/components/Button';
import styles from './styles.module.css';

interface Props {
  category: string;
  onSelectCategory: (cat: string) => void;
}

const GROUPS: { diff: CatEntry['difficulty']; label: string }[] = [
  { diff: 'easy', label: 'Fácil' },
  { diff: 'normal', label: 'Normal' },
  { diff: 'hard', label: 'Difícil' },
];

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

  const items = useMemo(
    () => CATEGORIES.filter((c) => c.difficulty === difficulty),
    [difficulty]
  );

  return (
    <>
      <span className={styles.sectionLabel}>Dificultad</span>
      <div className={styles.diffRow}>
        {GROUPS.map((g) => {
          const diffClass =
            g.diff === 'easy'
              ? styles.diffEasy
              : g.diff === 'normal'
                ? styles.diffNormal
                : styles.diffHard

          const propsGrup = {
            className: `${styles.diffBtn} ${diffClass}${difficulty === g.diff ? ` ${styles.diffActive}` : ''}`,
            onClick: () => {
              setDifficulty(g.diff);
              const first = CATEGORIES.find((c) => c.difficulty === g.diff);
              setPreviewCat(first?.key ?? null);
            },
          };

          return (
            <button
              key={g.diff}
              aria-pressed={difficulty === g.diff}
              {...propsGrup}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div className={styles.mainRow}>
        <span className={styles.sectionLabel}>Vista previa</span>
        <div className={styles.test}>
          <div className={styles.catCol}>
            {items.map((cat) => {
              const active = previewCat
                ? previewCat === cat.key
                : category === cat.key;
              return (
                <button
                  key={cat.key}
                  className={`${styles.catBtn} ${active ? styles.catActive : ''}`}
                  onClick={() => handleCategoryClick(cat.key)}
                  aria-current={active ? 'true' : undefined}
                  aria-label={cat.label}
                >
                  {cat.iconImg ? (
                    <img src={cat.iconImg} alt="" className={styles.catIcon} />
                  ) : (
                    <span aria-hidden="true">{cat.icon}</span>
                  )}
                </button>
              );
            })}
          </div>

          {previewCat && previewCards.length > 0 && (
            <div className={styles.previewCol}>
              <div className={styles.previewGrid}>
                {previewCards.map((card) => (
                  <div key={card.id} className={styles.previewCard}>
                    <img src={card.img} alt={card.name} />
                    <span className={styles.previewCardName}>{card.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="success"
          size="md"
          className={styles.confirmBtn}
          onClick={() => onSelectCategory(previewCat ?? category)}
        >
          Cargar al Juego
        </Button>
      </div>
    </>
  );
});

export default Categories;

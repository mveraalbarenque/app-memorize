import { memo, useMemo } from 'react';

import styles from './styles.module.css';

export const DEFAULT_CATEGORY = 'emojis';

interface Props {
  category: string;
  onSelectCategory: (cat: string) => void;
}

interface CatEntry {
  key: string;
  label: string;
  icon: string;
  iconImg?: string;
  difficulty: 'easy' | 'normal' | 'hard';
  levelRange: [number, number];
}

const CATEGORIES: CatEntry[] = [
  {
    key: 'emojis',
    label: 'Emojis',
    icon: '😀',
    difficulty: 'easy',
    levelRange: [1, 3],
  },
  {
    key: 'lenguages',
    label: 'Lenguajes',
    icon: '💻',
    difficulty: 'normal',
    levelRange: [3, 4],
  },
  {
    key: 'frameworks',
    label: 'Frameworks',
    icon: '⚙',
    difficulty: 'normal',
    levelRange: [3, 4],
  },
  {
    key: 'tools',
    label: 'Herramientas',
    icon: '🛠',
    difficulty: 'normal',
    levelRange: [3, 4],
  },
  {
    key: 'pokers',
    label: 'Pokers',
    icon: '🃏',
    difficulty: 'hard',
    levelRange: [4, 6],
  },
  {
    key: 'mario',
    label: 'Mario',
    icon: '🍄',
    difficulty: 'easy',
    levelRange: [1, 3],
  },
  {
    key: 'dices',
    label: 'Dados',
    icon: '',
    iconImg: 'categorias/dices/azul-6.svg',
    difficulty: 'hard',
    levelRange: [4, 6],
  },
];

export const getLevelRange = (cat: string): [number, number] =>
  CATEGORIES.find((c) => c.key === cat)?.levelRange ?? [0, 0];

const GROUPS: { diff: CatEntry['difficulty']; label: string }[] = [
  { diff: 'easy', label: 'Fácil' },
  { diff: 'normal', label: 'Normal' },
  { diff: 'hard', label: 'Difícil' },
];

const Categories = memo(({ category, onSelectCategory }: Props) => {
  const sections = useMemo(
    () =>
      GROUPS.map((group) => {
        const items = CATEGORIES.filter((c) => c.difficulty === group.diff);
        if (items.length === 0) return null;

        return (
          <div key={group.diff} className={styles.group}>
            <p className={styles.groupLabel}>{group.label}</p>
            {items.map((cat) => {
              const active = category === cat.key;
              return (
                <button
                  key={cat.key}
                  className={`${styles.catBtn} ${active ? styles.catActive : ''}`}
                  onClick={() => onSelectCategory(cat.key)}
                  aria-current={active ? 'true' : undefined}
                >
                  <span aria-hidden="true">{cat.iconImg ? <img src={cat.iconImg} alt="" className={styles.catIcon} /> : cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        );
      }),
    [category, onSelectCategory]
  );

  return <>{sections}</>;
});

export default Categories;

import { memo, useMemo } from 'react';
import type { Category } from '@/core/types';

import styles from './styles.module.css';

interface Props {
  category: Category;
  onSelectCategory: (cat: Category) => void;
}

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: 'tools', label: 'Herramientas', icon: '🛠' },
  { key: 'frameworks', label: 'Frameworks', icon: '⚙' },
  { key: 'lenguages', label: 'Lenguajes', icon: '💻' },
];

const Categories = memo(({ category, onSelectCategory }: Props) => {
  const buttons = useMemo(
    () =>
      CATEGORIES.map((cat) => {
        const active = category === cat.key;
        return (
          <button
            key={cat.key}
            className={`${styles.catBtn} ${active ? styles.catActive : ''}`}
            onClick={() => onSelectCategory(cat.key)}
            aria-current={active ? 'true' : undefined}
          >
            <span aria-hidden="true">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      }),
    [category, onSelectCategory],
  );

  return buttons;
});

export default Categories;

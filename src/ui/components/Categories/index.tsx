import { memo } from 'react';
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

const Categories = memo((props: Props) => {
  const { onSelectCategory, category } = props;

  return CATEGORIES.map((cat) => {
    const active = category === cat.key;
    const propsButton = {
      key: cat.key,
      className: `${styles.catBtn} ${active ? styles.catActive : ''}`,
      onClick: () => onSelectCategory(cat.key),
      'aria-current': active ? 'true' as const : undefined,
    };

    return (
      <button {...propsButton}>
        <span aria-hidden="true">{cat.icon}</span>
        <span>{cat.label}</span>
      </button>
    );
  });
});

export default Categories;

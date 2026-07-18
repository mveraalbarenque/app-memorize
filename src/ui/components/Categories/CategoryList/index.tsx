import { memo } from 'react'
import type { CatEntry } from '../categories'
import styles from './styles.module.css'

interface Props {
  items: CatEntry[]
  previewCat: string | null
  category: string
  onSelect: (key: string) => void
}

const CategoryList = memo(({ items, previewCat, category, onSelect }: Props) => {
  return (
    <div className={styles.catCol}>
      {items.map((cat) => {
        const active = previewCat
          ? previewCat === cat.key
          : category === cat.key

        const className = [
          styles.catBtn,
          active ? styles.catActive : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={cat.key}
            className={className}
            onClick={() => onSelect(cat.key)}
            aria-current={active ? 'true' : undefined}
            aria-label={cat.label}
          >
            {cat.iconImg ? (
              <img src={cat.iconImg} alt="" className={styles.catIcon} />
            ) : (
              <span aria-hidden="true">{cat.icon}</span>
            )}
          </button>
        )
      })}
    </div>
  )
})

export default CategoryList

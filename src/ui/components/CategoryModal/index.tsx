import { memo, useCallback } from 'react'
import Categories from '../Categories'
import styles from './styles.module.css'

interface Props {
  show: boolean
  category: string
  onSelect: (cat: string) => void
  onClose: () => void
}

const CategoryModal = memo((props: Props) => {
  const { show, category, onSelect, onClose } = props

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  if (!show) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Seleccionar categoría"
      onKeyDown={handleKeyDown}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalOverlay} />
        <div className={styles.modalInner}>
          <p className={styles.title}>Categoría</p>
          <Categories
            category={category}
            onSelectCategory={onSelect}
          />
        </div>
      </div>
    </div>
  )
})

export default CategoryModal

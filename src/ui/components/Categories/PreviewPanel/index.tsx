import { memo } from 'react'
import type { ImageData } from '@/core/types'
import styles from './styles.module.css'

interface Props {
  cards: ImageData[]
  loading?: boolean
}

const PreviewPanel = memo(({ cards, loading }: Props) => {
  if (loading) {
    return (
      <div className={styles.previewCol}>
        <div className={styles.previewGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.previewCard}>
              <div className={styles.previewSkeleton} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (cards.length === 0) return null

  return (
    <div className={styles.previewCol}>
      <div className={styles.previewGrid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.previewCard}>
            <img src={card.img} alt={card.name} />
            <span className={styles.previewCardName}>{card.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

export default PreviewPanel

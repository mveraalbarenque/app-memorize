import { memo } from 'react'

import styles from './styles.module.css'

interface Props {
  names: string[]
  variant: 'reveal' | 'shuffling' | 'ready'
  flipIdx?: number
}

const NameCardList = memo((props: Props) => {
  const { names, variant, flipIdx } = props

  const delayStep = variant === 'shuffling' ? 0.05 : 0.1

  return (
    <div className={styles.nameList}>
      {names.map((name, i) => {
        const classNames = [
          styles.nameCard,
          variant === 'shuffling' && i === flipIdx ? styles.nameFlip : '',
          variant === 'ready' ? styles.nameSettle : '',
        ]
          .filter(Boolean)
          .join(' ')

        const delay = variant === 'ready' ? `${i * delayStep}s` : undefined
        const style = delay ? { animationDelay: delay } as React.CSSProperties : undefined

        const propsCard = {
          className: classNames,
          style,
          'data-player': i,
        }

        return (
          <div key={`${name}-${i}`} {...propsCard}>
            {name}
          </div>
        )
      })}
    </div>
  )
})

export default NameCardList

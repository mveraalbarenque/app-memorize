import { memo, useCallback } from 'react'
import type { CatEntry } from '../categories'
import styles from './styles.module.css'

interface Props {
  difficulty: CatEntry['difficulty']
  onChange: (diff: CatEntry['difficulty']) => void
}

const GROUPS: { diff: CatEntry['difficulty']; label: string }[] = [
  { diff: 'easy', label: 'Fácil' },
  { diff: 'normal', label: 'Normal' },
  { diff: 'hard', label: 'Difícil' },
]

const DIFF_CLASS: Record<CatEntry['difficulty'], string> = {
  easy: styles.diffEasy,
  normal: styles.diffNormal,
  hard: styles.diffHard,
}

const DifficultySelector = memo(({ difficulty, onChange }: Props) => {
  const handleClick = useCallback(
    (diff: CatEntry['difficulty']) => {
      onChange(diff)
    },
    [onChange]
  )

  return (
    <div className={styles.diffRow}>
      {GROUPS.map((g) => {
        const active = difficulty === g.diff
        const className = [
          styles.diffBtn,
          DIFF_CLASS[g.diff],
          active ? styles.diffActive : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={g.diff}
            className={className}
            aria-pressed={active}
            onClick={() => handleClick(g.diff)}
          >
            {g.label}
          </button>
        )
      })}
    </div>
  )
})

export default DifficultySelector

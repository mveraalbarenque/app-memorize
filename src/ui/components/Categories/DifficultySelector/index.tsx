import { memo, useCallback } from 'react'
import type { Difficulty } from '../categories'
import styles from './styles.module.css'

interface Props {
  difficulty: Difficulty
  onChange: (diff: Difficulty) => void
}

const GROUPS: { diff: Difficulty; label: string }[] = [
  { diff: 'easy', label: 'Fácil' },
  { diff: 'normal', label: 'Normal' },
  { diff: 'hard', label: 'Difícil' },
]

const DIFF_CLASS: Record<Difficulty, string> = {
  easy: styles.diffEasy,
  normal: styles.diffNormal,
  hard: styles.diffHard,
}

const DifficultySelector = memo(({ difficulty, onChange }: Props) => {
  const handleClick = useCallback(
    (diff: Difficulty) => {
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

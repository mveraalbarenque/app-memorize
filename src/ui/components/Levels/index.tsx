import { memo, useMemo } from 'react';
import { LEVELS } from '@/application/grid';

import styles from './styles.module.css';

interface Props {
  levelIdx: number;
  onSelectLevel: (idx: number) => void;
}

const Levels = memo(({ levelIdx, onSelectLevel }: Props) => {
  const buttons = useMemo(
    () =>
      LEVELS.map((lvl, i) => {
        const active = levelIdx === i;
        return (
          <button
            key={i}
            className={`${styles.pairBtn} ${active ? styles.pairActive : ''}`}
            onClick={() => onSelectLevel(i)}
            aria-current={active ? 'true' : undefined}
          >
            {lvl.label}
          </button>
        );
      }),
    [levelIdx, onSelectLevel],
  );

  return buttons;
});

export default Levels;

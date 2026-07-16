import { memo } from 'react';
import { LEVELS } from '@/application/grid';

import styles from './styles.module.css';

interface Props {
  levelIdx: number;
  onSelectLevel: (idx: number) => void;
}

const Levels = memo((props: Props) => {
  const { levelIdx, onSelectLevel } = props;

  return LEVELS.map((lvl, i) => {
    const active = levelIdx === i;
    const propsButton = {
      key: i,
      className: `${styles.pairBtn} ${active ? styles.pairActive : ''}`,
      onClick: () => onSelectLevel(i),
      'aria-current': active ? 'true' as const : undefined,
    };

    return <button {...propsButton}>{lvl.label}</button>;
  });
});

export default Levels;

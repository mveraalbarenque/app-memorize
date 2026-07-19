import { memo, useCallback } from 'react';
import type { PlayerConfig } from '@/core/types';
import type { Difficulty } from '@/ui/components/Categories/categories';
import Menu from '../components/Menu';

interface Props {
  category: string;
  difficulty: Difficulty;
  onStart: (players: PlayerConfig[], category: string, difficulty: Difficulty) => void;
}

const MenuScreen = memo((props: Props) => {
  const { category, difficulty, onStart } = props;

  const handleStart = useCallback(
    (players: PlayerConfig[]) => {
      onStart(players, category, difficulty);
    },
    [onStart, category, difficulty],
  );

  return <Menu onStart={handleStart} />;
});

export default MenuScreen;

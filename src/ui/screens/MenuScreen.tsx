import { useCallback } from 'react';
import type { PlayerConfig } from '@/core/types';
import Menu from '../components/Menu';

interface Props {
  category: string;
  onStart: (players: PlayerConfig[], category: string) => void;
}

const MenuScreen = (props: Props) => {
  const { category, onStart } = props;

  const handleStart = useCallback(
    (players: PlayerConfig[]) => {
      onStart(players, category);
    },
    [onStart, category],
  );

  return <Menu onStart={handleStart} />;
};

export default MenuScreen;

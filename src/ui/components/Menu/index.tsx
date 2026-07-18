import { memo, useCallback, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import { DEFAULT_NAMES } from '@/core/constants';
import Button from '@/ui/components/Button';
import ModeButtons from './ModeButtons';
import PlayerChips from './PlayerChips';
import VsModal from './VsModal';
import styles from './styles.module.css';

interface Props {
  onStart: (players: PlayerConfig[]) => void;
}

const Menu = memo((props: Props) => {
  const { onStart } = props;

  const [players, setPlayers] = useState<PlayerConfig[]>([]);
  const [showVsModal, setShowVsModal] = useState(false);
  const [vsCount, setVsCount] = useState(2);
  const [vsNames, setVsNames] = useState(DEFAULT_NAMES.slice(0, 2));

  const handleSolo = useCallback(() => {
    setPlayers([{ name: DEFAULT_NAMES[0] }]);
  }, []);

  const openVsModal = useCallback(() => {
    setVsCount(2);
    setVsNames(DEFAULT_NAMES.slice(0, 2));
    setShowVsModal(true);
  }, []);

  const closeVsModal = useCallback(() => {
    setShowVsModal(false);
  }, []);

  const changeVsCount = useCallback((count: number) => {
    setVsCount(count);
    setVsNames((prev) =>
      DEFAULT_NAMES.slice(0, count).map((d, i) => prev[i] || d)
    );
  }, []);

  const handleVsName = useCallback((idx: number, name: string) => {
    setVsNames((prev) => prev.map((n, i) => (i === idx ? name : n)));
  }, []);

  const acceptVs = useCallback(() => {
    setPlayers(vsNames.map((name) => ({ name })));
    setShowVsModal(false);
  }, [vsNames]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') closeVsModal();
    },
    [closeVsModal]
  );

  const propsModeButtons = {
    playerCount: players.length,
    onSolo: handleSolo,
    onOpenVs: openVsModal,
  };

  const propsVsModal = {
    show: showVsModal,
    vsCount,
    vsNames,
    defaultNames: DEFAULT_NAMES,
    onChangeCount: changeVsCount,
    onChangeName: handleVsName,
    onAccept: acceptVs,
    onClose: closeVsModal,
    onKeyDown: handleKeyDown,
  };

  return (
    <div className={styles.menu}>
      <div className={styles.card}>
        <div className={styles.cardOverlay} />
        <div className={styles.cardInner}>
          <h1 className={styles.title}>Memorize</h1>
          <ModeButtons {...propsModeButtons} />
          <PlayerChips players={players} />
          <Button
            variant="success"
            size="lg"
            className={styles.startBtn}
            onClick={() => onStart(players)}
            disabled={players.length === 0}
          >
            A Jugar
            <img src="/icons/play.svg" alt="" className={styles.playIcon} />
          </Button>
        </div>
      </div>

      <VsModal {...propsVsModal} />
    </div>
  );
});

export default Menu;

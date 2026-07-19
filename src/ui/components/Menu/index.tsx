import { memo, useCallback, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import { DEFAULT_NAMES } from '@/core/constants';
import Button from '@/ui/components/Button';
import ModeButtons from './ModeButtons';
import VsModal from './VsModal';
import styles from './styles.module.css';

const VS_STORAGE_KEY = 'vs-config';

const loadVsConfig = (): { count: number; names: string[] } => {
  try {
    const raw = localStorage.getItem(VS_STORAGE_KEY);
    if (raw) {
      const { count, names } = JSON.parse(raw);
      if (count >= 2 && count <= 4 && Array.isArray(names)) {
        return { count, names };
      }
    }
  } catch {
    void 0;
  }
  return { count: 2, names: DEFAULT_NAMES.slice(0, 2) };
};

interface Props {
  onStart: (players: PlayerConfig[]) => void;
}

const Menu = memo((props: Props) => {
  const { onStart } = props;

  const [saved] = useState(loadVsConfig);
  const [players, setPlayers] = useState<PlayerConfig[]>([]);
  const [showVsModal, setShowVsModal] = useState(false);
  const [vsCount, setVsCount] = useState(saved.count);
  const [vsNames, setVsNames] = useState(saved.names);

  const handleSolo = useCallback(() => {
    setPlayers([{ name: DEFAULT_NAMES[0] }]);
  }, []);

  const openVsModal = useCallback(() => {
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

  const handleVsDone = useCallback(
    (playersList: PlayerConfig[]) => {
      localStorage.setItem(
        VS_STORAGE_KEY,
        JSON.stringify({ count: vsCount, names: vsNames })
      );
      setPlayers(playersList);
      setShowVsModal(false);
    },
    [vsCount, vsNames]
  );

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
    onDone: handleVsDone,
    onClose: closeVsModal,
    onKeyDown: handleKeyDown,
  };

  const propsBtnStart = {
    className: styles.startBtn,
    onClick: () => onStart(players),
    variant: 'success' as const,
    size: 'lg' as const,
    icon: 'icons/play.svg' as const,
    iconPosition: 'right' as const,
    disabled: players.length === 0,
  };

  return (
    <div className={styles.menu}>
      <div className={styles.card}>
        <div className={styles.cardOverlay} />
        <div className={styles.cardInner}>
          <h1 className={styles.title}>Memorize...!!!</h1>
          <ModeButtons {...propsModeButtons} />
          <Button {...propsBtnStart}>A Jugar</Button>
        </div>
      </div>

      <VsModal {...propsVsModal} />
    </div>
  );
});

export default Menu;

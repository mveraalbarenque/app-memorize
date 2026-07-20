import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { PlayerConfig } from '@/core/types';
import { useFocusTrap } from '@/ui/hooks/useFocusTrap';
import { useShuffleAnimation } from '@/ui/hooks/useShuffleAnimation';
import { useCountdown } from '@/ui/hooks/useCountdown';
import CountdownCircle from '@/ui/components/CountdownCircle';

import VsConfig from './VsConfig';
import NameCardList from './NameCardList';

import styles from './styles.module.css';

interface Props {
  vsCount: number;
  vsNames: string[];
  defaultNames: string[];
  show: boolean;
  onChangeCount: (count: number) => void;
  onChangeName: (idx: number, name: string) => void;
  onDone: (players: PlayerConfig[]) => void;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

type Step = 'config' | 'reveal' | 'shuffling' | 'ready';

const COUNTDOWN_START = 5;

const VsModal = memo((props: Props) => {
  const {
    vsCount,
    vsNames,
    defaultNames,
    show,
    onChangeCount,
    onChangeName,
    onDone,
    onClose,
    onKeyDown,
  } = props;

  const [step, setStep] = useState<Step>('config');
  const [lockedNames, setLockedNames] = useState<string[]>([]);
  const [settled, setSettled] = useState(false);
  const shuffledRef = useRef<string[]>([]);

  const trapRef = useFocusTrap(show && step === 'config');

  useEffect(() => {
    if (show) {
      setStep('config');
      setLockedNames([]);
      setSettled(false);
    }
  }, [show]);

  const handleAccept = useCallback(() => {
    setLockedNames(vsNames);
    setStep('reveal');
  }, [vsNames]);

  useEffect(() => {
    if (step !== 'reveal') return;
    const id = setTimeout(() => {
      setStep('shuffling');
    }, 400);
    return () => clearTimeout(id);
  }, [step]);

  const handleShuffleDone = useCallback(() => {
    setStep('ready');
  }, []);

  const { shuffledNames, flipIdx } = useShuffleAnimation(
    lockedNames,
    step === 'shuffling',
    step === 'shuffling' ? handleShuffleDone : undefined
  );

  useEffect(() => {
    if (step !== 'ready') {
      setSettled(false);
      return;
    }
    const settleMs = (lockedNames.length - 1) * 100 + 1500;
    const id = setTimeout(() => setSettled(true), settleMs);
    return () => clearTimeout(id);
  }, [step, lockedNames.length]);

  useEffect(() => {
    shuffledRef.current = shuffledNames;
  }, [shuffledNames]);

  const handleCountdownDone = useCallback(() => {
    onDone(shuffledRef.current.map((name) => ({ name })));
  }, [onDone]);

  const { countdown, progress } = useCountdown(
    COUNTDOWN_START,
    settled,
    handleCountdownDone
  );

  const propsOverlay = {
    className: styles.vsOverlay,
    role: 'dialog' as const,
    onKeyDown: onKeyDown,
  };

  if (!show) return null;

  return (
    <div
      {...propsOverlay}
      aria-modal="true"
      aria-label="Configurar VS"
      ref={trapRef}
    >
      <div className={styles.vsModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.vsModalOverlay} />
        <div className={styles.vsModalInner}>
          {step === 'config' && (
            <VsConfig
              vsCount={vsCount}
              vsNames={vsNames}
              defaultNames={defaultNames}
              onChangeCount={onChangeCount}
              onChangeName={onChangeName}
              onAccept={handleAccept}
              onClose={onClose}
            />
          )}

          {step === 'reveal' && (
            <>
              <p className={styles.vsTitle}>🃏 Orden de Jugadores</p>
              <NameCardList names={lockedNames} variant="reveal" />
            </>
          )}

          {step === 'shuffling' && (
            <>
              <p className={styles.vsTitle}>🔄 Orden de Jugadores</p>
              <NameCardList
                names={shuffledNames}
                variant="shuffling"
                flipIdx={flipIdx}
              />
            </>
          )}

          {step === 'ready' && (
            <>
              <p className={styles.vsTitle}>✅ Orden de Jugadores</p>
              <NameCardList names={shuffledNames} variant="ready" />
              {settled && (
                <CountdownCircle
                  countdown={countdown}
                  progress={progress}
                  className={styles.countdownWrap}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default VsModal;

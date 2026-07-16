import { memo } from 'react';
import Confetti from '../Confetti';
import InfoModal from '../InfoModal';
import styles from './styles.module.css';

interface LevelTime {
  level: number;
  label: string;
  time: string;
}

interface Props {
  matchedPairs: number;
  attempts: number;
  time: string;
  levelLabel: string;
  onNextLevel: (() => void) | undefined;
  onRestart: () => void;
  levelTimes: LevelTime[];
  cardImages: string[];
}

const CompleteModal = memo((props: Props) => {
  const {
    matchedPairs,
    attempts,
    time,
    levelLabel,
    onNextLevel,
    onRestart,
    levelTimes,
    cardImages,
  } = props;

  const propsInfo = {
    matchedPairs,
    attempts,
    time,
    levelLabel,
    onNextLevel,
    onRestart,
    levelTimes,
  };

  const propsConfetti = {
    images: cardImages,
  };

  return (
    <>
      <div className={styles.overlay} />
      <Confetti {...propsConfetti} />
      <InfoModal {...propsInfo} />
    </>
  );
});

export default CompleteModal;

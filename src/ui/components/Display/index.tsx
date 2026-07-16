import type { ImageData } from '@/core/types';
import Cards from '../Cards';
import styles from './styles.module.css';

interface Props {
  cards: ImageData[];
  isFlipped: (card: ImageData) => boolean;
  isMatched: (card: ImageData) => boolean;
  isSelected: (card: ImageData) => boolean;
  onCardClick: (card: ImageData) => void;
  columns: number;
}

const Display = (props: Props) => {
  const { cards, isFlipped, isMatched, isSelected, onCardClick, columns } =
    props;

  const propsCards = {
    cards,
    isFlipped,
    isMatched,
    isSelected,
    onCardClick,
    columns,
  };

  return (
    <div className={styles.container}>
      <Cards {...propsCards} />
    </div>
  );
};

export default Display;

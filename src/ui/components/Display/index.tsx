import type { ImageData } from '@/core/types';
import Card from '../Card';
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

  const renderCards = () =>
    cards.map((card, i) => {
      const propsCard = {
        key: i,
        card,
        flipped: isFlipped(card),
        matched: isMatched(card),
        selected: isSelected(card),
        onClick: onCardClick,
      };

      return <Card {...propsCard} />;
    });

  return (
    <div className={styles.container}>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${columns}, var(--card-size))` }}
      >
        {renderCards()}
      </div>
    </div>
  );
};

export default Display;

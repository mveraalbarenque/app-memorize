import { useMemo } from 'react';
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

const Cards = (props: Props) => {
  const { cards, isFlipped, isMatched, isSelected, onCardClick, columns } =
    props;

  const gridStyle = useMemo(
    () => ({ gridTemplateColumns: `repeat(${columns}, var(--card-size))` }),
    [columns],
  );

  return (
    <div className={styles.grid} style={gridStyle}>
      {cards.map((card, i) => (
        <Card
          key={i}
          card={card}
          flipped={isFlipped(card)}
          matched={isMatched(card)}
          selected={isSelected(card)}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default Cards;

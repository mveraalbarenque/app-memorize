import { useMemo } from 'react';
import type { ImageData } from '@/core/types';
import Card from '../Card';
import styles from './styles.module.css';

interface Props {
  cards: ImageData[];
  isFlipped: (card: ImageData, index: number) => boolean;
  isMatched: (card: ImageData) => boolean;
  isSelected: (card: ImageData, index: number) => boolean;
  onCardClick: (card: ImageData, index: number) => void;
  columns: number;
}

const Cards = (props: Props) => {
  const { cards, isFlipped, isMatched, isSelected, onCardClick, columns } =
    props

  const gridStyle = useMemo(
    () => ({ gridTemplateColumns: `repeat(${columns}, minmax(var(--card-size), 1fr))` }),
    [columns],
  )

  return (
    <div className={styles.grid} style={gridStyle}>
      {cards.map((card, i) => {
        const propsCard = {
          card,
          flipped: isFlipped(card, i),
          matched: isMatched(card),
          selected: isSelected(card, i),
          onClick: (c: ImageData) => onCardClick(c, i),
        }

        return <Card key={i} {...propsCard} />
      })}
    </div>
  )
}

export default Cards;

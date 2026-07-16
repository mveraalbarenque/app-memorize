import { memo, useCallback } from 'react';
import type { ImageData } from '@/core/types';
import styles from './styles.module.css';

interface Props {
  card: ImageData;
  flipped: boolean;
  matched: boolean;
  selected: boolean;
  onClick: (card: ImageData) => void;
}

const Card = memo((props: Props) => {
  const { card, flipped, matched, selected, onClick } = props;

  const classes = [
    styles.card,
    flipped ? styles.flipped : '',
    selected ? styles.selected : '',
    matched ? styles.matched : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = useCallback(() => {
    onClick(card);
  }, [onClick, card]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(card);
    }
  };

  return (
    <div
      className={classes}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={card.name}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.inner}>
        <div className={styles.front}>
          <img src="/card-back.svg" alt="" />
        </div>
        <div className={styles.back}>
          <img src={card.img} alt={card.name} />
        </div>
      </div>
    </div>
  );
});

export default Card;

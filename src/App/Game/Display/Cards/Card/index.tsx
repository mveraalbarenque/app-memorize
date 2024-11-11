import { useState } from 'react';
import { CardProps } from '@/utils/interfaces';
import styles from './styles.module.css';

const Card: React.FC<CardProps> = (props) => {
  const { card, isSelected, isMatched, handleClick } = props;
  const { name, img } = card;

  const [clicked, setClicked] = useState(false);

  const handleCardClick = () => {
    setClicked(!clicked);
    handleClick(card);
  };

  const classSelected = isSelected ? styles.selected : '';
  const classMatched = isMatched ? styles.matched : '';
  const classClicked = clicked ? styles.clicked : '';
  const classCard = `${styles.card} ${classSelected} ${classMatched} ${classClicked}`;

  const propsCard = {
    className: classCard,
    onClick: handleCardClick,
  };

  return (
    <div {...propsCard}>
      <div className={styles.front}>
        <img src="/aws.svg" alt={name} />
      </div>
      <div className={styles.back}>
        <img src={img} alt="back" />
      </div>
    </div>
  );
};

export default Card;

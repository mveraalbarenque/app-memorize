import { CardsProps, ImageData } from '@/utils/interfaces';
import Card from './Card';
import styles from './styles.module.css';

const Cards: React.FC<CardsProps> = (props) => {
  const { cards, selectedCards, matchedPairs, handleCardClick } = props;

  const renderCards = () => {
    const setCard = (card: ImageData, i: number) => {
      const isSelected = selectedCards.includes(card);
      const isMatched = matchedPairs.has(card.id);

      const propsCard = {
        key: i,
        card,
        isSelected,
        isMatched,
        handleClick: () => handleCardClick(card),
      };

      return <Card {...propsCard} />;
    };

    return cards.map((card, i) => setCard(card, i));
  };

  return <div className={styles.container}>{renderCards()}</div>;
};

export default Cards;

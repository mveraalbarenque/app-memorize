import { CardsProps } from '@/utils/interfaces';
import Cards from './Cards';
import styles from './styles.module.css';

const Display: React.FC<CardsProps> = (props) => {
  const { cards, selectedCards, matchedPairs, handleCardClick } = props;

  const propsCards = {
    cards,
    selectedCards,
    matchedPairs,
    handleCardClick,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>DISPLAY...</h1>
      </div>
      <div className={styles.body}>
        <Cards {...propsCards} />
      </div>
      <div className={styles.footer}>INFORMACIÓN PARTIDA ACTUAL</div>
    </div>
  );
};

export default Display;

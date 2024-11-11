import { useState, useEffect } from 'react';
import { getDataImagenes } from '@/services/fetch/imagenes';
import { ImageData } from '@/utils/interfaces';
import Display from './Display';
import Score from './Score';
import styles from './styles.module.css';

const Game = () => {
  const [cards, setCards] = useState<ImageData[]>([]);
  const [selectedCards, setSelectedCards] = useState<ImageData[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const dataFetch = await getDataImagenes('tools');
        setCards([...dataFetch, ...dataFetch]); // Duplica el array para crear pares
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('No se pudieron cargar las imágenes. Inténtalo de nuevo.');
      }
    };

    fetchCards();
  }, []);

  const twoSelected = (selectedCards: ImageData[]) => {
    return selectedCards.length === 1 ? true : false;
  };

  const checkIsPair = (selectedCards: ImageData[], card: ImageData) => {
    let respuesta = false;
    if (
      twoSelected(selectedCards) ||
      selectedCards.includes(card) ||
      matchedPairs.has(card.id)
    ) {
      respuesta = true;
    }
    return respuesta;
  };

  const handleCardClick = (card: ImageData) => {
    if (checkIsPair(selectedCards, card)) return;

    const newSelectedCards = [...selectedCards, card];
    setSelectedCards(() => newSelectedCards);

    if (twoSelected(newSelectedCards)) {
      const [firstCard, secondCard] = newSelectedCards;
      if (firstCard.id === secondCard.id) {
        setMatchedPairs((prev) => new Set(prev).add(firstCard.id));
      }

      setTimeout(() => setSelectedCards([]), 2000);
    }
  };

  const renderContent = () => {
    if (error) return <p>{error}</p>;
    if (cards.length < 0) return <p>Cargando imágenes...</p>;

    return (
      <Display
        cards={cards}
        selectedCards={selectedCards}
        matchedPairs={matchedPairs}
        handleCardClick={handleCardClick}
      />
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.display}>{renderContent()}</div>
      <div className={styles.score}>
        <Score />
      </div>
    </div>
  );
};

export default Game;

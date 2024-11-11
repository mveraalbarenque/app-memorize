export interface ImageData {
  id: number;
  name: string;
  img: string;
}

export interface CardsProps {
  cards: ImageData[];
  selectedCards: ImageData[];
  matchedPairs: Set<number>;
  handleCardClick: (card: ImageData) => void;
}

export interface CardProps {
  card: ImageData;
  isSelected: boolean;
  isMatched: boolean;
  handleClick: (card: ImageData) => void;
}

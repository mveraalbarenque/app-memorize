import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImageData, Category } from '@/core/types';
import { fetchCardsByCategory } from '@/infrastructure/dataService';
import { shuffle } from '@/application/shuffle';

export const useGame = (category: Category, pairCount: number) => {
  const [cards, setCards] = useState<ImageData[]>([]);
  const [selectedCards, setSelectedCards] = useState<ImageData[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const matchedRef = useRef(matchedPairs);
  const selectedRef = useRef(selectedCards);

  matchedRef.current = matchedPairs;
  selectedRef.current = selectedCards;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchCardsByCategory(category, pairCount);
        const duplicated = shuffle([...data, ...data.map((c) => ({ ...c }))]);
        if (!cancelled) {
          setCards(duplicated);
          setSelectedCards([]);
          setMatchedPairs(new Set());
          setAttempts(0);
          setError(null);
        }
      } catch {
        if (!cancelled)
          setError('No se pudieron cargar las imágenes. Inténtalo de nuevo.');
      }
    };
    load();
    return () => { cancelled = true; };
  }, [category, pairCount]);

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach(clearTimeout);
      timeoutRef.current = [];
    };
  }, []);

  const handleCardClick = useCallback((card: ImageData) => {
    if (matchedRef.current.has(card.id)) return;
    if (selectedRef.current.includes(card)) return;
    if (selectedRef.current.length >= 2) return;

    const newSelected = [...selectedRef.current, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setAttempts((n) => n + 1);
      const [a] = newSelected;
      timeoutRef.current.forEach(clearTimeout);
      timeoutRef.current = [];
      if (a.id === card.id) {
        const t1 = setTimeout(
          () => setMatchedPairs((p) => new Set(p).add(a.id)),
          200,
        );
        timeoutRef.current.push(t1);
      }
      const t2 = setTimeout(() => setSelectedCards([]), 900);
      timeoutRef.current.push(t2);
    }
  }, []);

  const isFlipped = useCallback(
    (card: ImageData) =>
      selectedRef.current.includes(card) || matchedRef.current.has(card.id),
    [],
  );

  const isMatched = useCallback(
    (card: ImageData) => matchedRef.current.has(card.id),
    [],
  );

  const isSelected = useCallback(
    (card: ImageData) => selectedRef.current.includes(card),
    [],
  );

  const totalPairs = cards.length / 2;

  return {
    cards,
    error,
    handleCardClick,
    isFlipped,
    isMatched,
    isSelected,
    attempts,
    matchedPairs,
    totalPairs,
  };
};

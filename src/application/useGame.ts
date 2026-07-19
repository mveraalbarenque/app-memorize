import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type { ImageData } from '@/core/types'
import { fetchCardsByCategory } from '@/infrastructure/dataService'
import { shuffle } from '@/application/services/shuffle'
import {
  cardMachine,
  createInitialCardState,
} from '@/application/gameMachine'

export const useGame = (
  category: string,
  pairCount: number,
  onCardFlip?: () => void,
  onPairResult?: (result: 'match' | 'mismatch') => void,
) => {
  const [state, dispatch] = useReducer(
    cardMachine,
    pairCount,
    createInitialCardState,
  )
  const [cards, setCards] = useState<ImageData[]>([])
  const [error, setError] = useState<string | null>(null)

  const prevPhaseRef = useRef(state.phase)

  useEffect(() => {
    const prevPhase = prevPhaseRef.current
    prevPhaseRef.current = state.phase

    if (prevPhase === 'idle' && state.phase === 'oneSelected') {
      onCardFlip?.()
    } else if (prevPhase === 'oneSelected' && state.phase === 'matchDelay') {
      onCardFlip?.()
      onPairResult?.('match')
    } else if (prevPhase === 'oneSelected' && state.phase === 'mismatchDelay') {
      onCardFlip?.()
      onPairResult?.('mismatch')
    }
  }, [state.phase, onCardFlip, onPairResult])

  useEffect(() => {
    if (state.phase === 'matchDelay') {
      const t = setTimeout(() => dispatch({ type: 'MATCH_TIMEOUT' }), 300)
      return () => clearTimeout(t)
    }
    if (state.phase === 'mismatchDelay') {
      const t = setTimeout(() => dispatch({ type: 'MISMATCH_TIMEOUT' }), 900)
      return () => clearTimeout(t)
    }
  }, [state.phase])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchCardsByCategory(category, pairCount)
        const duplicated = shuffle([...data, ...data.map((c) => ({ ...c }))])
        if (!cancelled) {
          setCards(duplicated)
          setError(null)
        }
      } catch {
        if (!cancelled)
          setError('No se pudieron cargar las imágenes. Inténtalo de nuevo.')
      }
    }
    load()
    return () => { cancelled = true }
  }, [category, pairCount])

  const handleCardClick = useCallback(
    (card: ImageData, index: number) => {
      dispatch({ type: 'SELECT_CARD', index, id: card.id })
    },
    [],
  )

  const isFlipped = useCallback(
    (_card: ImageData, index: number) =>
      index === state.selectedFirstIdx ||
      index === state.selectedSecondIdx ||
      state.matchedIds.includes(_card.id),
    [state.selectedFirstIdx, state.selectedSecondIdx, state.matchedIds],
  )

  const isMatched = useCallback(
    (_card: ImageData) => state.matchedIds.includes(_card.id),
    [state.matchedIds],
  )

  const isSelected = useCallback(
    (_card: ImageData, index: number) =>
      index === state.selectedFirstIdx ||
      index === state.selectedSecondIdx,
    [state.selectedFirstIdx, state.selectedSecondIdx],
  )

  const totalPairs = cards.length / 2

  return {
    cards,
    error,
    handleCardClick,
    isFlipped,
    isMatched,
    isSelected,
    attempts: state.attempts,
    matchedIds: state.matchedIds,
    totalPairs,
  }
}

export type CardPhase =
  | 'idle'
  | 'oneSelected'
  | 'matchDelay'
  | 'mismatchDelay'
  | 'complete'

export interface CardState {
  phase: CardPhase
  selectedFirstIdx: number | null
  selectedFirstId: number | null
  selectedSecondIdx: number | null
  selectedSecondId: number | null
  matchedIds: number[]
  attempts: number
  totalPairs: number
}

export type CardEvent =
  | { type: 'SELECT_CARD'; index: number; id: number }
  | { type: 'MATCH_TIMEOUT' }
  | { type: 'MISMATCH_TIMEOUT' }

export const createInitialCardState = (pairCount: number): CardState => ({
  phase: 'idle',
  selectedFirstIdx: null,
  selectedFirstId: null,
  selectedSecondIdx: null,
  selectedSecondId: null,
  matchedIds: [],
  attempts: 0,
  totalPairs: pairCount,
})

export const cardMachine = (
  state: CardState,
  event: CardEvent,
): CardState => {
  switch (state.phase) {
    case 'idle':
      if (event.type === 'SELECT_CARD') {
        if (state.matchedIds.includes(event.id)) return state

        return {
          ...state,
          phase: 'oneSelected',
          selectedFirstIdx: event.index,
          selectedFirstId: event.id,
          selectedSecondIdx: null,
          selectedSecondId: null,
        }
      }
      return state

    case 'oneSelected':
      if (event.type === 'SELECT_CARD') {
        if (state.selectedFirstIdx === event.index) return state
        if (state.matchedIds.includes(event.id)) return state

        const isMatch = state.selectedFirstId === event.id
        return {
          ...state,
          phase: isMatch ? 'matchDelay' : 'mismatchDelay',
          selectedSecondIdx: event.index,
          selectedSecondId: event.id,
          attempts: state.attempts + 1,
        }
      }
      return state

    case 'matchDelay':
      if (event.type === 'MATCH_TIMEOUT') {
        const newMatched = [...state.matchedIds, state.selectedFirstId!]
        const isComplete = newMatched.length >= state.totalPairs
        return {
          ...state,
          phase: isComplete ? 'complete' : 'idle',
          selectedFirstIdx: null,
          selectedFirstId: null,
          selectedSecondIdx: null,
          selectedSecondId: null,
          matchedIds: newMatched,
        }
      }
      return state

    case 'mismatchDelay':
      if (event.type === 'MISMATCH_TIMEOUT') {
        return {
          ...state,
          phase: 'idle',
          selectedFirstIdx: null,
          selectedFirstId: null,
          selectedSecondIdx: null,
          selectedSecondId: null,
        }
      }
      return state

    case 'complete':
      return state
  }
}

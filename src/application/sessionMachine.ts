import type { PlayerConfig, PlayerResult, LevelResult } from '@/core/types'
import { LEVELS } from '@/core/constants'
import { formatTime } from '@/application/services/format'

export interface SessionState {
  players: PlayerConfig[]
  currentPlayerIdx: number
  currentLevelIdx: number
  results: PlayerResult[]
  finished: boolean
  startIdx: number
  endIdx: number
}

export const createSessionState = (
  players: PlayerConfig[],
  startIdx: number,
  endIdx: number,
): SessionState => ({
  players,
  currentPlayerIdx: 0,
  currentLevelIdx: startIdx,
  results: players.map((p) => ({
    name: p.name,
    levels: [],
    totalTime: '0:00.00',
    totalAttempts: 0,
  })),
  finished: false,
  startIdx,
  endIdx,
})

export const recordLevelResult = (
  state: SessionState,
  time: number,
  attempts: number,
): SessionState => {
  const level = LEVELS[state.currentLevelIdx]
  const result: LevelResult = {
    level: state.currentLevelIdx,
    label: level.label,
    time: formatTime(time),
    attempts,
    matchedPairs: level.pairs,
  }

  const newResults = state.results.map((pr, i) => {
    if (i !== state.currentPlayerIdx) return pr
    const newLevels = [...pr.levels, result]
    const totalAttempts = newLevels.reduce(
      (sum, lr) => sum + lr.attempts,
      0,
    )
    const totalCs = newLevels.reduce((sum, lr) => {
      const [m, s, c] = lr.time.split(/[:.]/).map(Number)
      return sum + m * 6000 + s * 100 + c
    }, 0)
    return {
      ...pr,
      levels: newLevels,
      totalTime: formatTime(totalCs),
      totalAttempts,
    }
  })

  return { ...state, results: newResults }
}

export const advanceSession = (
  state: SessionState,
): SessionState => {
  const nextPlayerIdx = state.currentPlayerIdx + 1
  const allPlayersDoneLevel = nextPlayerIdx >= state.players.length
  const nextLevelIdx = allPlayersDoneLevel
    ? state.currentLevelIdx + 1
    : state.currentLevelIdx
  const finished = allPlayersDoneLevel && nextLevelIdx > state.endIdx

  return {
    ...state,
    currentPlayerIdx: finished
      ? state.currentPlayerIdx
      : allPlayersDoneLevel
        ? 0
        : nextPlayerIdx,
    currentLevelIdx: finished ? state.currentLevelIdx : nextLevelIdx,
    finished,
  }
}

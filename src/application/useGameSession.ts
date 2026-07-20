import { useCallback, useState } from 'react'
import type { PlayerConfig } from '@/core/types'
import { LEVELS } from '@/core/constants'
import {
  createSessionState,
  recordLevelResult,
  advanceSession,
} from '@/application/sessionMachine'

export const useGameSession = (players: PlayerConfig[], levelRange: [number, number]) => {
  const startIdx = levelRange[0] - 1
  const endIdx = levelRange[1] - 1

  const [session, setSession] = useState(() =>
    createSessionState(players, startIdx, endIdx),
  )

  const currentPlayer = session.players[session.currentPlayerIdx]
  const currentLevel = LEVELS[session.currentLevelIdx]

  const recordLevel = useCallback((time: number, attempts: number) => {
    setSession((prev) => recordLevelResult(prev, time, attempts))
  }, [])

  const advanceTurn = useCallback(() => {
    setSession((prev) => advanceSession(prev))
  }, [])

  const levelCount = endIdx - startIdx + 1

  return {
    currentPlayer,
    currentLevel,
    currentPlayerIdx: session.currentPlayerIdx,
    currentLevelIdx: session.currentLevelIdx,
    results: session.results,
    finished: session.finished,
    recordLevel,
    advanceTurn,
    startIdx,
    endIdx,
    levelCount,
  }
}
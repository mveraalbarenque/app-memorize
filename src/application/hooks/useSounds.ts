import { useCallback, useRef } from 'react'
import useSound from 'use-sound'

export const useSounds = (isMuted: boolean) => {
  const isMutedRef = useRef(isMuted)
  isMutedRef.current = isMuted

  const [playFlipRaw] = useSound('/sounds/flip.wav', { volume: 0.5 })
  const [playMatchRaw] = useSound('/sounds/match.wav', { volume: 0.6 })
  const [playMismatchRaw] = useSound('/sounds/mismatch.wav', { volume: 0.5 })
  const [playLevelDoneRaw] = useSound('/sounds/level-done.wav', { volume: 0.7 })
  const [playGameDoneRaw] = useSound('/sounds/game-done.wav', { volume: 0.7 })
  const [playTurnRaw] = useSound('/sounds/turn.wav', { volume: 0.6 })
  const [playStartRaw] = useSound('/sounds/start.wav', { volume: 0.6 })

  const playIf = useCallback((fn: () => void) => {
    if (!isMutedRef.current) fn()
  }, [])

  const playFlip = useCallback(() => playIf(playFlipRaw), [playIf, playFlipRaw])
  const playMatch = useCallback(() => playIf(playMatchRaw), [playIf, playMatchRaw])
  const playMismatch = useCallback(() => playIf(playMismatchRaw), [playIf, playMismatchRaw])
  const playLevelDone = useCallback(() => playIf(playLevelDoneRaw), [playIf, playLevelDoneRaw])
  const playGameDone = useCallback(() => playIf(playGameDoneRaw), [playIf, playGameDoneRaw])
  const playTurn = useCallback(() => playIf(playTurnRaw), [playIf, playTurnRaw])
  const playStart = useCallback(() => playIf(playStartRaw), [playIf, playStartRaw])

  return { playFlip, playMatch, playMismatch, playLevelDone, playGameDone, playTurn, playStart }
}

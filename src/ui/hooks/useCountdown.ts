import { useEffect, useState } from 'react'

interface CountdownResult {
  countdown: number
  progress: number
  isRunning: boolean
}

export function useCountdown(
  totalSeconds: number,
  active: boolean,
  onDone: () => void
): CountdownResult {
  const [countdown, setCountdown] = useState(totalSeconds)

  useEffect(() => {
    if (!active) return
    setCountdown(totalSeconds)
  }, [active, totalSeconds])

  useEffect(() => {
    if (!active || countdown <= 0) return
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [active, countdown])

  useEffect(() => {
    if (!active || countdown > 0) return
    onDone()
  }, [active, countdown, onDone])

  return {
    countdown,
    progress: countdown / totalSeconds,
    isRunning: active && countdown > 0,
  }
}

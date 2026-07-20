import { useEffect, useRef, useState } from 'react'

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
  const justActivatedRef = useRef(false)

  useEffect(() => {
    if (active) {
      setCountdown(totalSeconds)
      justActivatedRef.current = true
    } else {
      justActivatedRef.current = false
    }
  }, [active, totalSeconds])

  useEffect(() => {
    if (!active || countdown <= 0) return
    justActivatedRef.current = false
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [active, countdown])

  useEffect(() => {
    if (!active || countdown > 0) return
    if (justActivatedRef.current) return
    onDone()
  }, [active, countdown, onDone])

  return {
    countdown,
    progress: countdown / totalSeconds,
    isRunning: active && countdown > 0,
  }
}

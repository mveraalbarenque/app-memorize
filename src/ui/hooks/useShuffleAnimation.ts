import { useEffect, useState } from 'react'

interface ShuffleResult {
  shuffledNames: string[]
  flipIdx: number
  isShuffling: boolean
}

const SHUFFLE_INTERVAL = 200
const SHUFFLE_TICKS = (5 * 1000) / SHUFFLE_INTERVAL

export function useShuffleAnimation(
  names: string[],
  active: boolean
): ShuffleResult {
  const [shuffledNames, setShuffledNames] = useState(names)
  const [flipIdx, setFlipIdx] = useState(-1)
  const [isShuffling, setIsShuffling] = useState(false)

  useEffect(() => {
    if (!active) return

    setShuffledNames(names)
    setIsShuffling(true)
    let tick = 0
    const id = setInterval(() => {
      setShuffledNames((prev) => {
        const arr = [...prev]
        const i = Math.floor(Math.random() * arr.length)
        let j = Math.floor(Math.random() * arr.length)
        while (j === i) j = Math.floor(Math.random() * arr.length)
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        return arr
      })
      setFlipIdx(Math.floor(Math.random() * names.length))
      tick++
      if (tick >= SHUFFLE_TICKS) {
        clearInterval(id)
        setFlipIdx(-1)
        setIsShuffling(false)
      }
    }, SHUFFLE_INTERVAL)
    return () => clearInterval(id)
  }, [active, names])

  return { shuffledNames, flipIdx, isShuffling }
}

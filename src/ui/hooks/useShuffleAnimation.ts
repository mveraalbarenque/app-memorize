import { useEffect, useRef, useState } from 'react'

interface ShuffleResult {
  shuffledNames: string[]
  flipIdx: number
  isShuffling: boolean
}

const SHUFFLE_INTERVAL = 200
const SHUFFLE_TICKS = (5 * 1000) / SHUFFLE_INTERVAL

export function useShuffleAnimation(
  names: string[],
  active: boolean,
  onDone?: () => void
): ShuffleResult {
  const [shuffledNames, setShuffledNames] = useState(names)
  const [flipIdx, setFlipIdx] = useState(-1)
  const [isShuffling, setIsShuffling] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!active) return

    setShuffledNames(names)
    setIsShuffling(true)

    const finalOrder = (() => {
      const arr = [...names]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    })()

    let tick = 0
    const id = setInterval(() => {
      if (tick === 0) {
        setShuffledNames(finalOrder)
      } else {
        setShuffledNames((prev) => {
          const arr = [...prev]
          const i = Math.floor(Math.random() * arr.length)
          let j = Math.floor(Math.random() * arr.length)
          while (j === i) j = Math.floor(Math.random() * arr.length)
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          return arr
        })
      }
      setFlipIdx(Math.floor(Math.random() * names.length))
      tick++
      if (tick >= SHUFFLE_TICKS) {
        clearInterval(id)
        setFlipIdx(-1)
        setIsShuffling(false)
        onDoneRef.current?.()
      }
    }, SHUFFLE_INTERVAL)
    return () => clearInterval(id)
  }, [active, names])

  return { shuffledNames, flipIdx, isShuffling }
}

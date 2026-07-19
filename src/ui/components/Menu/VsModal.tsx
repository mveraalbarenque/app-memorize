import { memo, useCallback, useEffect, useRef, useState } from 'react'
import type { PlayerConfig } from '@/core/types'
import { useFocusTrap } from '@/ui/hooks/useFocusTrap'
import { useShuffleAnimation } from '@/ui/hooks/useShuffleAnimation'
import { useCountdown } from '@/ui/hooks/useCountdown'
import VsConfig from './VsConfig'
import NameCardList from './NameCardList'
import CountdownCircle from '@/ui/components/CountdownCircle'

import styles from './styles.module.css'

interface Props {
  vsCount: number
  vsNames: string[]
  defaultNames: string[]
  show: boolean
  onChangeCount: (count: number) => void
  onChangeName: (idx: number, name: string) => void
  onDone: (players: PlayerConfig[]) => void
  onClose: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

type Step = 'config' | 'reveal' | 'shuffling' | 'ready'

const COUNTDOWN_START = 5

const VsModal = memo((props: Props) => {
  const {
    vsCount,
    vsNames,
    defaultNames,
    show,
    onChangeCount,
    onChangeName,
    onDone,
    onClose,
    onKeyDown,
  } = props

  const [step, setStep] = useState<Step>('config')
  const [lockedNames, setLockedNames] = useState<string[]>([])
  const shuffledRef = useRef<string[]>([])

  const trapRef = useFocusTrap(show && step === 'config')

  useEffect(() => {
    if (show) {
      setStep('config')
      setLockedNames([])
    }
  }, [show])

  const handleAccept = useCallback(() => {
    setLockedNames(vsNames)
    setStep('reveal')
  }, [vsNames])

  useEffect(() => {
    if (step !== 'reveal') return
    const id = setTimeout(() => {
      setStep('shuffling')
    }, 800)
    return () => clearTimeout(id)
  }, [step])

  const { shuffledNames, flipIdx, isShuffling } = useShuffleAnimation(
    lockedNames,
    step === 'shuffling'
  )

  useEffect(() => {
    if (step === 'shuffling' && !isShuffling && lockedNames.length > 0) {
      setStep('ready')
    }
  }, [step, isShuffling, lockedNames])

  useEffect(() => {
    shuffledRef.current = shuffledNames
  }, [shuffledNames])

  const handleCountdownDone = useCallback(() => {
    onDone(shuffledRef.current.map((name) => ({ name })))
  }, [onDone])

  const { countdown, progress } = useCountdown(
    COUNTDOWN_START,
    step === 'ready',
    handleCountdownDone
  )

  const propsOverlay = {
    className: styles.vsOverlay,
    role: 'dialog' as const,
    'aria-modal': true as const,
    'aria-label': 'Configurar VS',
    ref: trapRef,
  }

  if (!show) return null

  return (
    <div {...propsOverlay} onKeyDown={onKeyDown}>
      <div className={styles.vsModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.vsModalOverlay} />
        <div className={styles.vsModalInner}>
          {step === 'config' && (
            <VsConfig
              vsCount={vsCount}
              vsNames={vsNames}
              defaultNames={defaultNames}
              onChangeCount={onChangeCount}
              onChangeName={onChangeName}
              onAccept={handleAccept}
              onClose={onClose}
            />
          )}

          {step === 'reveal' && (
            <>
              <p className={styles.vsTitle}>🃏 Orden de Jugadores</p>
              <NameCardList names={lockedNames} variant="reveal" />
            </>
          )}

          {step === 'shuffling' && (
            <>
              <p className={styles.vsTitle}>🔄 Orden de Jugadores</p>
              <NameCardList names={shuffledNames} variant="shuffling" flipIdx={flipIdx} />
            </>
          )}

          {step === 'ready' && (
            <>
              <p className={styles.vsTitle}>✅ Orden de Jugadores</p>
              <NameCardList names={shuffledNames} variant="ready" />
              <CountdownCircle countdown={countdown} progress={progress} className={styles.countdownWrap} />
            </>
          )}
        </div>
      </div>
    </div>
  )
})

export default VsModal

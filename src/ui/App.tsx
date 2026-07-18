import { lazy, Suspense, useCallback, useState } from 'react'
import type { PlayerConfig } from '@/core/types'
import { useTheme } from '@/ui/hooks/useTheme'
import { DEFAULT_CATEGORY } from './components/Categories/categories'
import CategoryModal from './components/CategoryModal'
import FABGroup from './components/FABGroup'
import LiquidFilter from './components/LiquidFilter'
import MenuScreen from './screens/MenuScreen'
import styles from './styles.module.css'

const GameScreen = lazy(() => import('./screens/GameScreen'))

const App = () => {
  const { theme, toggleTheme } = useTheme()

  const [screen, setScreen] = useState<'menu' | 'game'>('menu')
  const [gameKey, setGameKey] = useState(0)
  const [gamePlayers, setGamePlayers] = useState<PlayerConfig[]>([])
  const [gameCategory, setGameCategory] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [showCatModal, setShowCatModal] = useState(false)
  const [category, setCategory] = useState(DEFAULT_CATEGORY)

  const toggleSound = useCallback(
    () => setIsMuted((m) => !m),
    [],
  )

  const selectCategory = useCallback((cat: string) => {
    setCategory(cat)
    setShowCatModal(false)
  }, [])

  const handleStart = useCallback(
    (players: PlayerConfig[], cat: string) => {
      setGamePlayers(players)
      setGameCategory(cat)
      setGameKey((k) => k + 1)
      setScreen('game')
    },
    [],
  )

  const handleBackToMenu = useCallback(() => {
    setGamePlayers([])
    setGameCategory('')
    setScreen('menu')
  }, [])

  return (
    <div className={styles.layout}>
      <LiquidFilter />

      <CategoryModal
        show={showCatModal}
        category={category}
        onSelect={selectCategory}
        onClose={() => setShowCatModal(false)}
      />

      <FABGroup
        showCatButton={screen === 'menu'}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onToggleTheme={toggleTheme}
        onOpenCategories={() => setShowCatModal(true)}
        theme={theme}
      />

      {screen === 'menu' ? (
        <MenuScreen category={category} onStart={handleStart} />
      ) : (
        <Suspense fallback={null}>
          <GameScreen
            key={gameKey}
            players={gamePlayers}
            category={gameCategory}
            onBackToMenu={handleBackToMenu}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App

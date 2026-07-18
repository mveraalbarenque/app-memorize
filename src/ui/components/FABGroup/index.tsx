import { memo } from 'react'
import styles from './styles.module.css'

interface Props {
  showCatButton: boolean
  isMuted: boolean
  onToggleSound: () => void
  onToggleTheme: () => void
  onOpenCategories: () => void
  theme: string
}

const FABGroup = memo((props: Props) => {
  const { showCatButton, isMuted, onToggleSound, onToggleTheme, onOpenCategories, theme } = props

  return (
    <div className={styles.group}>
      {showCatButton && (
        <button
          className={styles.fab}
          onClick={onOpenCategories}
          title="Categorías"
        >
          <span className={styles.fabIcon}>
            <img src="/icons/categories.svg" alt="Categorías" />
          </span>
        </button>
      )}
      <button
        className={styles.fab}
        onClick={onToggleSound}
        title={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        <span className={styles.fabIcon}>
          <img src={isMuted ? '/icons/off.svg' : '/icons/on.svg'} alt={isMuted ? 'Activar sonido' : 'Silenciar'} />
        </span>
      </button>
      <button
        className={styles.fab}
        onClick={onToggleTheme}
        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      >
        <span className={styles.fabIcon}>
          <img src={theme === 'dark' ? '/icons/sun.svg' : '/icons/moon.svg'} alt={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'} />
        </span>
      </button>
    </div>
  )
})

export default FABGroup

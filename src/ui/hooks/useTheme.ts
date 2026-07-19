import { useCallback, useEffect, useState } from 'react'

const getInitial = (): string => {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const applyTheme = (t: string) => {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('theme', t)
}

export const useTheme = () => {
  const [theme, setTheme] = useState(getInitial)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue && e.newValue !== theme) {
        setTheme(e.newValue)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  )

  return { theme, toggleTheme }
}

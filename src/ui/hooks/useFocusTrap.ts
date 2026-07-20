import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const useFocusTrap = (active: boolean) => {
  const ref = useRef<HTMLDivElement>(null)
  const prevFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    prevFocus.current = document.activeElement as HTMLElement
    const el = ref.current
    if (!el) return
    const focusables = el.querySelectorAll<HTMLElement>(FOCUSABLE)
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (first) first.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    el.addEventListener('keydown', handler)
    return () => {
      el.removeEventListener('keydown', handler)
      prevFocus.current?.focus()
    }
  }, [active])

  return ref
}

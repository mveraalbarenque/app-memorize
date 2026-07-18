import { memo } from 'react'
import styles from './styles.module.css'

type Variant = 'primary' | 'success' | 'warning' | 'danger'

type Size = 'sm' | 'md' | 'lg'

interface Props {
  variant?: Variant
  size?: Size
  className?: string
  children?: React.ReactNode
  icon?: string
  iconPosition?: 'left' | 'right'
}

const VARIANTS: Record<Variant, string> = {
  primary: styles.primary,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
}

const SIZES: Record<Size, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

const Button = memo((props: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { variant = 'primary', size = 'md', icon, iconPosition = 'left', className = '', children, ...rest } = props

  const iconEl = icon
    ? <img src={`/${icon}`} alt="" className={`${styles.icon} ${iconPosition === 'right' ? styles.iconRight : ''}`} />
    : null

  const classes = [styles.btn, VARIANTS[variant], SIZES[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {iconPosition === 'left' && iconEl}
      {children}
      {iconPosition === 'right' && iconEl}
    </button>
  )
})

export default Button

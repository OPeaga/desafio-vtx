import clsx from 'clsx'

type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  label?: string
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

export function Spinner({ size = 'md', label = 'Carregando…', className = '' }: SpinnerProps) {
  return (
    <span role="status" className={clsx('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className={clsx('animate-spin rounded-full border-border border-t-primary', sizeClasses[size])}
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}

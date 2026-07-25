import clsx from 'clsx'
import type { ReactNode } from 'react'

type BadgeVariant = 'venda' | 'doacao' | 'category' | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  venda: 'bg-venda-bg text-venda',
  doacao: 'bg-doacao-bg text-doacao',
  category: 'bg-category-bg text-category',
  neutral: 'bg-surface text-text-muted',
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

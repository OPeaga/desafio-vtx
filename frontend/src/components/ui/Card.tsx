import clsx from 'clsx'
import type { ElementType, HTMLAttributes } from 'react'

type CardPadding = 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  padding?: CardPadding
}

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

export function Card({ as: Tag = 'div', padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <Tag
      className={clsx(
        'rounded-lg border border-border bg-surface-raised shadow-xs',
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

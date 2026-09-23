import Link from 'next/link'

import { Icon, type IconName } from '@/components/icons'

type LinkCardProps = {
  href: string
  title: string
  description: string
  icon: IconName
  /** 교육문의처럼 강조할 카드 (accent 테두리 + 연한 배경) */
  featured?: boolean
}

/** 홈허브의 링크 카드. 호버 시 살짝 떠오르고 테두리가 accent로 바뀐다. */
export function LinkCard({ href, title, description, icon, featured = false }: LinkCardProps) {
  return (
    <Link
      href={href}
      className={[
        'lift-on-hover group flex items-center gap-4 rounded-card border p-4 shadow-card hover:border-accent hover:shadow-card-hover sm:p-5',
        featured ? 'border-accent/45 bg-accent-soft' : 'border-line bg-surface',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors',
          featured ? 'bg-surface text-accent' : 'bg-accent-soft text-accent-ink',
        ].join(' ')}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-sm text-ink-soft">{description}</span>
      </span>

      <Icon
        name="arrow"
        className="h-5 w-5 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
      />
    </Link>
  )
}

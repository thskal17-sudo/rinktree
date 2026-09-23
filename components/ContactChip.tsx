import { Icon, type IconName } from '@/components/icons'

type ContactChipProps = {
  href: string
  label: string
  icon: IconName
  /** 새 탭으로 열지 여부 (mailto·tel은 false) */
  external?: boolean
}

/** 이메일·카카오·인스타 같은 연락 수단 칩 */
export function ContactChip({ href, label, icon, external = false }: ContactChipProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className="lift-on-hover inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-ink-soft shadow-card hover:border-accent hover:text-accent"
    >
      <Icon name={icon} className="h-4 w-4" />
      <span>{label}</span>
    </a>
  )
}

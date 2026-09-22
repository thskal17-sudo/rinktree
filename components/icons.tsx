import type { SVGProps } from 'react'

/** 링크 카드·연락처 칩에 쓰는 단색 아이콘 모음 (currentColor 상속) */
export type IconName = keyof typeof paths

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const paths = {
  building:
    'M4 21V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15M14 10h5a1 1 0 0 1 1 1v10M3 21h18M7 9h3M7 13h3M7 17h3M17 14h1M17 18h1',
  book: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5v-15ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5M8 7h8M8 11h5',
  chat: 'M21 12a8 8 0 0 1-8 8H8l-4 2 1-4.2A8 8 0 1 1 21 12Z M8.5 11h7M8.5 14.5h4',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16.5 3.13a4 4 0 0 1 0 7.75',
  mail: 'M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11ZM3.5 6.8 12 13l8.5-6.2',
  instagram:
    'M7 2.5h10A4.5 4.5 0 0 1 21.5 7v10a4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 17V7A4.5 4.5 0 0 1 7 2.5ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM17.3 6.7h.01',
  arrow: 'M9 6l6 6-6 6',
  check: 'M4 12.5l5 5L20 6.5',
  alert:
    'M12 8v5M12 16.5h.01M10.3 3.6 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z',
} as const

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d={paths[name]} />
    </svg>
  )
}

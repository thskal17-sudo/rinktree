'use client'

import { useTheme } from 'next-themes'

/**
 * 라이트/다크 수동 전환 버튼.
 *
 * 아이콘은 현재 테마를 state로 읽지 않고 CSS(.theme-icon-*)로 바꾼다.
 * 서버는 테마를 알 수 없어 state로 그리면 하이드레이션 불일치가 나고,
 * 마운트 전까지 아이콘이 비어 보이기 때문이다.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="라이트/다크 테마 전환"
      title="라이트/다크 테마 전환"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="lift-on-hover inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-soft shadow-card hover:border-accent hover:text-accent"
    >
      <SunIcon />
      <MoonIcon />
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="theme-icon-sun h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="theme-icon-moon h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

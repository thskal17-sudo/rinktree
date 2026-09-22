import Link from 'next/link'

import { ThemeToggle } from '@/components/ThemeToggle'

/** 하위 페이지 상단 줄: 홈으로 돌아가는 링크 + 테마 토글 */
export function BackHome() {
  return (
    <div className="mb-7 flex items-center justify-between gap-3">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span> 홈으로
      </Link>
      <ThemeToggle />
    </div>
  )
}

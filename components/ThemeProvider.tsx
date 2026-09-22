'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

/**
 * 라이트/다크 테마 공급자.
 * prefers-color-scheme를 기본값으로 쓰고, 사용자가 고른 값은 localStorage에 남는다.
 * html 태그의 data-theme 속성이 바뀌면 globals.css의 토큰이 통째로 교체된다.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

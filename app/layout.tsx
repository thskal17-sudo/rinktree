import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google'

import { ThemeProvider } from '@/components/ThemeProvider'
import { site } from '@/content/site'
import '@/styles/globals.css'

/**
 * 한글 폰트는 유니코드 구간별로 잘게 쪼개져 제공된다(파일 120여 개).
 * preload를 켜면 전 구간을 미리 받아야 하므로 끄고, 실제로 쓰이는 구간만
 * 브라우저가 내려받게 한다. 파일 자체는 빌드 타임에 self-host된다.
 */
const notoSans = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: false,
})

const notoSerif = Noto_Serif_KR({
  variable: '--font-noto-serif-kr',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: 'summary',
    title: site.name,
    description: site.description,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1eee6' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1626' },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${notoSans.variable} ${notoSerif.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {/* 헤더/푸터 없이 한 칼럼으로만 흐르는 링크허브 구조 */}
          <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pt-8 pb-14 sm:px-6 sm:pt-12">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

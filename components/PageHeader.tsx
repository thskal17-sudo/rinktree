import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  lead?: string
  children?: ReactNode
}

/** 하위 페이지 공통 머리말 (제목 + 한 줄 소개) */
export function PageHeader({ title, lead, children }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl sm:text-[1.75rem]">{title}</h1>
      {lead ? <p className="mt-2.5 leading-relaxed text-ink-soft">{lead}</p> : null}
      {children}
    </header>
  )
}

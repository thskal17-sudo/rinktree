import type { Metadata } from 'next'

import { BackHome } from '@/components/BackHome'
import { InquiryCta } from '@/components/InquiryCta'
import { PageHeader } from '@/components/PageHeader'
import { programs } from '@/content/pages'

export const metadata: Metadata = {
  title: programs.title,
  description: programs.lead,
}

export default function ProgramsPage() {
  return (
    <>
      <BackHome />
      <PageHeader title={programs.title} lead={programs.lead} />

      <ul className="flex flex-col gap-3">
        {programs.categories.map((category) => (
          <li
            key={category.id}
            className="rounded-card border border-line bg-surface p-5 shadow-card"
          >
            <h2 className="text-lg">{category.name}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{category.summary}</p>

            <ul className="mt-4 flex flex-col gap-1.5">
              {category.courses.map((course) => (
                <li key={course} className="flex items-start gap-2 text-[15px] text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {course}
                </li>
              ))}
            </ul>

            <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pt-3.5 text-xs text-ink-soft">
              <div className="flex gap-1.5">
                <dt className="font-medium">대상</dt>
                <dd>{category.target}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="font-medium">시간</dt>
                <dd>{category.duration}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-card border border-line bg-accent-soft p-5">
        <h2 className="text-base">운영 방식</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {programs.notes.map((note) => (
            <li key={note} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              {note}
            </li>
          ))}
        </ul>
      </section>

      <InquiryCta text="과정별 상세 커리큘럼이 궁금하신가요?" />
    </>
  )
}

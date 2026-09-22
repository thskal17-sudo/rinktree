import type { Metadata } from 'next'

import { BackHome } from '@/components/BackHome'
import { InquiryCta } from '@/components/InquiryCta'
import { PageHeader } from '@/components/PageHeader'
import { about } from '@/content/pages'

export const metadata: Metadata = {
  title: about.title,
  description: about.lead,
}

export default function AboutPage() {
  return (
    <>
      <BackHome />
      <PageHeader title={about.title} lead={about.lead} />

      <section className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-lg">{about.philosophy.heading}</h2>
        {about.philosophy.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-3 leading-relaxed text-ink-soft">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-lg">연혁</h2>
        <ol className="mt-4 border-l border-line pl-5">
          {about.history.map((entry) => (
            <li key={entry.year} className="relative pb-5 last:pb-0">
              <span
                className="absolute top-2 -left-[1.53rem] h-2 w-2 rounded-full bg-accent"
                aria-hidden
              />
              <div className="font-serif font-bold text-accent">{entry.year}</div>
              <ul className="mt-1 space-y-1">
                {entry.items.map((item) => (
                  <li key={item} className="text-[15px] leading-relaxed text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-lg">강사진</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {about.instructors.map((instructor) => (
            <li
              key={instructor.name}
              className="rounded-card border border-line bg-surface p-4 shadow-card sm:p-5"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-semibold text-ink">{instructor.name}</span>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
                  {instructor.field}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{instructor.career}</p>
            </li>
          ))}
        </ul>
      </section>

      <InquiryCta />
    </>
  )
}

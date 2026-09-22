import type { Metadata } from 'next'

import { BackHome } from '@/components/BackHome'
import { PageHeader } from '@/components/PageHeader'
import { Icon } from '@/components/icons'
import { recruit } from '@/content/pages'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: recruit.title,
  description: recruit.lead,
}

const mailSubject = encodeURIComponent('[강사잇다] 강사 지원')

export default function RecruitPage() {
  return (
    <>
      <BackHome />
      <PageHeader title={recruit.title} lead={recruit.lead} />

      <section>
        <h2 className="text-lg">모집 분야</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {recruit.fields.map((field) => (
            <li
              key={field.name}
              className="rounded-card border border-line bg-surface p-4 shadow-card"
            >
              <div className="font-semibold text-ink">{field.name}</div>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{field.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg">자격요건</h2>
        <ul className="mt-4 flex flex-col gap-2.5">
          {recruit.requirements.map((requirement) => (
            <li key={requirement} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
              <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <span className="text-ink-soft">{requirement}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg">지원 방법</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {recruit.apply.steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-xs font-bold text-accent">
                {index + 1}
              </span>
              <span className="text-[15px] leading-relaxed text-ink-soft">{step}</span>
            </li>
          ))}
        </ol>

        <a
          href={`mailto:${site.contact.email}?subject=${mailSubject}`}
          className="lift-on-hover mt-5 flex items-center justify-center gap-2 rounded-card border border-accent/45 bg-accent-soft px-4 py-3.5 font-medium text-accent shadow-card hover:shadow-card-hover"
        >
          <Icon name="mail" className="h-4.5 w-4.5" />
          {site.contact.email}으로 지원서 보내기
        </a>

        <p className="mt-3 text-center text-xs leading-relaxed text-ink-soft">
          {recruit.apply.note}
        </p>
      </section>
    </>
  )
}

import { ContactChip } from '@/components/ContactChip'
import { LinkCard } from '@/components/LinkCard'
import { StatTile } from '@/components/StatTile'
import { ThemeToggle } from '@/components/ThemeToggle'
import { site } from '@/content/site'

/** 링크허브 홈: 기관 소개 + 통계 + 링크 카드 4개 + 연락처 */
export default function HomePage() {
  return (
    <>
      <div className="mb-6 flex justify-end">
        <ThemeToggle />
      </div>

      <header className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface shadow-card">
          <span className="font-serif text-xl font-bold text-accent">한</span>
        </div>
        <h1 className="mt-4 text-2xl leading-snug sm:text-[1.75rem]">{site.name}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{site.tagline}</p>
      </header>

      <div className="mt-7 grid grid-cols-3 gap-2.5 sm:gap-3">
        {site.stats.map((stat) => (
          <StatTile key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>

      <nav aria-label="주요 메뉴" className="mt-7">
        <ul className="flex flex-col gap-3">
          {site.links.map((link) => (
            <li key={link.href}>
              <LinkCard
                href={link.href}
                title={link.title}
                description={link.description}
                icon={link.icon}
                featured={'featured' in link ? link.featured : false}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <ContactChip href={`mailto:${site.contact.email}`} label="이메일" icon="mail" />
        <ContactChip href={site.contact.kakao} label="카카오톡" icon="chat" external />
        <ContactChip href={site.contact.instagram} label="인스타그램" icon="instagram" external />
      </div>

      <footer className="mt-auto pt-10 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} {site.name}
      </footer>
    </>
  )
}

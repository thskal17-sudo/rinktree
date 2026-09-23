import type { Metadata } from 'next'

import { BackHome } from '@/components/BackHome'
import { ContactChip } from '@/components/ContactChip'
import { PageHeader } from '@/components/PageHeader'
import { site } from '@/content/site'

import { InquiryForm } from './InquiryForm'

const lead = '교육 대상과 일정만 알려 주셔도 됩니다. 담당자가 확인 후 연락드립니다.'

export const metadata: Metadata = {
  title: '교육문의',
  description: lead,
}

export default function InquiryPage() {
  return (
    <>
      <BackHome />
      <PageHeader title="교육문의" lead={lead} />

      <InquiryForm />

      <div className="mt-9 border-t border-line pt-6 text-center">
        <p className="text-sm text-ink-soft">바로 연락하고 싶으시다면</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2.5">
          <ContactChip
            href={`mailto:${site.contact.email}`}
            label={site.contact.email}
            icon="mail"
          />
          <ContactChip href={site.contact.kakao} label="카카오톡 채널" icon="chat" external />
        </div>
      </div>
    </>
  )
}

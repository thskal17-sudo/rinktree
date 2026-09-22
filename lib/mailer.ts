import 'server-only'

import { Resend } from 'resend'

import { site } from '@/content/site'

/**
 * 문의 접수 알림 메일 발송 (Resend).
 *
 * 발신 주소(INQUIRY_FROM_EMAIL)는 Resend에서 인증한 도메인이어야 한다.
 * 도메인 인증 전에는 테스트 발신 주소 onboarding@resend.dev를 쓸 수 있는데,
 * 이때는 Resend 계정에 등록된 본인 주소로만 발송된다.
 */

const apiKey = process.env.RESEND_API_KEY
const fromAddress = process.env.INQUIRY_FROM_EMAIL ?? 'onboarding@resend.dev'
const toAddress = process.env.INQUIRY_TO_EMAIL ?? site.contact.email

export const isMailerConfigured = Boolean(apiKey)

let cachedClient: Resend | null = null

function getResend(): Resend | null {
  if (!apiKey) return null
  cachedClient ??= new Resend(apiKey)
  return cachedClient
}

export type InquiryMailInput = {
  name: string
  organization: string | null
  phone: string
  email: string | null
  program: string | null
  message: string
  receivedAt: Date
}

export type SendMailResult =
  | { status: 'sent'; id: string | null }
  | { status: 'skipped' }
  | { status: 'failed'; error: string }

export async function sendInquiryNotification(input: InquiryMailInput): Promise<SendMailResult> {
  const resend = getResend()
  if (!resend) return { status: 'skipped' }

  const subjectSuffix = input.organization ? ` · ${input.organization}` : ''

  try {
    const { data, error } = await resend.emails.send({
      from: `${site.name} 문의 <${fromAddress}>`,
      to: [toAddress],
      subject: `[교육문의] ${input.name}${subjectSuffix}`,
      // 문의자에게 바로 답장할 수 있도록 회신 주소를 문의자 메일로 지정한다.
      ...(input.email ? { replyTo: input.email } : {}),
      text: buildText(input),
      html: buildHtml(input),
    })

    if (error) {
      return { status: 'failed', error: error.message }
    }

    return { status: 'sent', id: data?.id ?? null }
  } catch (error) {
    return { status: 'failed', error: error instanceof Error ? error.message : String(error) }
  }
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Asia/Seoul',
})

function rows(input: InquiryMailInput) {
  return [
    ['이름', input.name],
    ['기관·회사', input.organization ?? '-'],
    ['연락처', input.phone],
    ['이메일', input.email ?? '-'],
    ['관심 과정', input.program ?? '-'],
    ['접수 시각', dateFormatter.format(input.receivedAt)],
  ] as const
}

function buildText(input: InquiryMailInput): string {
  const header = rows(input)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')

  return `${header}\n\n문의 내용\n${'-'.repeat(20)}\n${input.message}\n`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml(input: InquiryMailInput): string {
  const tableRows = rows(input)
    .map(
      ([label, value]) =>
        `<tr>
           <th align="left" style="padding:6px 14px 6px 0;color:#4B5875;font-weight:500;white-space:nowrap;vertical-align:top">${label}</th>
           <td style="padding:6px 0;color:#172440">${escapeHtml(value)}</td>
         </tr>`
    )
    .join('')

  return `<div style="font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background:#F1EEE6;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:18px;padding:24px">
      <h1 style="margin:0 0 4px;font-size:18px;color:#172440">새 교육문의가 접수되었습니다</h1>
      <p style="margin:0 0 18px;font-size:13px;color:#4B5875">${escapeHtml(site.name)} 홈페이지 교육문의 폼</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${tableRows}</table>
      <div style="margin-top:18px;padding-top:16px;border-top:1px solid rgba(23,36,64,0.12)">
        <div style="font-size:13px;color:#4B5875;margin-bottom:6px">문의 내용</div>
        <div style="font-size:14px;color:#172440;line-height:1.7;white-space:pre-wrap">${escapeHtml(input.message)}</div>
      </div>
    </div>
  </div>`
}

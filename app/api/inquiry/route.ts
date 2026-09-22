import { NextResponse } from 'next/server'

import { site } from '@/content/site'
import { isMailerConfigured, sendInquiryNotification } from '@/lib/mailer'
import { isSupabaseConfigured, saveInquiry } from '@/lib/supabase'
import {
  isHoneypotTripped,
  toInquiryFormValues,
  validateInquiry,
  type InquiryApiResponse,
} from '@/lib/validation'

/**
 * 교육문의 수신 API.
 *
 * 검증 → DB 저장 + 메일 발송을 함께 수행한다. 둘 다 시도하므로 한쪽이
 * 실패해도 문의가 통째로 사라지지는 않는다.
 *
 * 성공/실패 판단 (설계 문서 「실패 처리」)
 *  - DB 저장 성공: 메일 발송이 실패해도 사용자에게는 접수 완료로 안내
 *  - DB 저장 실패: 사용자에게 오류를 알리고 재시도를 유도
 *  - DB 미설정(1단계 운영): 메일 발송 성공 여부로 판단
 */

const SUCCESS_MESSAGE = '문의가 접수되었습니다. 영업일 기준 1~2일 안에 연락드리겠습니다.'
const RETRY_MESSAGE = `문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도하시거나 ${site.contact.email}으로 보내 주세요.`

function json(body: InquiryApiResponse, status: number) {
  return NextResponse.json(body, { status })
}

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return json({ ok: false, message: '요청 형식이 올바르지 않습니다.' }, 400)
  }

  const values = toInquiryFormValues(payload)

  // 봇이 채운 요청은 오류를 돌려주지 않고 조용히 성공한 것처럼 끝낸다.
  if (isHoneypotTripped(values)) {
    console.info('[inquiry] honeypot 필드가 채워져 저장하지 않음')
    return json({ ok: true, message: SUCCESS_MESSAGE }, 200)
  }

  const validation = validateInquiry(values)
  if (!validation.ok) {
    return json({ ok: false, message: '입력값을 확인해 주세요.', errors: validation.errors }, 400)
  }

  const inquiry = validation.data

  const [saveResult, mailResult] = await Promise.all([
    saveInquiry(inquiry),
    sendInquiryNotification({ ...inquiry, receivedAt: new Date() }),
  ])

  if (saveResult.status === 'failed') {
    console.error('[inquiry] DB 저장 실패:', saveResult.error)
    return json({ ok: false, message: RETRY_MESSAGE }, 500)
  }

  if (mailResult.status === 'failed') {
    // DB에는 남았으므로 사용자에게는 성공으로 안내하고 로그만 남긴다.
    console.error('[inquiry] 알림 메일 발송 실패:', mailResult.error)
  }

  if (saveResult.status === 'skipped' && mailResult.status !== 'sent') {
    if (process.env.NODE_ENV === 'production') {
      console.error('[inquiry] 저장·발송 수단이 모두 설정되지 않았습니다. 환경변수를 확인하세요.', {
        supabase: isSupabaseConfigured,
        resend: isMailerConfigured,
      })
      return json({ ok: false, message: RETRY_MESSAGE }, 503)
    }

    // 로컬 개발: 환경변수 없이도 폼 동작을 확인할 수 있도록 콘솔에 남긴다.
    console.info('[inquiry] (개발 모드) 저장·발송 설정이 없어 콘솔에만 기록합니다.', inquiry)
  }

  return json({ ok: true, message: SUCCESS_MESSAGE }, 200)
}

/**
 * 교육문의 입력값 검증.
 *
 * 클라이언트(제출 전)와 서버(API 라우트) 양쪽에서 같은 함수를 쓴다.
 * 브라우저 검증은 언제든 우회될 수 있으므로 서버 검증이 실제 방어선이다.
 */

export const INQUIRY_MAX_LENGTH = {
  name: 40,
  organization: 60,
  phone: 20,
  email: 100,
  program: 40,
  message: 2000,
} as const

export type InquiryFormValues = {
  name: string
  organization: string
  phone: string
  email: string
  program: string
  message: string
  /** 스팸 방지용 honeypot. 사람에게는 보이지 않으므로 항상 빈 값이어야 한다. */
  website: string
}

export const EMPTY_INQUIRY_FORM: InquiryFormValues = {
  name: '',
  organization: '',
  phone: '',
  email: '',
  program: '',
  message: '',
  website: '',
}

export type InquiryField = Exclude<keyof InquiryFormValues, 'website'>
export type InquiryFieldErrors = Partial<Record<InquiryField, string>>

/** 검증을 통과한 문의 (빈 선택 항목은 null로 정규화) */
export type ValidatedInquiry = {
  name: string
  organization: string | null
  phone: string
  email: string | null
  program: string | null
  message: string
}

export type InquiryValidationResult =
  { ok: true; data: ValidatedInquiry } | { ok: false; errors: InquiryFieldErrors }

/** API 응답 형식 (클라이언트와 공유) */
export type InquiryApiResponse =
  { ok: true; message: string } | { ok: false; message: string; errors?: InquiryFieldErrors }

const PHONE_PATTERN = /^[0-9-]+$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 알 수 없는 입력(JSON 본문 등)을 문자열 폼 값으로 맞춘다. */
export function toInquiryFormValues(input: unknown): InquiryFormValues {
  const source = (typeof input === 'object' && input !== null ? input : {}) as Record<
    string,
    unknown
  >

  const read = (key: keyof InquiryFormValues) =>
    typeof source[key] === 'string' ? (source[key] as string) : ''

  return {
    name: read('name'),
    organization: read('organization'),
    phone: read('phone'),
    email: read('email'),
    program: read('program'),
    message: read('message'),
    website: read('website'),
  }
}

/** honeypot에 값이 차 있으면 봇으로 본다. */
export function isHoneypotTripped(values: InquiryFormValues): boolean {
  return values.website.trim() !== ''
}

export function validateInquiry(values: InquiryFormValues): InquiryValidationResult {
  const name = values.name.trim()
  const organization = values.organization.trim()
  const phone = values.phone.trim()
  const email = values.email.trim()
  const program = values.program.trim()
  const message = values.message.trim()

  const errors: InquiryFieldErrors = {}

  if (!name) {
    errors.name = '이름을 입력해 주세요.'
  } else if (name.length > INQUIRY_MAX_LENGTH.name) {
    errors.name = `이름은 ${INQUIRY_MAX_LENGTH.name}자 이내로 입력해 주세요.`
  }

  if (organization.length > INQUIRY_MAX_LENGTH.organization) {
    errors.organization = `기관·회사명은 ${INQUIRY_MAX_LENGTH.organization}자 이내로 입력해 주세요.`
  }

  const phoneDigits = phone.replace(/\D/g, '')
  if (!phone) {
    errors.phone = '연락처를 입력해 주세요.'
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = '연락처는 숫자와 하이픈(-)만 입력할 수 있습니다.'
  } else if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.phone = '연락처 자릿수를 확인해 주세요.'
  }

  if (email) {
    if (!EMAIL_PATTERN.test(email)) {
      errors.email = '이메일 형식을 확인해 주세요.'
    } else if (email.length > INQUIRY_MAX_LENGTH.email) {
      errors.email = `이메일은 ${INQUIRY_MAX_LENGTH.email}자 이내로 입력해 주세요.`
    }
  }

  if (program.length > INQUIRY_MAX_LENGTH.program) {
    errors.program = '관심 과정을 다시 선택해 주세요.'
  }

  if (!message) {
    errors.message = '문의 내용을 입력해 주세요.'
  } else if (message.length < 5) {
    errors.message = '문의 내용을 5자 이상 입력해 주세요.'
  } else if (message.length > INQUIRY_MAX_LENGTH.message) {
    errors.message = `문의 내용은 ${INQUIRY_MAX_LENGTH.message}자 이내로 입력해 주세요.`
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    data: {
      name,
      organization: organization || null,
      phone,
      email: email || null,
      program: program || null,
      message,
    },
  }
}

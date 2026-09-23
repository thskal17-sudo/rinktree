'use client'

import { useState } from 'react'

import { FormField } from '@/components/FormField'
import { Icon } from '@/components/icons'
import { programOptions } from '@/content/pages'
import { site } from '@/content/site'
import {
  EMPTY_INQUIRY_FORM,
  INQUIRY_MAX_LENGTH,
  validateInquiry,
  type InquiryApiResponse,
  type InquiryFieldErrors,
  type InquiryFormValues,
} from '@/lib/validation'

type Status = 'idle' | 'submitting' | 'success' | 'error'

/** 필드 순서 — 오류가 났을 때 첫 필드로 포커스를 옮기는 데 쓴다. */
const FIELD_ORDER = ['name', 'organization', 'phone', 'email', 'program', 'message'] as const

export function InquiryForm() {
  const [values, setValues] = useState<InquiryFormValues>(EMPTY_INQUIRY_FORM)
  const [errors, setErrors] = useState<InquiryFieldErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const update =
    (field: keyof InquiryFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value } = event.target
      setValues((previous) => ({ ...previous, [field]: value }))
      // 입력을 고치는 즉시 해당 필드의 오류 메시지는 지운다.
      setErrors((previous) =>
        previous[field as keyof InquiryFieldErrors] ? { ...previous, [field]: undefined } : previous
      )
    }

  const focusFirstError = (fieldErrors: InquiryFieldErrors) => {
    const firstField = FIELD_ORDER.find((field) => fieldErrors[field])
    if (firstField) document.getElementById(firstField)?.focus()
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    // 서버와 같은 규칙으로 먼저 걸러 왕복을 줄인다.
    const validation = validateInquiry(values)
    if (!validation.ok) {
      setErrors(validation.errors)
      setStatus('error')
      setMessage('입력값을 확인해 주세요.')
      focusFirstError(validation.errors)
      return
    }

    setStatus('submitting')
    setErrors({})
    setMessage('')

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = (await response.json()) as InquiryApiResponse

      if (!result.ok) {
        setErrors(result.errors ?? {})
        setStatus('error')
        setMessage(result.message)
        if (result.errors) focusFirstError(result.errors)
        return
      }

      setValues(EMPTY_INQUIRY_FORM)
      setStatus('success')
      setMessage(result.message)
    } catch {
      setStatus('error')
      setMessage(
        `네트워크 오류로 접수하지 못했습니다. 잠시 후 다시 시도하시거나 ${site.contact.email}으로 보내 주세요.`
      )
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        tabIndex={-1}
        ref={(node) => {
          node?.focus()
        }}
        className="rounded-card border border-accent/45 bg-accent-soft p-6 text-center shadow-card"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-accent">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg">문의가 접수되었습니다</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{message}</p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setMessage('')
          }}
          className="lift-on-hover mt-5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-card hover:border-accent hover:text-accent"
        >
          다른 문의 남기기
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-4">
      <FormField
        id="name"
        name="name"
        label="이름"
        required
        autoComplete="name"
        maxLength={INQUIRY_MAX_LENGTH.name}
        value={values.name}
        onChange={update('name')}
        error={errors.name}
      />

      <FormField
        id="organization"
        name="organization"
        label="기관·회사명"
        autoComplete="organization"
        maxLength={INQUIRY_MAX_LENGTH.organization}
        value={values.organization}
        onChange={update('organization')}
        error={errors.organization}
      />

      <FormField
        id="phone"
        name="phone"
        label="연락처"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={INQUIRY_MAX_LENGTH.phone}
        hint="숫자와 하이픈(-)만 입력해 주세요. (예: 010-1234-5678)"
        value={values.phone}
        onChange={update('phone')}
        error={errors.phone}
      />

      <FormField
        id="email"
        name="email"
        label="이메일"
        type="email"
        autoComplete="email"
        maxLength={INQUIRY_MAX_LENGTH.email}
        hint="남겨 주시면 메일로도 답변드립니다. (예: name@example.com)"
        value={values.email}
        onChange={update('email')}
        error={errors.email}
      />

      <FormField
        as="select"
        id="program"
        name="program"
        label="관심 과정"
        options={programOptions}
        value={values.program}
        onChange={update('program')}
        error={errors.program}
      />

      <div>
        <FormField
          as="textarea"
          id="message"
          name="message"
          label="문의 내용"
          required
          rows={6}
          maxLength={INQUIRY_MAX_LENGTH.message}
          hint="교육 대상과 인원, 희망 일정, 예산 등을 알려 주시면 더 정확하게 안내드릴 수 있습니다."
          value={values.message}
          onChange={update('message')}
          error={errors.message}
        />
        <div className="mt-1 text-right text-xs text-ink-soft tabular-nums">
          {values.message.length} / {INQUIRY_MAX_LENGTH.message}
        </div>
      </div>

      {/* 스팸 방지용 honeypot: 사람 눈에는 보이지 않고 봇만 채운다 */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">웹사이트</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={update('website')}
        />
      </div>

      <div aria-live="polite" className="min-h-0">
        {status === 'error' && message ? (
          <p className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/5 px-3.5 py-3 text-sm text-red-600 dark:text-red-400">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="lift-on-hover mt-1 rounded-card bg-accent px-4 py-3.5 font-semibold text-paper shadow-card hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === 'submitting' ? '접수 중…' : '문의 보내기'}
      </button>

      <p className="text-center text-xs leading-relaxed text-ink-soft">
        남겨 주신 정보는 교육 상담 목적으로만 사용하며, 상담이 끝나면 파기합니다.
      </p>
    </form>
  )
}

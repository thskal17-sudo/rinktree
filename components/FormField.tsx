import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

import { Icon } from '@/components/icons'

type FieldBase = {
  id: string
  label: string
  /** 입력 형식 안내 (예: 숫자와 하이픈만) */
  hint?: string
  /** 검증 실패 메시지. 있으면 테두리와 aria-invalid가 함께 바뀐다 */
  error?: string
}

type InputFieldProps = FieldBase & { as?: 'input' } & InputHTMLAttributes<HTMLInputElement>
type TextareaFieldProps = FieldBase & {
  as: 'textarea'
} & TextareaHTMLAttributes<HTMLTextAreaElement>
type SelectFieldProps = FieldBase & {
  as: 'select'
  options: readonly { value: string; label: string }[]
} & SelectHTMLAttributes<HTMLSelectElement>

export type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps

const controlClass =
  'w-full rounded-xl border bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/55 transition-colors focus:border-accent focus-visible:outline-none'

/**
 * 라벨 · 입력 · 안내/오류 메시지를 한 덩어리로 묶은 폼 필드.
 * as 값에 따라 input / textarea / select를 렌더링한다.
 */
export function FormField(props: FormFieldProps) {
  const { id, label, hint, error } = props
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const shared = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    className: `${controlClass} ${error ? 'border-red-500/70' : 'border-line hover:border-line-strong'}`,
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {props.required ? (
          <span className="ml-1 text-accent" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-1 text-xs font-normal text-ink-soft">(선택)</span>
        )}
      </label>

      {renderControl(props, shared)}

      {hint ? (
        <p id={hintId} className="text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
          <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

type SharedControlProps = {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': boolean | undefined
  className: string
}

function renderControl(props: FormFieldProps, shared: SharedControlProps) {
  if (props.as === 'textarea') {
    const { as: _as, id: _id, label: _label, hint: _hint, error: _error, ...rest } = props
    return <textarea {...rest} {...shared} className={`${shared.className} resize-y`} />
  }

  if (props.as === 'select') {
    const { as: _as, id: _id, label: _label, hint: _hint, error: _error, options, ...rest } = props
    return (
      <select {...rest} {...shared}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  const { as: _as, id: _id, label: _label, hint: _hint, error: _error, ...rest } = props
  return <input {...rest} {...shared} />
}

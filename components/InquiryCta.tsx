import Link from 'next/link'

/** 하위 페이지 하단의 교육문의 유도 문구 */
export function InquiryCta({ text = '교육이 필요하신가요?' }: { text?: string }) {
  return (
    <p className="mt-9 text-center text-sm text-ink-soft">
      {text}{' '}
      <Link
        href="/inquiry"
        className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
      >
        교육문의 남기기
      </Link>
    </p>
  )
}

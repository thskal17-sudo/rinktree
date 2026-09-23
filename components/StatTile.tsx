type StatTileProps = {
  value: string
  label: string
}

/** 홈허브 상단의 통계 타일 (예: 240+ / 함께한 기업·기관) */
export function StatTile({ value, label }: StatTileProps) {
  return (
    <div className="rounded-card border border-line bg-surface px-2 py-3 text-center shadow-card">
      <div className="font-serif text-lg font-bold text-accent tabular-nums sm:text-xl">
        {value}
      </div>
      <div className="mt-0.5 text-xs text-ink-soft">{label}</div>
    </div>
  )
}

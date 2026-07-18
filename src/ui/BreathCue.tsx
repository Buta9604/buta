type Cue = 'slow_4_4' | 'deep_hold' | 'quickening' | 'release' | undefined

export function BreathCue({ cue }: { cue: Cue }) {
  if (!cue) return null

  const labels: Record<Exclude<Cue, undefined>, string> = {
    slow_4_4: 'Breathe with me — slow in, slower out',
    deep_hold: 'Deep breath… hold… release',
    quickening: 'Shorter breaths — stay with the edge',
    release: 'Let the breath break with you',
  }

  return (
    <div className={`breath-cue cue-${cue}`} aria-live="polite">
      <div className="breath-ring" />
      <p>{labels[cue]}</p>
    </div>
  )
}

import { useEffect, type CSSProperties } from 'react'
import { partners } from '../content/partners'
import { sessions } from '../content/sessions'
import { applyTokens } from '../engine/tokens'
import { useGameStore } from '../state/gameStore'
import { BreathCue } from './BreathCue'

export function SessionStage() {
  const pc = useGameStore((s) => s.pc)
  const runtime = useGameStore((s) => s.session)
  const advanceSession = useGameStore((s) => s.advanceSession)
  const sessionChoice = useGameStore((s) => s.sessionChoice)
  const goHub = useGameStore((s) => s.goHub)

  const def = runtime ? sessions[runtime.sessionId] : null
  const stage = def && runtime ? def.stages[runtime.stageIndex] : null
  const beat =
    stage && runtime ? stage.beats[runtime.beatIndex] : undefined
  const partner = def ? partners[def.partnerId] : null

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== ' ' && e.key !== 'Enter') return
      if (!runtime || runtime.awaitingChoice || runtime.finished) return
      e.preventDefault()
      advanceSession()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [runtime, advanceSession])

  if (!runtime || !def || !stage || !beat || !partner) {
    return (
      <section className="screen">
        <div className="panel">
          <p>Session missing.</p>
          <button type="button" className="btn primary" onClick={goHub}>
            Back
          </button>
        </div>
      </section>
    )
  }

  const heat = runtime.heat
  const focus = runtime.focus
  const text = applyTokens(beat.text, pc)

  return (
    <section
      className="screen stage session-stage"
      data-emotion={stage.emotion}
      data-stage={stage.id}
      style={
        {
          ['--heat' as string]: String(heat / 100),
          ['--focus' as string]: String(focus / 100),
          ['--accent' as string]: partner.accent,
        } as CSSProperties
      }
    >
      <div className="stage-bg" />
      <div className="heat-veil" />

      {!runtime.finished && (
        <button type="button" className="leave-link" onClick={goHub}>
          End session
        </button>
      )}

      <div className="session-meta">
        <span>{def.title}</span>
        <span>
          {stage.label} · {runtime.stageIndex + 1}/{def.stages.length}
        </span>
      </div>

      <div className="stage-portrait session" data-partner={partner.id}>
        <div className="portrait-glow" />
        <div className="portrait-figure partner large">
          <div className="portrait-eyes" />
        </div>
      </div>

      <BreathCue cue={stage.breathCue} />

      <div className="dialogue session-dialogue">
        <p className="speaker">{partner.name}</p>
        <p className="line">{text}</p>

        {runtime.finished ? (
          <div className="actions">
            <button type="button" className="btn primary" onClick={goHub}>
              Return to hub
            </button>
          </div>
        ) : runtime.awaitingChoice && stage.choice ? (
          <div className="choices">
            <button
              type="button"
              className="btn choice"
              onClick={() => sessionChoice('deepen')}
            >
              {stage.choice.deepen}
            </button>
            <button
              type="button"
              className="btn choice alt"
              onClick={() => sessionChoice('resist')}
            >
              {stage.choice.resist}
            </button>
          </div>
        ) : (
          <button type="button" className="btn primary" onClick={advanceSession}>
            Continue
          </button>
        )}
      </div>

      <div className="session-feel" aria-hidden>
        <div className="feel-bar">
          <span>Focus</span>
          <div className="feel-track">
            <div className="feel-fill focus" style={{ width: `${focus}%` }} />
          </div>
        </div>
        <div className="feel-bar">
          <span>Heat</span>
          <div className="feel-track">
            <div className="feel-fill heat" style={{ width: `${heat}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}

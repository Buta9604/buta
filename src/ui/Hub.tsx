import { useRef, useState } from 'react'
import { partnerList } from '../content/partners'
import { getBondSceneForPartner } from '../content/bondScenes'
import { getSessionsForPartner } from '../content/sessions'
import { canStartSession } from '../engine/conditions'
import { useGameStore } from '../state/gameStore'

export function Hub() {
  const pc = useGameStore((s) => s.pc)
  const bonds = useGameStore((s) => s.bonds)
  const unlockedSessions = useGameStore((s) => s.unlockedSessions)
  const finishedSessions = useGameStore((s) => s.finishedSessions)
  const prefs = useGameStore((s) => s.prefs)
  const startBond = useGameStore((s) => s.startBond)
  const startSession = useGameStore((s) => s.startSession)
  const exportSave = useGameStore((s) => s.exportSave)
  const importSave = useGameStore((s) => s.importSave)
  const resetAll = useGameStore((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [toast, setToast] = useState<string | null>(null)

  function flash(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  function onExport() {
    const blob = new Blob([exportSave()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `buta-save-${pc.name || 'player'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function onImport(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importSave(String(reader.result ?? ''))
      flash(ok ? 'Save imported' : 'Invalid save file')
    }
    reader.readAsText(file)
  }

  return (
    <section className="screen hub">
      <header className="hub-header">
        <div>
          <p className="eyebrow">Night hub</p>
          <h1 className="brand-inline">buta</h1>
          <p className="lede tight">
            Welcome, {pc.name}. Bond first — then let her take you hands-free.
          </p>
        </div>
        <div className="hub-tools">
          <button type="button" className="btn ghost sm" onClick={onExport}>
            Export
          </button>
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => fileRef.current?.click()}
          >
            Import
          </button>
          <button
            type="button"
            className="btn ghost sm danger"
            onClick={() => {
              if (confirm('Reset all progress?')) resetAll()
            }}
          >
            Reset
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImport(f)
              e.target.value = ''
            }}
          />
        </div>
      </header>

      <div className="hub-list">
        {partnerList.map((partner) => {
          const bond = bonds[partner.id] ?? {
            trust: 0,
            attunement: 0,
            control: 0,
            flags: [],
          }
          const bondScene = getBondSceneForPartner(partner.id)
          const partnerSessions = getSessionsForPartner(partner.id)
          const bonded = bond.flags.includes('first_evening_done')

          return (
            <article key={partner.id} className="partner-block">
              <div
                className="partner-portrait"
                data-partner={partner.id}
                style={{ ['--accent' as string]: partner.accent }}
              >
                <div className="portrait-glow" />
                <div className="portrait-figure partner">
                  <div className="portrait-eyes" />
                </div>
              </div>
              <div className="partner-copy">
                <p className="eyebrow">{partner.title}</p>
                <h2>{partner.name}</h2>
                <p>{partner.blurb}</p>
                <div className="meters">
                  <Meter label="Trust" value={bond.trust} />
                  <Meter label="Attunement" value={bond.attunement} />
                  <Meter label="Control" value={bond.control} />
                </div>
                <div className="actions wrap">
                  {bondScene && (
                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => startBond(partner.id, bondScene.id)}
                    >
                      {bonded ? 'Revisit bond' : 'Begin evening'}
                    </button>
                  )}
                  {partnerSessions.map((session) => {
                    const unlocked = unlockedSessions.includes(session.id)
                    const check = canStartSession(session, bond, prefs)
                    const done = finishedSessions.includes(session.id)
                    return (
                      <button
                        key={session.id}
                        type="button"
                        className="btn secondary"
                        disabled={!unlocked || !check.ok}
                        title={
                          !unlocked
                            ? 'Unlock by finishing the bond scene'
                            : check.reason
                        }
                        onClick={() => {
                          const result = startSession(session.id)
                          if (!result.ok) flash(result.reason ?? 'Locked')
                        }}
                      >
                        {done ? 'Replay · ' : ''}
                        {session.title}
                      </button>
                    )
                  })}
                </div>
                {!unlockedSessions.length && (
                  <p className="hint">
                    Finish Aurelia&apos;s evening to unlock Soft Release.
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </section>
  )
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="meter">
      <div className="meter-label">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

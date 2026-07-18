import { useGameStore } from '../state/gameStore'

export function AgeGate() {
  const verifyAge = useGameStore((s) => s.verifyAge)

  return (
    <section className="screen gate">
      <div className="gate-veil" />
      <div className="panel gate-panel">
        <p className="eyebrow">Adults only</p>
        <h1 className="brand">buta</h1>
        <p className="lede">
          Guided erotic roleplay for hands-free climax. All characters are adults
          (18+). By entering you confirm you are 18 or older.
        </p>
        <div className="actions">
          <button type="button" className="btn primary" onClick={verifyAge}>
            I am 18 or older
          </button>
          <a className="btn ghost" href="https://www.google.com">
            Leave
          </a>
        </div>
      </div>
    </section>
  )
}

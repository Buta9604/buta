import { useState } from 'react'
import { useGameStore } from '../state/gameStore'
import type {
  BodyPreset,
  PlayerCharacter,
  PraiseTerm,
  Presentation,
  Sensitivity,
} from '../types'

const bodies: BodyPreset[] = ['soft', 'lean', 'broad', 'curvy']
const presentations: Presentation[] = ['masc', 'femme', 'androgynous']
const praiseTerms: PraiseTerm[] = [
  'good boy',
  'good girl',
  'darling',
  'pet',
  'love',
]
const sensitivities: Sensitivity[] = [
  'praise',
  'ownership',
  'sensory',
  'denial',
  'worship',
]

export function CharacterCreator() {
  const saveCharacter = useGameStore((s) => s.saveCharacter)
  const existing = useGameStore((s) => s.pc)
  const [pc, setPc] = useState<PlayerCharacter>({
    ...existing,
    name: existing.name || '',
  })

  function toggleSensitivity(s: Sensitivity) {
    setPc((prev) => {
      const has = prev.sensitivities.includes(s)
      return {
        ...prev,
        sensitivities: has
          ? prev.sensitivities.filter((x) => x !== s)
          : [...prev.sensitivities, s],
      }
    })
  }

  const canSave = pc.name.trim().length >= 1

  return (
    <section className="screen creator">
      <div className="panel creator-panel">
        <p className="eyebrow">You</p>
        <h2>Create your character</h2>
        <p className="lede">
          Partners will address you by name and shape the session around how you
          like to be spoken to.
        </p>

        <div className="creator-grid">
          <label className="field">
            <span>Name</span>
            <input
              value={pc.name}
              maxLength={24}
              placeholder="What should they call you?"
              onChange={(e) => setPc({ ...pc, name: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Pronouns</span>
            <input
              value={pc.pronouns}
              maxLength={24}
              onChange={(e) => setPc({ ...pc, pronouns: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Body</span>
            <select
              value={pc.body}
              onChange={(e) =>
                setPc({ ...pc, body: e.target.value as BodyPreset })
              }
            >
              {bodies.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Presentation</span>
            <select
              value={pc.presentation}
              onChange={(e) =>
                setPc({
                  ...pc,
                  presentation: e.target.value as Presentation,
                })
              }
            >
              {presentations.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Praise term</span>
            <select
              value={pc.praiseTerm}
              onChange={(e) =>
                setPc({ ...pc, praiseTerm: e.target.value as PraiseTerm })
              }
            >
              {praiseTerms.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="tag-field">
          <legend>What hits harder</legend>
          <div className="tag-row">
            {sensitivities.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip ${pc.sensitivities.includes(s) ? 'on' : ''}`}
                onClick={() => toggleSensitivity(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="portrait-preview" data-presentation={pc.presentation}>
          <div className="portrait-glow" />
          <div className="portrait-figure">
            <div className="portrait-eyes" />
          </div>
          <p className="portrait-caption">
            {pc.name.trim() || 'Unnamed'} · {pc.presentation} · {pc.body}
          </p>
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn primary"
            disabled={!canSave}
            onClick={() => saveCharacter({ ...pc, name: pc.name.trim() })}
          >
            Enter the night
          </button>
        </div>
      </div>
    </section>
  )
}

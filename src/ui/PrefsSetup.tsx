import { useState } from 'react'
import { useGameStore } from '../state/gameStore'
import type { PlayerPrefs } from '../types'

const LIMIT_TAGS = [
  'denial',
  'ownership',
  'degrade_lite',
  'worship',
  'trance',
] as const

export function PrefsSetup() {
  const setPrefs = useGameStore((s) => s.setPrefs)
  const skipPrefs = useGameStore((s) => s.skipPrefs)
  const [intensity, setIntensity] =
    useState<PlayerPrefs['intensity']>('explicit')
  const [hardLimits, setHardLimits] = useState<string[]>([])

  function toggleLimit(tag: string) {
    setHardLimits((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  return (
    <section className="screen prefs">
      <div className="panel">
        <p className="eyebrow">Optional</p>
        <h2>Your limits</h2>
        <p className="lede">
          The game has no built-in content bans. Set personal hard limits if you
          want certain tags hidden.
        </p>

        <label className="field">
          <span>Intensity</span>
          <select
            value={intensity}
            onChange={(e) =>
              setIntensity(e.target.value as PlayerPrefs['intensity'])
            }
          >
            <option value="suggestive">Suggestive</option>
            <option value="explicit">Explicit</option>
          </select>
        </label>

        <fieldset className="tag-field">
          <legend>Hard limits (hide)</legend>
          <div className="tag-row">
            {LIMIT_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`chip ${hardLimits.includes(tag) ? 'on' : ''}`}
                onClick={() => toggleLimit(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="actions">
          <button
            type="button"
            className="btn primary"
            onClick={() =>
              setPrefs({ intensity, softLimits: [], hardLimits })
            }
          >
            Continue
          </button>
          <button type="button" className="btn ghost" onClick={skipPrefs}>
            Skip
          </button>
        </div>
      </div>
    </section>
  )
}

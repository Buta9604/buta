import { useEffect } from 'react'
import { bondScenes } from '../content/bondScenes'
import { partners } from '../content/partners'
import { applyTokens } from '../engine/tokens'
import { useGameStore } from '../state/gameStore'

export function BondScene() {
  const pc = useGameStore((s) => s.pc)
  const sceneId = useGameStore((s) => s.activeBondSceneId)
  const nodeId = useGameStore((s) => s.bondNodeId)
  const chooseBond = useGameStore((s) => s.chooseBond)
  const advanceBond = useGameStore((s) => s.advanceBond)
  const goHub = useGameStore((s) => s.goHub)

  const scene = sceneId ? bondScenes[sceneId] : null
  const node = scene && nodeId ? scene.nodes[nodeId] : null
  const partner = scene ? partners[scene.partnerId] : null

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== ' ' && e.key !== 'Enter') return
      if (node?.choices?.length) return
      e.preventDefault()
      advanceBond()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [node, advanceBond])

  if (!scene || !node || !partner) {
    return (
      <section className="screen">
        <div className="panel">
          <p>Scene missing.</p>
          <button type="button" className="btn primary" onClick={goHub}>
            Back
          </button>
        </div>
      </section>
    )
  }

  const text = applyTokens(node.text, pc)
  const hasChoices = !!node.choices?.length

  return (
    <section className="screen stage bond-stage" data-emotion={node.emotion}>
      <div className="stage-bg" />
      <button type="button" className="leave-link" onClick={goHub}>
        Leave
      </button>

      <div
        className="stage-portrait"
        data-partner={partner.id}
        style={{ ['--accent' as string]: partner.accent }}
      >
        <div className="portrait-glow" />
        <div className="portrait-figure partner large">
          <div className="portrait-eyes" />
        </div>
      </div>

      <div className="dialogue">
        <p className="speaker">{node.speaker}</p>
        <p className="line">{text}</p>
        {hasChoices ? (
          <div className="choices">
            {node.choices!.map((c, i) => (
              <button
                key={c.text}
                type="button"
                className="btn choice"
                onClick={() => chooseBond(i)}
              >
                {applyTokens(c.text, pc)}
              </button>
            ))}
          </div>
        ) : (
          <button type="button" className="btn primary" onClick={advanceBond}>
            {node.next ? 'Continue' : 'Return to hub'}
          </button>
        )}
      </div>
    </section>
  )
}

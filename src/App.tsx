import { useGameStore } from './state/gameStore'
import { AgeGate } from './ui/AgeGate'
import { BondScene } from './ui/BondScene'
import { CharacterCreator } from './ui/CharacterCreator'
import { Hub } from './ui/Hub'
import { PrefsSetup } from './ui/PrefsSetup'
import { SessionStage } from './ui/SessionStage'

export default function App() {
  const screen = useGameStore((s) => s.screen)

  return (
    <div className="app-shell" data-screen={screen}>
      {screen === 'ageGate' && <AgeGate />}
      {screen === 'prefs' && <PrefsSetup />}
      {screen === 'creator' && <CharacterCreator />}
      {screen === 'hub' && <Hub />}
      {screen === 'bond' && <BondScene />}
      {screen === 'session' && <SessionStage />}
    </div>
  )
}

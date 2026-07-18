export type Screen =
  | 'ageGate'
  | 'prefs'
  | 'creator'
  | 'hub'
  | 'bond'
  | 'session'

export type PraiseTerm = 'good boy' | 'good girl' | 'darling' | 'pet' | 'love'

export type BodyPreset = 'soft' | 'lean' | 'broad' | 'curvy'
export type Presentation = 'masc' | 'femme' | 'androgynous'

export type Sensitivity =
  | 'praise'
  | 'ownership'
  | 'sensory'
  | 'denial'
  | 'worship'

export interface PlayerCharacter {
  name: string
  pronouns: string
  body: BodyPreset
  presentation: Presentation
  praiseTerm: PraiseTerm
  sensitivities: Sensitivity[]
}

export interface PlayerPrefs {
  intensity: 'suggestive' | 'explicit'
  softLimits: string[]
  hardLimits: string[]
}

export interface PartnerBond {
  trust: number
  attunement: number
  control: number
  flags: string[]
}

export interface SessionRuntime {
  sessionId: string
  stageIndex: number
  beatIndex: number
  focus: number
  heat: number
  edgeCount: number
  finished: boolean
  startedAt: number
  awaitingChoice: boolean
}

export type EffectMap = Partial<{
  trust: number
  attunement: number
  control: number
  focus: number
  heat: number
  edge: number
  flags: string[]
}>

export interface DialogueChoice {
  text: string
  next: string
  effects?: EffectMap
  requires?: {
    minTrust?: number
    minControl?: number
    flags?: string[]
  }
}

export interface DialogueNode {
  speaker: string
  text: string
  emotion?: 'soft' | 'warm' | 'dominant' | 'intense' | 'aftercare'
  choices?: DialogueChoice[]
  next?: string
  effects?: EffectMap
}

export interface BondScene {
  id: string
  partnerId: string
  title: string
  nodes: Record<string, DialogueNode>
  start: string
}

export interface SessionBeat {
  text: string
  effects?: EffectMap
}

export interface SessionStage {
  id: string
  label: string
  breathCue?: 'slow_4_4' | 'deep_hold' | 'quickening' | 'release'
  emotion?: 'soft' | 'warm' | 'dominant' | 'intense' | 'aftercare'
  beats: SessionBeat[]
  choice?: {
    deepen: string
    resist: string
  }
}

export interface HfoSession {
  id: string
  partnerId: string
  title: string
  subtitle: string
  tags: string[]
  requires: {
    trust?: number
    control?: number
    flags?: string[]
  }
  stages: SessionStage[]
}

export interface Partner {
  id: string
  name: string
  title: string
  blurb: string
  style: 'soft' | 'sharp'
  accent: string
}

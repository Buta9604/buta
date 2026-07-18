import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { bondScenes } from '../content/bondScenes'
import { canStartSession, clampStat } from '../engine/conditions'
import { sessions } from '../content/sessions'
import type {
  EffectMap,
  PartnerBond,
  PlayerCharacter,
  PlayerPrefs,
  Screen,
  SessionRuntime,
} from '../types'

const defaultPc: PlayerCharacter = {
  name: '',
  pronouns: 'they/them',
  body: 'soft',
  presentation: 'androgynous',
  praiseTerm: 'darling',
  sensitivities: ['praise', 'sensory'],
}

const defaultPrefs: PlayerPrefs = {
  intensity: 'explicit',
  softLimits: [],
  hardLimits: [],
}

const emptyBond = (): PartnerBond => ({
  trust: 0,
  attunement: 0,
  control: 0,
  flags: [],
})

function applyBondEffects(bond: PartnerBond, effects?: EffectMap): PartnerBond {
  if (!effects) return bond
  const next = { ...bond, flags: [...bond.flags] }
  if (effects.trust) next.trust = clampStat(next.trust + effects.trust)
  if (effects.attunement)
    next.attunement = clampStat(next.attunement + effects.attunement)
  if (effects.control) next.control = clampStat(next.control + effects.control)
  for (const f of effects.flags ?? []) {
    if (!next.flags.includes(f)) next.flags.push(f)
  }
  return next
}

function applySessionEffects(
  runtime: SessionRuntime,
  effects?: EffectMap,
): SessionRuntime {
  if (!effects) return runtime
  const next = { ...runtime }
  if (effects.focus) next.focus = clampStat(next.focus + effects.focus)
  if (effects.heat) next.heat = clampStat(next.heat + effects.heat)
  if (effects.edge) next.edgeCount += effects.edge
  return next
}

interface GameState {
  ageVerified: boolean
  prefsDone: boolean
  creatorDone: boolean
  screen: Screen
  prefs: PlayerPrefs
  pc: PlayerCharacter
  bonds: Record<string, PartnerBond>
  unlockedSessions: string[]
  finishedSessions: string[]
  activePartnerId: string | null
  activeBondSceneId: string | null
  bondNodeId: string | null
  session: SessionRuntime | null

  verifyAge: () => void
  setPrefs: (prefs: PlayerPrefs) => void
  skipPrefs: () => void
  saveCharacter: (pc: PlayerCharacter) => void
  goHub: () => void
  startBond: (partnerId: string, sceneId: string) => void
  chooseBond: (choiceIndex: number) => void
  advanceBond: () => void
  startSession: (sessionId: string) => { ok: boolean; reason?: string }
  advanceSession: () => void
  sessionChoice: (kind: 'deepen' | 'resist') => void
  exportSave: () => string
  importSave: (raw: string) => boolean
  resetAll: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ageVerified: false,
      prefsDone: false,
      creatorDone: false,
      screen: 'ageGate',
      prefs: defaultPrefs,
      pc: defaultPc,
      bonds: {},
      unlockedSessions: [],
      finishedSessions: [],
      activePartnerId: null,
      activeBondSceneId: null,
      bondNodeId: null,
      session: null,

      verifyAge: () => set({ ageVerified: true, screen: 'prefs' }),

      setPrefs: (prefs) => set({ prefs, prefsDone: true, screen: 'creator' }),

      skipPrefs: () =>
        set({ prefsDone: true, screen: 'creator', prefs: defaultPrefs }),

      saveCharacter: (pc) =>
        set({
          pc,
          creatorDone: true,
          screen: 'hub',
        }),

      goHub: () =>
        set({
          screen: 'hub',
          session: null,
          activeBondSceneId: null,
          bondNodeId: null,
        }),

      startBond: (partnerId, sceneId) => {
        const scene = bondScenes[sceneId]
        if (!scene) return
        set({
          screen: 'bond',
          activePartnerId: partnerId,
          activeBondSceneId: sceneId,
          bondNodeId: scene.start,
          bonds: {
            ...get().bonds,
            [partnerId]: get().bonds[partnerId] ?? emptyBond(),
          },
        })
      },

      chooseBond: (choiceIndex) => {
        const { activeBondSceneId, bondNodeId, activePartnerId, bonds } = get()
        if (!activeBondSceneId || !bondNodeId || !activePartnerId) return
        const scene = bondScenes[activeBondSceneId]
        const node = scene?.nodes[bondNodeId]
        const choice = node?.choices?.[choiceIndex]
        if (!choice) return

        const bond = applyBondEffects(
          bonds[activePartnerId] ?? emptyBond(),
          choice.effects,
        )

        set({
          bonds: { ...bonds, [activePartnerId]: bond },
          bondNodeId: choice.next,
        })
      },

      advanceBond: () => {
        const { activeBondSceneId, bondNodeId, activePartnerId, bonds } = get()
        if (!activeBondSceneId || !bondNodeId || !activePartnerId) return
        const scene = bondScenes[activeBondSceneId]
        const node = scene?.nodes[bondNodeId]
        if (!node) return

        let bond = bonds[activePartnerId] ?? emptyBond()
        bond = applyBondEffects(bond, node.effects)

        if (node.next) {
          set({
            bonds: { ...bonds, [activePartnerId]: bond },
            bondNodeId: node.next,
          })
          return
        }

        if (!node.choices?.length) {
          const unlocked = new Set(get().unlockedSessions)
          if (bond.flags.includes('ready_for_session')) {
            unlocked.add('aurelia_soft_release')
          }
          set({
            bonds: { ...bonds, [activePartnerId]: bond },
            unlockedSessions: [...unlocked],
            screen: 'hub',
            activeBondSceneId: null,
            bondNodeId: null,
          })
        }
      },

      startSession: (sessionId) => {
        const session = sessions[sessionId]
        if (!session) return { ok: false, reason: 'Unknown session' }
        const bond = get().bonds[session.partnerId] ?? emptyBond()
        const check = canStartSession(session, bond, get().prefs)
        if (!check.ok) return check

        set({
          screen: 'session',
          activePartnerId: session.partnerId,
          session: {
            sessionId,
            stageIndex: 0,
            beatIndex: 0,
            focus: 5,
            heat: 5,
            edgeCount: 0,
            finished: false,
            startedAt: Date.now(),
            awaitingChoice: false,
          },
        })
        return { ok: true }
      },

      advanceSession: () => {
        const runtime = get().session
        if (!runtime || runtime.finished || runtime.awaitingChoice) return
        const def = sessions[runtime.sessionId]
        if (!def) return

        const stage = def.stages[runtime.stageIndex]
        if (!stage) return

        const beat = stage.beats[runtime.beatIndex]
        const withEffects = applySessionEffects(runtime, beat?.effects)

        if (runtime.beatIndex < stage.beats.length - 1) {
          set({
            session: {
              ...withEffects,
              beatIndex: runtime.beatIndex + 1,
            },
          })
          return
        }

        // Last beat of stage
        if (stage.choice) {
          set({ session: { ...withEffects, awaitingChoice: true } })
          return
        }

        if (runtime.stageIndex >= def.stages.length - 1) {
          const partnerId = def.partnerId
          const bond = applyBondEffects(get().bonds[partnerId] ?? emptyBond(), {
            trust: 4,
            attunement: 6,
            control: 5,
            flags: ['finished_for_them'],
          })
          set({
            session: {
              ...withEffects,
              finished: true,
              heat: Math.max(withEffects.heat, 95),
            },
            finishedSessions: Array.from(
              new Set([...get().finishedSessions, runtime.sessionId]),
            ),
            bonds: { ...get().bonds, [partnerId]: bond },
          })
          return
        }

        set({
          session: {
            ...withEffects,
            stageIndex: runtime.stageIndex + 1,
            beatIndex: 0,
            awaitingChoice: false,
          },
        })
      },

      sessionChoice: (kind) => {
        const runtime = get().session
        if (!runtime?.awaitingChoice) return
        const def = sessions[runtime.sessionId]
        if (!def) return

        const effects: EffectMap =
          kind === 'deepen'
            ? { focus: 8, heat: 10 }
            : { focus: 4, heat: 6, edge: 1 }

        if (kind === 'deepen') {
          const bond = applyBondEffects(
            get().bonds[def.partnerId] ?? emptyBond(),
            { control: 2, attunement: 2 },
          )
          set({ bonds: { ...get().bonds, [def.partnerId]: bond } })
        }

        const nextRuntime = applySessionEffects(runtime, effects)

        if (runtime.stageIndex >= def.stages.length - 1) {
          set({
            session: {
              ...nextRuntime,
              awaitingChoice: false,
              finished: true,
            },
          })
          return
        }

        set({
          session: {
            ...nextRuntime,
            stageIndex: runtime.stageIndex + 1,
            beatIndex: 0,
            awaitingChoice: false,
          },
        })
      },

      exportSave: () => {
        const {
          ageVerified,
          prefsDone,
          creatorDone,
          prefs,
          pc,
          bonds,
          unlockedSessions,
          finishedSessions,
        } = get()
        return JSON.stringify(
          {
            v: 1,
            ageVerified,
            prefsDone,
            creatorDone,
            prefs,
            pc,
            bonds,
            unlockedSessions,
            finishedSessions,
          },
          null,
          2,
        )
      },

      importSave: (raw) => {
        try {
          const data = JSON.parse(raw) as {
            v?: number
            ageVerified?: boolean
            prefsDone?: boolean
            creatorDone?: boolean
            prefs?: PlayerPrefs
            pc?: PlayerCharacter
            bonds?: Record<string, PartnerBond>
            unlockedSessions?: string[]
            finishedSessions?: string[]
          }
          if (!data || data.v !== 1) return false
          set({
            ageVerified: !!data.ageVerified,
            prefsDone: !!data.prefsDone,
            creatorDone: !!data.creatorDone,
            prefs: data.prefs ?? defaultPrefs,
            pc: data.pc ?? defaultPc,
            bonds: data.bonds ?? {},
            unlockedSessions: data.unlockedSessions ?? [],
            finishedSessions: data.finishedSessions ?? [],
            screen: data.creatorDone
              ? 'hub'
              : data.prefsDone
                ? 'creator'
                : data.ageVerified
                  ? 'prefs'
                  : 'ageGate',
            session: null,
            activeBondSceneId: null,
            bondNodeId: null,
          })
          return true
        } catch {
          return false
        }
      },

      resetAll: () =>
        set({
          ageVerified: false,
          prefsDone: false,
          creatorDone: false,
          screen: 'ageGate',
          prefs: defaultPrefs,
          pc: defaultPc,
          bonds: {},
          unlockedSessions: [],
          finishedSessions: [],
          activePartnerId: null,
          activeBondSceneId: null,
          bondNodeId: null,
          session: null,
        }),
    }),
    {
      name: 'buta-hfo-save',
      partialize: (s) => ({
        ageVerified: s.ageVerified,
        prefsDone: s.prefsDone,
        creatorDone: s.creatorDone,
        prefs: s.prefs,
        pc: s.pc,
        bonds: s.bonds,
        unlockedSessions: s.unlockedSessions,
        finishedSessions: s.finishedSessions,
        screen:
          s.screen === 'session' || s.screen === 'bond'
            ? 'hub'
            : s.creatorDone
              ? s.screen === 'ageGate' ||
                s.screen === 'prefs' ||
                s.screen === 'creator'
                ? 'hub'
                : s.screen
              : s.screen,
      }),
    },
  ),
)

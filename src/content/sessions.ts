import type { HfoSession } from '../types'

export const sessions: Record<string, HfoSession> = {
  aurelia_soft_release: {
    id: 'aurelia_soft_release',
    partnerId: 'aurelia',
    title: 'Soft Release',
    subtitle: 'Breathing sync · praise · hands-free climax',
    tags: ['hfo', 'trance', 'praise', 'aftercare'],
    requires: {
      trust: 8,
      flags: ['ready_for_session'],
    },
    stages: [
      {
        id: 'contract',
        label: 'Contract',
        emotion: 'dominant',
        beats: [
          {
            text: 'Before we start: hands away from yourself. No stroking. No cheating the edge with fingers.',
          },
          {
            text: 'You finish because my voice, my pacing, and your focus take you there. Say it in your head — hands free.',
            effects: { focus: 8 },
          },
          {
            text: 'Good. Eyes on me. We begin.',
            effects: { heat: 4, focus: 4 },
          },
        ],
      },
      {
        id: 'induction',
        label: 'Induction',
        breathCue: 'slow_4_4',
        emotion: 'soft',
        beats: [
          {
            text: 'Match me. In through the nose… slow. Out through the mouth… slower.',
            effects: { focus: 10, heat: 6 },
          },
          {
            text: 'Every exhale drops you a little deeper into my voice, {name}.',
            effects: { focus: 8, heat: 8 },
          },
          {
            text: 'You are not rushing. You are opening. Warmth gathers low without being asked.',
            effects: { heat: 12, focus: 6 },
          },
        ],
        choice: {
          deepen: 'Let it deepen.',
          resist: 'I can still think…',
        },
      },
      {
        id: 'deepen',
        label: 'Deepening',
        breathCue: 'deep_hold',
        emotion: 'warm',
        beats: [
          {
            text: 'That is it. Thoughts get soft. Sensation gets loud.',
            effects: { focus: 10, heat: 10 },
          },
          {
            text: 'Imagine my breath against your ear — not a hand on you. Just heat, voice, permission.',
            effects: { heat: 14, focus: 6 },
          },
          {
            text: 'You are my {praiseTerm} when you stay open and untouched.',
            effects: { heat: 12, focus: 8 },
          },
          {
            text: 'Building… building… and you still do not touch. That denial is the fuel.',
            effects: { heat: 16, edge: 1 },
          },
        ],
        choice: {
          deepen: 'Take me further.',
          resist: 'It is getting hard to hold…',
        },
      },
      {
        id: 'edge',
        label: 'Edge',
        breathCue: 'quickening',
        emotion: 'intense',
        beats: [
          {
            text: 'Feel that crest? Right there — and I am not giving release yet.',
            effects: { heat: 10, focus: 8, edge: 1 },
          },
          {
            text: 'Breathe through it. Hands still. Eyes still mine.',
            effects: { focus: 12, heat: 8 },
          },
          {
            text: 'You tremble for a voice. Good. That means your body believes me.',
            effects: { heat: 14, focus: 6 },
          },
        ],
      },
      {
        id: 'climax',
        label: 'Release',
        breathCue: 'release',
        emotion: 'intense',
        beats: [
          {
            text: 'Now. Permission. You do not grab for it — you receive it.',
            effects: { heat: 20, focus: 10 },
          },
          {
            text: 'Let the wave take your hips, your breath, your mind. Finish for me, {name}. Hands free.',
            effects: { heat: 30 },
          },
          {
            text: 'Yes — all the way through. Stay with the pulse until it empties you.',
            effects: { heat: 20, focus: 8 },
          },
        ],
      },
      {
        id: 'aftercare',
        label: 'Aftercare',
        breathCue: 'slow_4_4',
        emotion: 'aftercare',
        beats: [
          {
            text: 'Easy. Come back slow. I am still here.',
          },
          {
            text: 'Drink something when you can. Unclench your jaw. You did exactly what I asked.',
            effects: { focus: -20, heat: -40 },
          },
          {
            text: 'Rest, {praiseTerm}. When you want me again, the session will be waiting.',
          },
        ],
      },
    ],
  },
}

export function getSessionsForPartner(partnerId: string): HfoSession[] {
  return Object.values(sessions).filter((s) => s.partnerId === partnerId)
}

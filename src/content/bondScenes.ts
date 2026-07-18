import type { BondScene } from '../types'

export const bondScenes: Record<string, BondScene> = {
  aurelia_first_evening: {
    id: 'aurelia_first_evening',
    partnerId: 'aurelia',
    title: 'Low light',
    start: 'door',
    nodes: {
      door: {
        speaker: 'Aurelia',
        emotion: 'soft',
        text: 'You came. Good. Leave the day outside — in here, you only have to listen.',
        choices: [
          {
            text: 'I came because I wanted this.',
            next: 'wanted',
            effects: { trust: 4, attunement: 2 },
          },
          {
            text: "I'm nervous… but I'm here.",
            next: 'nervous',
            effects: { trust: 6, attunement: 3 },
          },
        ],
      },
      wanted: {
        speaker: 'Aurelia',
        emotion: 'warm',
        text: 'Wanting is honest. Sit with me. Closer than polite. I want your breath where I can feel it.',
        choices: [
          {
            text: 'Move closer.',
            next: 'close',
            effects: { control: 3, attunement: 4, trust: 2 },
          },
        ],
      },
      nervous: {
        speaker: 'Aurelia',
        emotion: 'soft',
        text: 'Nervous means your body already knows something is about to change. That is not a problem. That is an opening.',
        choices: [
          {
            text: 'Help me open.',
            next: 'close',
            effects: { trust: 4, control: 4, attunement: 5 },
          },
        ],
      },
      close: {
        speaker: 'Aurelia',
        emotion: 'warm',
        text: 'There. Eyes on mine. Not on your hands. Your hands stay soft and useless for what comes next — that is the point.',
        choices: [
          {
            text: "I'll keep my hands away.",
            next: 'contract_hint',
            effects: { control: 6, flags: ['hands_promise'] },
          },
          {
            text: 'That sounds impossible.',
            next: 'impossible',
            effects: { attunement: 3, trust: 2 },
          },
        ],
      },
      impossible: {
        speaker: 'Aurelia',
        emotion: 'dominant',
        text: 'It only feels impossible when you try alone. With me, you do not try — you follow. Can you follow?',
        choices: [
          {
            text: 'Yes. I can follow.',
            next: 'contract_hint',
            effects: { control: 8, trust: 3, flags: ['hands_promise'] },
          },
        ],
      },
      contract_hint: {
        speaker: 'Aurelia',
        emotion: 'intense',
        text: 'Then we have a beginning. When you are ready, I will take you into a session — guided, hands-free, all the way through. You finish because my voice carries you there.',
        choices: [
          {
            text: 'I want that.',
            next: 'end',
            effects: {
              trust: 5,
              control: 5,
              attunement: 4,
              flags: ['ready_for_session', 'first_evening_done'],
            },
          },
          {
            text: 'Stay with me a little longer first.',
            next: 'linger',
            effects: { trust: 7, attunement: 6, flags: ['ready_for_session'] },
          },
        ],
      },
      linger: {
        speaker: 'Aurelia',
        emotion: 'aftercare',
        text: 'Mm. Soft for a moment, then. Your pulse under my attention… good. When you return to the hub, start the session. I will be waiting inside it.',
        next: 'end',
        effects: { flags: ['first_evening_done'] },
      },
      end: {
        speaker: 'Aurelia',
        emotion: 'warm',
        text: 'Go on. When you begin, hands away — eyes on me.',
      },
    },
  },
}

export function getBondSceneForPartner(partnerId: string): BondScene | undefined {
  return Object.values(bondScenes).find((s) => s.partnerId === partnerId)
}

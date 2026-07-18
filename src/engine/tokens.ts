import type { PlayerCharacter } from '../types'

export function applyTokens(text: string, pc: PlayerCharacter): string {
  return text
    .replaceAll('{name}', pc.name || 'love')
    .replaceAll('{praiseTerm}', pc.praiseTerm)
    .replaceAll('{pronouns}', pc.pronouns)
}

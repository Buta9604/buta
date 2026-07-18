import type { HfoSession, PartnerBond, PlayerPrefs } from '../types'

export function canStartSession(
  session: HfoSession,
  bond: PartnerBond,
  prefs: PlayerPrefs,
): { ok: boolean; reason?: string } {
  if (session.requires.trust != null && bond.trust < session.requires.trust) {
    return { ok: false, reason: `Need Trust ${session.requires.trust}` }
  }
  if (
    session.requires.control != null &&
    bond.control < session.requires.control
  ) {
    return { ok: false, reason: `Need Control ${session.requires.control}` }
  }
  for (const flag of session.requires.flags ?? []) {
    if (!bond.flags.includes(flag)) {
      return { ok: false, reason: 'Finish the bond scene first' }
    }
  }
  for (const tag of session.tags) {
    if (prefs.hardLimits.includes(tag)) {
      return { ok: false, reason: `Blocked by your limit: ${tag}` }
    }
  }
  return { ok: true }
}

export function clampStat(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n))
}

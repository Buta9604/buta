import type { Partner } from '../types'

export const partners: Record<string, Partner> = {
  aurelia: {
    id: 'aurelia',
    name: 'Aurelia',
    title: 'Soft overwhelm',
    blurb:
      'Warm voice. Slow breathing. She praises you until finishing feels inevitable.',
    style: 'soft',
    accent: '#c4786a',
  },
}

export const partnerList = Object.values(partners)

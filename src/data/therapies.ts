import type { Sponsor } from '../components/SponsorSlot'

/**
 * Allied health and therapy options. These are SUPPORTS, shown alongside (and
 * usually before) any medication discussion. Each can carry a dormant sponsor.
 * Evidence framing is honest and plain-English. Not medical advice.
 */
export type TherapyEvidence = 'strong' | 'moderate' | 'emerging' | 'mixed' | 'individual'

export interface Therapy {
  id: string
  name: string
  discipline: string
  helpsWith: string[]
  plainEnglish: string
  evidence: TherapyEvidence
  evidenceNote: string
  ndisCategory: string
  sponsor?: Sponsor // dormant — none yet
}

export const therapies: Therapy[] = [
  {
    id: 'ot',
    name: 'Occupational Therapy',
    discipline: 'Allied health',
    helpsWith: ['sensory needs', 'daily living skills', 'routines', 'fine motor', 'sleep routine'],
    plainEnglish: 'Helps with sensory needs, everyday skills, and setting up the environment and routines.',
    evidence: 'moderate',
    evidenceNote: 'Good support for daily function and sensory strategies; outcomes are individual.',
    ndisCategory: 'Improved Daily Living (Capacity Building)',
  },
  {
    id: 'speech',
    name: 'Speech Pathology',
    discipline: 'Allied health',
    helpsWith: ['communication', 'AAC / visual supports', 'choice making', 'swallowing'],
    plainEnglish: 'Helps with communication, visual supports, and sometimes eating and swallowing.',
    evidence: 'moderate',
    evidenceNote: 'Communication support is well established; approach is tailored to the person.',
    ndisCategory: 'Improved Daily Living',
  },
  {
    id: 'psychology',
    name: 'Psychology',
    discipline: 'Allied health',
    helpsWith: ['anxiety', 'emotional regulation', 'trauma', 'coping skills'],
    plainEnglish: 'Helps with anxiety, big feelings, and coping, using autism-friendly approaches.',
    evidence: 'moderate',
    evidenceNote: 'Adapted CBT and regulation work help anxiety for many; needs an autism-aware clinician.',
    ndisCategory: 'Improved Daily Living',
  },
  {
    id: 'pbs',
    name: 'Positive Behaviour Support',
    discipline: 'Behaviour support',
    helpsWith: ['behaviour triggers', 'replacement skills', 'restrictive-practice reduction'],
    plainEnglish: 'Looks at why behaviour happens and builds proactive, respectful strategies.',
    evidence: 'moderate',
    evidenceNote: 'Function-based, proactive support is the recommended first line for behaviour.',
    ndisCategory: 'Improved Relationships',
  },
  {
    id: 'physio',
    name: 'Physiotherapy',
    discipline: 'Allied health',
    helpsWith: ['movement', 'strength', 'coordination', 'motor planning'],
    plainEnglish: 'Helps with movement, strength and coordination.',
    evidence: 'individual',
    evidenceNote: 'Useful where there are motor or mobility needs; outcomes are individual.',
    ndisCategory: 'Improved Daily Living',
  },
  {
    id: 'dietitian',
    name: 'Dietitian',
    discipline: 'Allied health',
    helpsWith: ['selective eating', 'weight', 'fibre & bowels', 'medication appetite effects'],
    plainEnglish: 'Helps with fussy eating, weight, and bowel comfort — useful with appetite-raising medicines.',
    evidence: 'moderate',
    evidenceNote: 'Practical support for eating, growth and constipation.',
    ndisCategory: 'Improved Daily Living',
  },
  {
    id: 'exercise-physiology',
    name: 'Exercise Physiology',
    discipline: 'Allied health',
    helpsWith: ['energy', 'sleep', 'mood', 'weight', 'regulation'],
    plainEnglish: 'Builds a movement plan that can help sleep, mood, weight and regulation.',
    evidence: 'emerging',
    evidenceNote: 'Regular exercise can help sleep, mood and behaviour for many.',
    ndisCategory: 'Improved Health & Wellbeing',
  },
  {
    id: 'music-therapy',
    name: 'Music Therapy',
    discipline: 'Allied health',
    helpsWith: ['connection', 'communication', 'regulation', 'expression'],
    plainEnglish: 'Uses music to support connection, communication and calm.',
    evidence: 'mixed',
    evidenceNote: 'Some studies show social/communication benefits; evidence is mixed but low-risk.',
    ndisCategory: 'Improved Daily Living',
  },
  {
    id: 'early-intervention',
    name: 'Early Intervention (developmental)',
    discipline: 'Developmental',
    helpsWith: ['communication', 'play', 'social', 'daily skills'],
    plainEnglish: 'Naturalistic, child-led developmental support in the early years.',
    evidence: 'moderate',
    evidenceNote: 'Naturalistic developmental approaches have growing support. Choose respectful, neurodiversity-affirming providers.',
    ndisCategory: 'Early Childhood',
  },
  {
    id: 'counselling',
    name: 'Counselling / Social Work',
    discipline: 'Allied health',
    helpsWith: ['family support', 'stress', 'navigating services', 'wellbeing'],
    plainEnglish: 'Supports the whole family with stress, services and wellbeing.',
    evidence: 'individual',
    evidenceNote: 'Family support reduces strain and helps everyone cope.',
    ndisCategory: 'Improved Daily Living',
  },
]

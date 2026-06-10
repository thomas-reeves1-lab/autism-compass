import type { Sponsor } from '../components/SponsorSlot'
import type { EffectModelEntry } from '../lib/types'

/**
 * Allied health and therapy options. These are SUPPORTS, shown alongside (and
 * usually before) any medication. They are TOGGLEABLE into the model and gently
 * change the behaviour scores — always labelled as estimated/individual, never
 * presented as guaranteed. Each can carry a dormant sponsor.
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
  effects: EffectModelEntry[]
  sponsor?: Sponsor // dormant — none yet
}

const est = (metric: EffectModelEntry['metric'], maxEffect: number, reason: string): EffectModelEntry => ({
  metric,
  maxEffect,
  label: 'estimated',
  uncertainty: 0.5,
  reason,
})

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
    effects: [
      est('hyperactivity', -0.12, 'Sensory strategies and routines can help a body settle.'),
      est('irritability', -0.1, 'Predictable routines and sensory support can lower distress.'),
      est('sleepOnsetDelay', -0.1, 'A good sleep routine often helps sleep onset.'),
    ],
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
    effects: [
      est('irritability', -0.14, 'Less communication frustration can lower how fast someone gets upset.'),
      est('looping', -0.1, 'Being understood can reduce stuck, repeated demands.'),
      est('aggressionRisk', -0.08, 'Communication support can reduce frustration-driven behaviour.'),
    ],
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
    effects: [
      est('irritability', -0.12, 'Anxiety and regulation work can lower how fast someone gets upset.'),
      est('looping', -0.1, 'Coping skills can ease anxious looping.'),
    ],
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
    effects: [
      est('aggressionRisk', -0.16, 'Function-based plans target the reasons behind aggression.'),
      est('selfInjuryRisk', -0.12, 'Proactive strategies can reduce self-injury over time.'),
      est('irritability', -0.1, 'Fewer triggers can mean less frequent upset.'),
    ],
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
    effects: [est('hyperactivity', -0.06, 'Movement work can help some bodies settle.')],
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
    effects: [
      est('foodSeeking', -0.15, 'A food plan can ease appetite pressure and food seeking.'),
      est('gutUpset', -0.15, 'Fibre and fluid planning can improve bowel comfort.'),
    ],
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
    effects: [
      est('sleepOnsetDelay', -0.14, 'Regular movement can help sleep onset.'),
      est('hyperactivity', -0.12, 'Planned activity can use up restless energy.'),
      est('irritability', -0.08, 'Exercise can lift mood and lower irritability.'),
    ],
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
    effects: [
      est('irritability', -0.08, 'Music can be calming and regulating for some.'),
      est('stereotypy', -0.05, 'Engagement may reduce repetitive behaviour for some.'),
    ],
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
    effects: [
      est('looping', -0.08, 'Communication and play skills can ease stuck patterns.'),
      est('irritability', -0.08, 'More skills can mean less frustration.'),
    ],
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
    effects: [est('irritability', -0.06, 'A calmer, supported home can ease everyone, including the person.')],
  },
]

export const therapyById = (id: string) => therapies.find((t) => t.id === id)

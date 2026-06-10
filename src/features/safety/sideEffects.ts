import type { TrafficLight } from '../../lib/safety'

export interface SideEffectRow {
  key: string
  name: string
  familySigns: string
  track: string
  urgency: TrafficLight
  doctorQuestion: string
}

/** Risperidone side-effect risk matrix A-O (master prompt MEDICATION SAFETY TAB). */
export const sideEffectMatrix: SideEffectRow[] = [
  { key: 'A', name: 'Weight gain and appetite increase', familySigns: 'always hungry, food seeking, sneaking food, fast weight gain, clothes tighter', track: 'weight, appetite pressure, food-seeking episodes, activity', urgency: 'yellow', doctorQuestion: 'Are weight, BMI, blood sugar, cholesterol and appetite being monitored?' },
  { key: 'B', name: 'Blood sugar and diabetes risk', familySigns: 'very thirsty, weeing more, tired, blurry vision, sudden weight change, infections', track: 'symptoms, fasting glucose and HbA1c (with doctor)', urgency: 'orange', doctorQuestion: 'When are fasting glucose and HbA1c being checked?' },
  { key: 'C', name: 'Cholesterol and triglyceride risk', familySigns: 'usually invisible', track: 'blood tests only', urgency: 'yellow', doctorQuestion: 'Are lipids being checked at baseline and follow-up?' },
  { key: 'D', name: 'Sedation / too sleepy', familySigns: 'sleeping in the day, slower movement, less engaged, hard to wake, falls risk', track: 'daytime sleepiness, naps, falls, engagement', urgency: 'yellow', doctorQuestion: 'Could dose timing, total dose, or another medicine be contributing?' },
  { key: 'E', name: 'Movement side effects', familySigns: 'tremor, stiffness, restlessness, pacing, abnormal face/tongue or jaw movement, slow movement', track: 'new movements, pacing, stiffness, swallowing, restlessness', urgency: 'orange', doctorQuestion: 'Should we screen for extrapyramidal effects, akathisia, dystonia or tardive dyskinesia?' },
  { key: 'F', name: 'Prolactin / hormone effects', familySigns: 'breast tenderness/swelling, milk leakage, menstrual changes, low energy, mood change', track: 'physical changes, puberty/menstrual pattern, fatigue', urgency: 'yellow', doctorQuestion: 'Should prolactin be checked?' },
  { key: 'G', name: 'Drooling', familySigns: 'more saliva, wet shirts, coughing with saliva, skin irritation around mouth', track: 'drooling, coughing, swallowing safety', urgency: 'yellow', doctorQuestion: 'Could this be medication related and does swallowing need review?' },
  { key: 'H', name: 'Constipation and gut slowing', familySigns: 'fewer bowel motions, hard stools, stomach pain, more behaviour before a motion, food refusal, bloating', track: 'bowel chart, pain signs, behaviour around toileting', urgency: 'yellow', doctorQuestion: 'Could constipation be increasing behaviour distress?' },
  { key: 'I', name: 'Dizziness / low blood pressure', familySigns: 'dizzy on standing, fainting, unsteady, falls, pale or clammy', track: 'falls, dizzy episodes, blood pressure if asked', urgency: 'orange', doctorQuestion: 'Could a medicine be lowering blood pressure?' },
  { key: 'J', name: 'Heart rhythm / QT caution', familySigns: 'fainting, chest pain, racing heart, unexplained collapse', track: 'symptoms', urgency: 'red', doctorQuestion: 'Is an ECG needed because of dose, family history, other medicines or symptoms?' },
  { key: 'K', name: 'Seizure threshold caution', familySigns: 'seizure, staring episodes, sudden collapse, new abnormal episodes', track: 'any new episodes', urgency: 'red', doctorQuestion: 'Does this person have seizure risk or medicines that change seizure threshold?' },
  { key: 'L', name: 'Heat and temperature regulation', familySigns: 'overheating, poor sweating, heat distress, confusion in hot weather', track: 'heat exposure, hydration, temperature', urgency: 'orange', doctorQuestion: 'Are there heat-safety risks with this medication?' },
  { key: 'M', name: 'Neuroleptic Malignant Syndrome (rare, serious)', familySigns: 'high fever, very stiff muscles, confusion, fast heart rate, heavy sweating, collapse', track: 'seek urgent medical help', urgency: 'red', doctorQuestion: 'Urgent: go to hospital.' },
  { key: 'N', name: 'Allergic reaction', familySigns: 'swelling of lips/face/tongue, breathing trouble, rash with swelling, collapse', track: 'seek urgent medical help', urgency: 'red', doctorQuestion: 'Urgent: go to hospital.' },
  { key: 'O', name: 'Interaction risk', familySigns: 'sudden sedation, agitation, new movement symptoms, dizziness, behaviour change after a new medicine/supplement', track: 'every medication, PRN, supplement, dose change and start date', urgency: 'orange', doctorQuestion: 'Can you check all medication and supplement interactions?' },
]

export const monitoringChecklist = [
  'weight', 'height', 'BMI', 'waist if appropriate', 'appetite and food seeking', 'sleep',
  'daytime sedation', 'movement side effects', 'blood pressure', 'pulse', 'fasting glucose',
  'HbA1c', 'fasting lipids', 'liver function', 'kidney function', 'full blood count if clinician wants',
  'prolactin if symptoms or clinician wants', 'ECG if cardiac risk/symptoms/high dose/interacting medicines',
  'behaviour target score', 'quality of life', 'family/carer strain', 'PRN use',
  'restrictive practice risk', 'bowel pattern', 'pain signs',
]

export const behaviourFirstChecklist = [
  'pain', 'constipation', 'poor sleep', 'hunger', 'reflux', 'dental pain', 'seizure activity',
  'infection', 'sensory overload', 'too many demands', 'communication frustration', 'boredom',
  'staff inconsistency', 'routine change', 'trauma or fear', 'medication side effect',
]

export const specialists = [
  { role: 'GP', best: 'general health check, blood tests, constipation, sleep, referrals, medication safety review' },
  { role: 'Paediatrician / Developmental Paediatrician', best: 'ASD medication review, growth and development, behaviour and medical triggers' },
  { role: 'Psychiatrist / Child & Adolescent Psychiatrist', best: 'risperidone review, complex behaviour medication, reduction planning, combinations, side-effect balancing' },
  { role: 'Pharmacist', best: 'medication and supplement interactions, timing, liquid dose measuring, swallowing, side-effect education' },
  { role: 'Behaviour Support Practitioner', best: 'behaviour function, triggers, replacement skills, proactive strategies, restrictive-practice reduction' },
  { role: 'Dietitian', best: 'food seeking, selective eating, weight gain, fibre and protein plan, constipation support' },
  { role: 'Speech Pathologist', best: 'communication frustration, visual supports, choice making, swallowing concerns' },
  { role: 'Occupational Therapist', best: 'sensory overload, routines, environment setup, sleep routine, daily-living supports' },
]

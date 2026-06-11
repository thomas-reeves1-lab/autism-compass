/**
 * Email nurture sequence — DRAFTS ONLY. Not wired to send anything.
 * Give-value-first ($100M Leads). TGA-safe: education, never "treats autism".
 * A human + lawyer should review tone and claims before any of these are sent.
 */
export interface NurtureEmail {
  day: number
  subject: string
  body: string
}

export const nurtureSequence: NurtureEmail[] = [
  {
    day: 0,
    subject: 'Your Calmer Days Autism Guide is here',
    body: `Hi,

Thanks for grabbing the guide. Here it is.

Quick tip before you read: the biggest wins often come from the simple checks first. Sleep, pain, constipation, hunger, routine. Page two walks you through them.

This is education, not medical advice. Always talk to the treating doctor.

Talk soon,
The Autism Compass team`,
  },
  {
    day: 2,
    subject: 'The one question that changes the doctor visit',
    body: `Hi,

Most appointments go better with one question ready: "What behaviour are we actually trying to help?"

Write it down. Track it for a week. Bring it in. The Doctor Visit Pack in your guide does this for you.

Education only. Not medical advice.`,
  },
  {
    day: 5,
    subject: 'What the research really says (the honest version)',
    body: `Hi,

Some supplements have decent evidence for certain things. Many have weak or mixed evidence. A few were studied and did not help.

We show all of it, openly, even the weak parts. Be careful of anyone who promises a cure.

Have a look at the evidence tool when you have a minute.`,
  },
  {
    day: 9,
    subject: 'Safety first: "natural" does not mean safe',
    body: `Hi,

A gentle reminder. Supplements can interact with medicine. Dose and quality matter. Always ask the doctor or pharmacist before starting anything, and never stop a prescribed medicine without the prescriber.

The Safe Stack checklist in your guide helps you have that conversation.`,
  },
  {
    day: 14,
    subject: 'A quick way to see if something is working',
    body: `Hi,

Pick one behaviour. Track it for a week before, and the weeks after a change. Look at the pattern, not one bad day.

The tracker in the tool makes this easy, and it stays on your device.

Education only. Not medical advice.`,
  },
  {
    day: 21,
    subject: 'Helpful? Pass it to one parent',
    body: `Hi,

If the guide helped you feel more prepared, the kindest thing you can do is send it to one other parent who needs it.

Here is the link to share.

Thank you for being here.`,
  },
]

import { Printer, ShieldCheck } from '../../components/icons'
import { GlassCard } from '../../components/ui'

/**
 * The free lead-magnet guide (first draft). Education only. TGA-safe:
 * it teaches what studies found and how to prepare for the doctor. It never
 * says a supplement treats autism. Voice/clinical review still recommended.
 */
export function FreeGuide() {
  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-brand-deep">The Calmer Days Autism Guide</h2>
        <button onClick={() => window.print()} className="btn-ghost text-sm">
          <Printer size={16} /> Print / save PDF
        </button>
      </div>

      <div id="free-guide" className="space-y-5 text-sm text-slate-700">
        <p className="rounded-lg bg-info-soft px-3 py-2 text-xs text-info">
          Education only. Not medical advice. Not a diagnosis or dosing tool. Always speak to the
          treating doctor before changing anything.
        </p>

        <section>
          <h3 className="font-black text-brand-navy">1. Behaviour rarely comes from nowhere</h3>
          <p>Before adding anything, check the simple things first. Pain. Constipation. Poor sleep. Hunger. Noise. A change in routine. These are common reasons behaviour gets harder. Fix the cause, and the behaviour often eases.</p>
        </section>

        <section>
          <h3 className="font-black text-brand-navy">2. What the research actually says</h3>
          <p>Some supplements have been studied in autism. Some have good evidence for certain things. Many have weak or mixed evidence. A few were studied and did not help. We show all of it openly, including the weak parts. Strong evidence is rare. Be careful of anyone who promises a cure.</p>
        </section>

        <section>
          <h3 className="font-black text-brand-navy">3. Safety comes first</h3>
          <p>"Natural" does not mean safe. Supplements can interact with medicine. Dose and product quality matter. Always ask the doctor or pharmacist before starting anything, and never stop a prescribed medicine without the prescriber.</p>
        </section>

        <section>
          <h3 className="font-black text-brand-navy">4. How to prepare for the doctor</h3>
          <p>Write down the behaviour you want to help. Track it for a week or two. List every medicine and supplement, with doses and start dates. Bring your questions. Ask how you will measure if something is working after 8 to 12 weeks.</p>
        </section>

        <section>
          <h3 className="font-black text-brand-navy">5. Questions worth asking</h3>
          <ul className="ml-4 list-disc">
            <li>What behaviour are we trying to help?</li>
            <li>Could pain, sleep, or constipation be part of it?</li>
            <li>Is this option safe with our current medicines?</li>
            <li>How will we know if it is working?</li>
            <li>What should make us stop and call you?</li>
          </ul>
        </section>

        <section>
          <h3 className="font-black text-brand-navy">6. Red flags: get urgent help</h3>
          <p>Seizure, breathing trouble, collapse, high fever with stiff muscles, a bad allergic reaction, or a sudden severe change. In Australia, call 000.</p>
        </section>

        <p className="flex items-center gap-1 border-t border-slate-200 pt-3 text-xs text-slate-400">
          <ShieldCheck size={13} /> Built by a registered provider and an RN. Education only.
        </p>
      </div>
    </GlassCard>
  )
}

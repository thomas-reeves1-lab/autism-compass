import { GlassCard } from '../../components/ui'

export type LegalDoc = 'privacy' | 'terms' | 'refunds' | 'affiliate'

export const LEGAL_TITLES: Record<LegalDoc, string> = {
  privacy: 'Privacy Policy',
  terms: 'Website Terms',
  refunds: 'Refunds & Consumer Guarantees',
  affiliate: 'Affiliate Disclosure',
}

/**
 * Plain-English policy DRAFTS. A lawyer must review these before go-live.
 * Grounded in: Privacy Act 1988 (APPs), Australian Consumer Law, Spam Act.
 */
function Body({ doc }: { doc: LegalDoc }) {
  if (doc === 'privacy') {
    return (
      <div className="space-y-3 text-sm text-slate-700">
        <p className="rounded-lg bg-caution-soft px-3 py-2 text-xs text-caution">
          Draft. A lawyer must review this before the site goes live.
        </p>
        <p><b>Who we are.</b> Autism Compass is an education tool. This policy says how we handle your information under the Privacy Act 1988 and the Australian Privacy Principles.</p>
        <p><b>What we collect.</b> Your email, only if you give it. Simple, anonymous site analytics, only if you say yes. Your tracker entries stay on your device unless you choose to export them.</p>
        <p><b>Sensitive information.</b> Health information is sensitive. We do not ask you to send us health details, and we do not store your tracker data on our servers.</p>
        <p><b>Why we use it.</b> To send the guide and updates you asked for. Nothing else. We never sell your data.</p>
        <p><b>Your choices.</b> You can unsubscribe from any email. You can ask us to show, fix, or delete your data. You can turn analytics off.</p>
        <p><b>Keeping it safe.</b> We use trusted providers and reasonable security. If a serious data breach happens, we follow the Notifiable Data Breaches scheme.</p>
        <p><b>Contact.</b> Email us to ask about your data. Complaints can also go to the OAIC.</p>
      </div>
    )
  }
  if (doc === 'terms') {
    return (
      <div className="space-y-3 text-sm text-slate-700">
        <p className="rounded-lg bg-caution-soft px-3 py-2 text-xs text-caution">Draft. Lawyer to review.</p>
        <p><b>Education only.</b> This site is for education. It is not medical advice, not a diagnosis, and not a dosing tool. Always speak to the treating doctor.</p>
        <p><b>Use.</b> Use the site for your own information. Do not misuse it or rely on it to make medical decisions.</p>
        <p><b>No guarantee of outcome.</b> The model shows estimates from published studies. It does not predict what will happen for any person.</p>
        <p><b>Links.</b> We may link to other sites. We are not responsible for their content.</p>
        <p><b>Changes.</b> We may update the site and these terms. Australian law applies.</p>
      </div>
    )
  }
  if (doc === 'refunds') {
    return (
      <div className="space-y-3 text-sm text-slate-700">
        <p className="rounded-lg bg-caution-soft px-3 py-2 text-xs text-caution">Draft. Lawyer to review.</p>
        <p><b>Your rights.</b> Our products come with guarantees that cannot be excluded under the Australian Consumer Law.</p>
        <p><b>Refunds.</b> If something is faulty, not as described, or does not do what we said, you can ask for a repair, replacement, or refund.</p>
        <p><b>Change of mind.</b> For change-of-mind on digital items, tell us within a fair time and we will do our best to help.</p>
        <p><b>How to ask.</b> Email us with your order details and we will sort it.</p>
      </div>
    )
  }
  return (
    <div className="space-y-3 text-sm text-slate-700">
      <p className="rounded-lg bg-caution-soft px-3 py-2 text-xs text-caution">Draft. Lawyer to review.</p>
      <p><b>We may earn a commission.</b> Some links to products are affiliate links. If you buy through them, we may get a small payment. It does not cost you more.</p>
      <p><b>It does not change our advice.</b> We show the evidence openly, including when it is weak. We list options we do not earn from, and we say what not to take.</p>
      <p><b>Not medical advice.</b> Affiliate or not, nothing here is medical advice. Speak to your doctor or pharmacist before using any supplement.</p>
    </div>
  )
}

export function Legal({ doc }: { doc: LegalDoc }) {
  return (
    <GlassCard>
      <h2 className="mb-3 text-xl font-black text-brand-deep">{LEGAL_TITLES[doc]}</h2>
      <Body doc={doc} />
    </GlassCard>
  )
}

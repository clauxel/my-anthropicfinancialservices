import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  Cloud,
  DatabaseZap,
  ExternalLink,
  FileSpreadsheet,
  Github,
  LockKeyhole,
  PieChart,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'

import { findKeywordPageByPath, keywordPages, type KeywordPage } from './content/keyword-pages'
import { trackEvent, trackPageView } from './lib/analytics'
import {
  analyzeDeskSelection,
  controlOptions,
  dataOptions,
  defaultDeskSelection,
  deploymentOptions,
  outputOptions,
  workflowOptions,
  type DeskSelection,
  type Option,
  type PlanId,
} from './lib/mission'
import { buildSeoDocument, syncSeoDocument } from './lib/seo'
import { deriveRouteView, normalizePathname, scrollToHashTarget, type RouteView } from './lib/routing'

const defaultPublicAppOrigin = 'https://anthropicfinancial.space'
const pagesApiBaseUrl = 'https://my-anthropicfinancialservices.yangdengkui01.workers.dev'
const upstreamRepoUrl = 'https://github.com/anthropics/financial-services'

type Billing = 'monthly' | 'annual'

type CheckoutModalState = {
  planId: PlanId
  billing: Billing
  loadingKey: string
  status: 'loading' | 'popup' | 'retry'
  checkoutUrl?: string
  error?: string
}

const ctaPrimary = 'Choose Desk annual'
const ctaCheckout = 'Checkout Desk annual'

const plans: Array<{
  id: PlanId
  name: string
  shortName: string
  tagline: string
  monthlyUsd: number
  bullets: string[]
  popular?: boolean
}> = [
  {
    id: 'analyst',
    name: 'Analyst',
    shortName: 'Analyst',
    tagline: 'A focused first workflow for one analyst lane and a light reviewer loop.',
    monthlyUsd: 79,
    bullets: ['One finance-agent workflow', 'Plugin setup guidance', 'Sanitized demo packet', 'Email onboarding support'],
  },
  {
    id: 'desk',
    name: 'Desk',
    shortName: 'Desk',
    tagline: 'The default workspace for serious Claude financial-services pilots.',
    monthlyUsd: 199,
    popular: true,
    bullets: ['Three workflow lanes', 'Managed Agent launch map', 'Connector and data-boundary review', 'Priority checkout onboarding'],
  },
  {
    id: 'firm',
    name: 'Firm',
    shortName: 'Firm',
    tagline: 'For internal systems, Microsoft 365 rollout, and multi-team governance.',
    monthlyUsd: 499,
    bullets: ['Firm control model', 'MCP connector architecture', 'Microsoft 365 path planning', 'Dedicated rollout support'],
  },
]

const proofItems = [
  { label: 'Reference agents', value: '8+', detail: 'Pitch, research, model, fund ops, KYC, and more' },
  { label: 'Default plan', value: 'Desk', detail: 'Middle tier selected before checkout' },
  { label: 'Annual savings', value: '50%', detail: 'Annual billing is active by default' },
  { label: 'Payment flow', value: 'Popup', detail: 'Creem opens centered while the site stays visible' },
]

const workflowCards = [
  {
    title: 'Analyst work product',
    body: 'Turn filings, transcripts, CIMs, and models into reviewable drafts for comps, DCF, earnings, and pitch work.',
    icon: <FileSpreadsheet size={21} />,
  },
  {
    title: 'Managed agent launch',
    body: 'Translate reference prompts, skills, and leaf agents into a deployment your workflow engine can govern.',
    icon: <Cloud size={21} />,
  },
  {
    title: 'Connector policy',
    body: 'Map licensed market data, document stores, and internal systems before the agent touches sensitive workflows.',
    icon: <DatabaseZap size={21} />,
  },
  {
    title: 'Reviewer controls',
    body: 'Keep every deck, memo, model, KYC flag, and reconciliation package staged for qualified human sign-off.',
    icon: <ShieldCheck size={21} />,
  },
]

const trustLinks = [
  {
    label: 'GitHub implementation guide',
    href: '/anthropic-financial-services-github',
    icon: <Github size={17} />,
    internal: true,
  },
  {
    label: 'Claude demo blueprint',
    href: '/claude-for-financial-services-demo',
    icon: <BookOpen size={17} />,
    internal: true,
  },
  {
    label: 'Upstream reference repository',
    href: upstreamRepoUrl,
    icon: <ExternalLink size={17} />,
  },
]

const legalPrivacySections = [
  {
    title: 'What we collect',
    paragraphs: [
      'Anthropic Financial Services Desk collects only the information reasonably needed to operate this website, process checkout, understand product usage, prevent abuse, and respond to support requests.',
      'This may include page views, referral and UTM data, browser and device information, approximate location derived from network data, checkout metadata, support emails, and information you intentionally submit.',
      'The public readiness console runs from your selections in the browser. It does not require you to upload private repositories, account credentials, regulated client data, non-public financial information, trade data, payment card numbers, or production secrets.',
    ],
  },
  {
    title: 'How we use information',
    paragraphs: [
      'We use analytics to understand which pages, plan choices, and checkout actions help visitors make a confident decision.',
      'We use checkout metadata to create hosted payment sessions, confirm purchases, return users to the homepage, provide onboarding, detect fraud, and handle support.',
      'We do not sell personal information. We do not use private financial materials for model training through this public website because the public website does not collect those materials.',
    ],
  },
  {
    title: 'Service providers and third parties',
    paragraphs: [
      'We use service providers such as Cloudflare for hosting, routing, security, and infrastructure, and Creem for hosted checkout and payment processing.',
      'Payment details are handled by the payment provider. We do not ask users to send card numbers, API keys, passwords, private keys, or regulated financial information through email or this public website.',
      'Third-party services process information under their own terms and privacy practices. Do not proceed with checkout or external links if you do not accept those practices.',
    ],
  },
  {
    title: 'Security, retention, and deletion',
    paragraphs: [
      'We use reasonable administrative, technical, and organizational safeguards appropriate for a lightweight SaaS marketing, onboarding, and checkout site.',
      'No internet service can be guaranteed perfectly secure. Users are responsible for avoiding the submission of credentials, secrets, regulated data, confidential third-party data, or highly sensitive information unless a separate signed agreement permits it.',
      'We retain information only as long as reasonably needed for the purposes described here, including tax, accounting, fraud prevention, security, dispute handling, support, and legal compliance.',
    ],
  },
  {
    title: 'Your choices and rights',
    paragraphs: [
      'Depending on your location, you may have rights to request access, correction, deletion, portability, restriction, or objection regarding personal information we control.',
      'California and other privacy laws may provide additional rights when their thresholds and conditions apply. We will not discriminate against users for exercising applicable privacy rights.',
      'To make a privacy or support request, email support@aigeamy.com. We may need to verify the request before acting on it.',
    ],
  },
  {
    title: 'Children, changes, and contact',
    paragraphs: [
      'This site is intended for business, technology, and financial-services audiences and is not directed to children under 13.',
      'We may update this policy when the product, providers, laws, or operations change. The version posted on this page controls from the time it is published.',
      'Questions about privacy, support, or data handling should be sent to support@aigeamy.com.',
    ],
  },
]

const legalTermsSections = [
  {
    title: 'Acceptance and service scope',
    paragraphs: [
      'By accessing this website, using the readiness console, opening checkout, purchasing a plan, or continuing to use the service, you agree to these Terms.',
      'Anthropic Financial Services Desk provides a website, readiness console, pricing flow, hosted checkout, and related onboarding for supervised Claude financial-services agent workflows.',
      'This site is independent and is not affiliated with, endorsed by, or sponsored by Anthropic. References to Anthropic, Claude, and the public financial-services repository are descriptive references to publicly available technology and workflows.',
    ],
  },
  {
    title: 'No financial, legal, tax, accounting, or investment advice',
    paragraphs: [
      'The service does not provide legal, financial, tax, accounting, investment, trading, compliance, underwriting, onboarding, audit, or professional advice.',
      'Any examples, readiness scores, launch plans, workflow summaries, generated materials, pricing comparisons, or onboarding notes are informational only.',
      'You are solely responsible for consulting qualified professionals and deciding whether any workflow, output, model, memo, deck, reconciliation, KYC flag, or operational action is lawful, accurate, complete, and appropriate for your use case.',
    ],
  },
  {
    title: 'User responsibilities',
    paragraphs: [
      'You are responsible for the data, prompts, instructions, documents, repositories, connectors, credentials, third-party accounts, reviewers, and business decisions you provide or authorize.',
      'Do not submit API keys, passwords, private keys, regulated financial data, confidential third-party information, material non-public information, export-controlled material, payment card data, or data you are not allowed to process.',
      'Any workflow that can read files, access connectors, write files, run commands, call external tools, send messages, deploy code, post to a ledger, route onboarding, or affect production systems must be operated with explicit permissions and human review.',
    ],
  },
  {
    title: 'AI and financial-services output',
    paragraphs: [
      'AI-assisted output may be incomplete, inaccurate, insecure, biased, unsuitable, infringing, outdated, or wrong. You must independently review, test, validate, and approve output before relying on it.',
      'The service does not make investment recommendations, execute transactions, bind risk, approve onboarding, post journal entries, publish research, distribute client materials, or approve regulated decisions.',
      'All agent outputs should be treated as drafts for qualified human review unless a separate written agreement expressly says otherwise.',
    ],
  },
  {
    title: 'Payments, renewals, and refunds',
    paragraphs: [
      'Payments are processed by Creem in a hosted popup window. Successful checkouts return the user to the homepage.',
      'Displayed annual pricing reflects a 50% discount versus the monthly run-rate for the same plan. Prices, plan names, features, and availability may change before purchase.',
      'Unless a separate written agreement says otherwise, purchases are final to the maximum extent permitted by law. If the payment provider, consumer law, or a written policy requires a refund, that required rule controls.',
      'Chargebacks, payment abuse, fraud, or attempted circumvention of checkout may result in suspension, cancellation, evidence preservation, refusal of service, and recovery of costs where permitted by law.',
    ],
  },
  {
    title: 'Prohibited use',
    paragraphs: [
      'You may not use the service to violate law, infringe rights, attack systems, distribute malware, bypass access controls, scrape where prohibited, spam, impersonate others, misrepresent AI output, process data without authority, or evade financial-services controls.',
      'You may not reverse engineer, overload, interfere with, resell, frame, copy, or exploit the service except as expressly permitted in writing.',
      'We may suspend or terminate access, refuse checkout, preserve evidence, or cooperate with lawful requests when we believe use is unsafe, abusive, fraudulent, infringing, or unlawful.',
    ],
  },
  {
    title: 'Third-party services',
    paragraphs: [
      'Cloudflare, Creem, GitHub, model providers, browser tools, infrastructure providers, and other third-party services may be involved in hosting, checkout, integrations, or customer workflows.',
      'We are not responsible for third-party services, third-party outages, payment provider decisions, external repositories, external links, connector providers, model providers, or third-party terms.',
      'Your use of third-party services is governed by the applicable third-party terms, privacy policies, account rules, compliance obligations, and fees.',
    ],
  },
  {
    title: 'No warranties',
    paragraphs: [
      'The service is provided as is and as available. To the maximum extent permitted by law, we disclaim all warranties, whether express, implied, statutory, or otherwise.',
      'We do not warrant uninterrupted service, error-free operation, complete security, merchantability, fitness for a particular purpose, non-infringement, accuracy of AI output, legal compliance, financial results, rankings, click-through rates, conversion results, revenue outcomes, or business outcomes.',
      'You use the service at your own risk and remain responsible for backups, testing, review, security, regulatory compliance, professional advice, and production decisions.',
    ],
  },
  {
    title: 'Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by law, Anthropic Financial Services Desk and its operators, affiliates, suppliers, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, punitive, reliance, lost-profit, lost-revenue, lost-data, business-interruption, trading, investment, regulatory, or reputational damages.',
      'To the maximum extent permitted by law, total liability for any claim relating to the service is limited to the greater of 100 USD or the amount you paid for the service in the three months before the event giving rise to the claim.',
      'These limits apply whether the claim is based on contract, tort, negligence, strict liability, statute, warranty, equity, or any other theory, even if a remedy fails of its essential purpose.',
    ],
  },
  {
    title: 'Indemnity',
    paragraphs: [
      'You agree to defend, indemnify, and hold harmless Anthropic Financial Services Desk and its operators, affiliates, suppliers, and service providers from claims, damages, liabilities, losses, costs, and fees arising from your use of the service.',
      'This includes claims arising from your data, prompts, instructions, generated output, production use, investment or business decisions, regulated activities, third-party accounts, violation of law, infringement, breach of these Terms, or unauthorized use of credentials or systems.',
    ],
  },
  {
    title: 'Disputes',
    paragraphs: [
      'Before filing a claim, you agree to email support@aigeamy.com and give us 30 days to try to resolve the dispute informally.',
      'To the maximum extent permitted by law, disputes must be resolved individually and not as a class, collective, consolidated, private attorney general, or representative action.',
      'To the maximum extent permitted by law, disputes will be resolved by binding arbitration or the courts with proper jurisdiction for the operator, and you waive jury trial where that waiver is enforceable.',
      'If any part of these dispute terms is unenforceable, the remaining provisions continue to apply to the maximum extent permitted by law.',
    ],
  },
  {
    title: 'Changes, termination, and contact',
    paragraphs: [
      'We may update these Terms, change or discontinue features, refuse transactions, suspend access, or terminate service when reasonably necessary for security, legal, operational, abuse-prevention, or business reasons.',
      'If a provision is unenforceable, the rest of these Terms remains effective. A failure to enforce a provision is not a waiver.',
      'Questions, notices, support requests, and dispute notices should be sent to support@aigeamy.com.',
    ],
  },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function resolveApiBaseUrl() {
  const configured = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
  if (configured) return configured
  if (window.location.hostname.endsWith('.pages.dev')) return pagesApiBaseUrl
  return ''
}

function resolveApiUrl(path: string) {
  const apiBaseUrl = resolveApiBaseUrl()
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const rawText = await response.text()
  if (!rawText.trim()) return null
  try {
    return JSON.parse(rawText) as T
  } catch {
    return null
  }
}

async function createCheckoutSession(planId: PlanId, billing: Billing) {
  const response = await fetch(resolveApiUrl('/api/checkout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, billing }),
  })

  const payload = await readJsonResponse<{ ok?: boolean; checkoutUrl?: string; error?: string }>(response)
  if (!response.ok || !payload?.ok || !payload.checkoutUrl) {
    throw new Error(payload?.error || 'Checkout could not be started.')
  }

  return payload.checkoutUrl
}

function openCenteredCheckoutWindow() {
  const width = 560
  const height = 760
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  const popup = window.open(
    'about:blank',
    'anthropic-financial-checkout',
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  )

  if (popup) {
    try {
      popup.document.title = 'Opening secure checkout'
      popup.document.body.innerHTML =
        '<main style="min-height:100vh;display:grid;place-items:center;background:#0d1320;color:#f8fafc;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:32px"><div><h1 style="font-size:22px;margin:0 0 8px">Opening secure checkout...</h1><p style="margin:0;color:#cbd5e1">Your Creem payment window is being prepared.</p></div></main>'
    } catch {
      /* Existing named checkout windows can be cross-origin. */
    }
  }

  return popup
}

function sendPopupToCheckout(popup: Window | null, url: string) {
  if (!popup || popup.closed) return false

  try {
    popup.location.replace(url)
    popup.focus()
    return true
  } catch {
    return false
  }
}

function useRouteSignal() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [search, setSearch] = useState(() => window.location.search)

  function navigate(to: string) {
    const url = new URL(to, window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPathname(url.pathname)
    setSearch(url.search)

    if (url.hash) {
      requestAnimationFrame(() => scrollToHashTarget(url.hash))
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPop = () => {
      setPathname(window.location.pathname)
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { pathname, search, navigate }
}

function CheckoutDoneBridge({ publicAppOrigin }: { publicAppOrigin: string }) {
  useEffect(() => {
    const origin = window.location.origin || new URL(publicAppOrigin).origin

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'afs-checkout-complete' }, origin)
      return
    }

    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'afs-checkout-complete' }, origin)
      } catch {
        /* The opener may be closed or cross-origin. */
      }
      window.close()
      return
    }

    window.location.replace(`${origin}/?payment=success`)
  }, [publicAppOrigin])

  return (
    <main className="af-main">
      <section className="af-center-panel">
        <p className="af-eyebrow">Checkout</p>
        <h1>Finishing checkout...</h1>
        <p className="af-muted">You will return to the homepage when the hosted payment session closes.</p>
      </section>
    </main>
  )
}

export default function App() {
  const { pathname, search, navigate } = useRouteSignal()
  const routeView: RouteView = useMemo(() => deriveRouteView(pathname), [pathname])
  const normalizedPath = normalizePathname(pathname)
  const keywordPage = useMemo(() => findKeywordPageByPath(pathname), [pathname])

  const [publicAppOrigin, setPublicAppOrigin] = useState(defaultPublicAppOrigin)
  const [headerCompact, setHeaderCompact] = useState(() => window.scrollY > 18)
  const [billing, setBilling] = useState<Billing>('annual')
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('desk')
  const [checkoutLoadingKey, setCheckoutLoadingKey] = useState<string | null>(null)
  const [checkoutModal, setCheckoutModal] = useState<CheckoutModalState | null>(null)
  const [deskSelection, setDeskSelection] = useState<DeskSelection>(defaultDeskSelection)

  const deskResult = useMemo(() => analyzeDeskSelection(deskSelection), [deskSelection])

  useEffect(() => {
    let cancelled = false
    fetch(resolveApiUrl('/api/runtime'))
      .then((response) => readJsonResponse<{ publicAppOrigin?: string }>(response))
      .then((payload) => {
        if (!cancelled && payload?.publicAppOrigin) {
          setPublicAppOrigin(payload.publicAppOrigin)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const seo = buildSeoDocument({
      pathname,
      routeView,
      publicAppOrigin,
      keywordPage,
    })
    syncSeoDocument(seo)
  }, [keywordPage, pathname, publicAppOrigin, routeView])

  useEffect(() => {
    const onScroll = () => setHeaderCompact(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    trackPageView(`${pathname}${search}`)
  }, [pathname, search])

  useEffect(() => {
    const allowed = new Set([window.location.origin, new URL(publicAppOrigin).origin])
    const onMessage = (event: MessageEvent) => {
      if (!allowed.has(event.origin)) return
      if (event.data?.type === 'afs-checkout-complete') {
        setCheckoutModal(null)
        trackEvent('checkout_complete_return', { path: pathname })
        navigate('/?payment=success')
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate, pathname, publicAppOrigin])

  useEffect(() => {
    if (normalizedPath === '/' && new URLSearchParams(search).get('payment') === 'success') {
      trackEvent('payment_success_landing', { source: 'checkout_return' })
    }
  }, [normalizedPath, search])

  function updateSelection<Key extends keyof DeskSelection>(key: Key, value: DeskSelection[Key]) {
    setDeskSelection((current) => ({ ...current, [key]: value }))
    trackEvent('readiness_option_selected', { key, value })
  }

  function go(to: string) {
    if (to.startsWith('http')) {
      window.open(to, '_blank', 'noopener,noreferrer')
      return
    }
    navigate(to)
  }

  function handleBillingChange(nextBilling: Billing) {
    setBilling(nextBilling)
    trackEvent('billing_selected', { billing: nextBilling })
  }

  function handlePlanSelect(planId: PlanId) {
    setSelectedPlanId(planId)
    trackEvent('plan_selected', { planId, billing })
  }

  async function startCheckout(planId = selectedPlanId, billingCycle = billing) {
    const loadingKey = `${planId}:${billingCycle}`
    setSelectedPlanId(planId)
    setBilling(billingCycle)
    setCheckoutLoadingKey(loadingKey)
    setCheckoutModal({ planId, billing: billingCycle, loadingKey, status: 'loading' })
    trackEvent('checkout_start', { planId, billing: billingCycle, path: pathname })

    const popup = openCenteredCheckoutWindow()
    if (!popup) {
      setCheckoutLoadingKey(null)
      setCheckoutModal({
        planId,
        billing: billingCycle,
        loadingKey,
        status: 'retry',
        error: 'Your browser blocked the payment popup. Allow popups for this site, then try checkout again.',
      })
      trackEvent('checkout_popup_blocked', { planId, billing: billingCycle })
      return
    }

    try {
      const checkoutUrl = await createCheckoutSession(planId, billingCycle)
      const opened = sendPopupToCheckout(popup, checkoutUrl)
      if (!opened) throw new Error('The payment popup could not be opened.')
      setCheckoutModal({ planId, billing: billingCycle, loadingKey, status: 'popup', checkoutUrl })
      trackEvent('checkout_popup_opened', { planId, billing: billingCycle })
    } catch (error) {
      if (!popup.closed) popup.close()
      const message = error instanceof Error ? error.message : 'Checkout could not be started.'
      setCheckoutModal({ planId, billing: billingCycle, loadingKey, status: 'retry', error: message })
      trackEvent('checkout_error', { planId, billing: billingCycle, message })
    } finally {
      setCheckoutLoadingKey(null)
    }
  }

  const checkoutPlan = plans.find((plan) => plan.id === checkoutModal?.planId)

  if (routeView === 'checkout-done') {
    return <CheckoutDoneBridge publicAppOrigin={publicAppOrigin} />
  }

  return (
    <>
      <div className={`af-app-shell ${checkoutModal ? 'af-blurred' : ''}`}>
        <header className={`af-header ${headerCompact ? 'af-header-compact' : ''}`}>
          <button className="af-brand" type="button" onClick={() => go('/')} aria-label="Anthropic Financial Services Desk home">
            <span className="af-brand-mark">AF</span>
            <span>
              <strong>Anthropic Financial Services</strong>
              <small>Independent Claude agent desk</small>
            </span>
          </button>
          <nav className="af-nav" aria-label="Primary navigation">
            <button type="button" onClick={() => go('/anthropic-financial-services-github')}>
              GitHub guide
            </button>
            <button type="button" onClick={() => go('/claude-for-financial-services-demo')}>
              Demo
            </button>
            <button type="button" onClick={() => go('/pricing')}>
              Pricing
            </button>
          </nav>
          <button className="af-btn af-btn-primary af-header-cta" type="button" onClick={() => go('/pricing')}>
            <BadgeDollarSign size={17} />
            {ctaPrimary}
          </button>
        </header>

        {routeView === 'home' && (
          <HomeView
            deskSelection={deskSelection}
            deskResult={deskResult}
            onSelect={updateSelection}
            onNavigate={go}
            onCheckout={() => startCheckout('desk', 'annual')}
          />
        )}
        {routeView === 'pricing' && (
          <PricingView
            billing={billing}
            selectedPlanId={selectedPlanId}
            loadingKey={checkoutLoadingKey}
            onBillingChange={handleBillingChange}
            onPlanSelect={handlePlanSelect}
            onCheckout={startCheckout}
            onNavigate={go}
          />
        )}
        {routeView === 'keyword' && keywordPage && <KeywordPageView page={keywordPage} onNavigate={go} />}
        {routeView === 'privacy' && (
          <LegalView
            title="Privacy Policy"
            description="This policy covers analytics, checkout, support, and site interactions for Anthropic Financial Services Desk."
            sections={legalPrivacySections}
            onNavigate={go}
          />
        )}
        {routeView === 'terms' && (
          <LegalView
            title="Terms of Service"
            description="These terms define the limits and responsibilities for this supervised financial-services agent workspace."
            sections={legalTermsSections}
            onNavigate={go}
          />
        )}
        {routeView === 'not-found' && <NotFoundView onNavigate={go} />}

        <Footer onNavigate={go} />
      </div>

      {checkoutModal && (
        <div className="af-checkout-backdrop" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <section className="af-checkout-modal">
            <button
              className="af-icon-button"
              type="button"
              aria-label="Close checkout status"
              onClick={() => setCheckoutModal(null)}
            >
              <X size={18} />
            </button>
            <p className="af-eyebrow">Secure checkout</p>
            <h2 id="checkout-title">
              {checkoutModal.status === 'loading'
                ? 'Preparing your Creem payment window'
                : checkoutModal.status === 'popup'
                  ? 'Complete payment in the popup'
                  : 'Checkout needs another try'}
            </h2>
            <p className="af-muted">
              {checkoutPlan?.name ?? 'Desk'} {checkoutModal.billing === 'annual' ? 'annual' : 'monthly'} stays selected. The
              original site remains open and blurred while payment is active.
            </p>
            {checkoutModal.status === 'loading' && <div className="af-loader" aria-label="Loading checkout" />}
            {checkoutModal.status === 'popup' && (
              <div className="af-modal-note">
                <Check size={18} />
                Creem is open in a centered payment window. After payment, it returns to the homepage.
              </div>
            )}
            {checkoutModal.status === 'retry' && (
              <>
                <div className="af-error">{checkoutModal.error}</div>
                <button
                  className="af-btn af-btn-primary"
                  type="button"
                  onClick={() => startCheckout(checkoutModal.planId, checkoutModal.billing)}
                >
                  Try checkout again
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </>
  )
}

function HomeView({
  deskSelection,
  deskResult,
  onSelect,
  onNavigate,
  onCheckout,
}: {
  deskSelection: DeskSelection
  deskResult: ReturnType<typeof analyzeDeskSelection>
  onSelect: <Key extends keyof DeskSelection>(key: Key, value: DeskSelection[Key]) => void
  onNavigate: (to: string) => void
  onCheckout: () => void
}) {
  return (
    <main className="af-main">
      <section className="af-hero" id="workspace">
        <div className="af-hero-copy">
          <p className="af-eyebrow">
            <Sparkles size={16} />
            Anthropic financial services workspace
          </p>
          <h1>Launch Claude finance agents that reviewers can actually approve.</h1>
          <p className="af-lede">
            Convert the public Anthropic financial-services reference project into a paid, supervised SaaS rollout for modeling,
            research, fund operations, and KYC work.
          </p>
          <div className="af-hero-actions">
            <button className="af-btn af-btn-primary" type="button" onClick={() => onNavigate('/pricing')}>
              <BadgeDollarSign size={18} />
              {ctaPrimary}
            </button>
            <button className="af-btn af-btn-secondary" type="button" onClick={() => onNavigate('/anthropic-financial-services-github-project-explained')}>
              Read the project guide
              <ArrowRight size={18} />
            </button>
          </div>
          <p className="af-microcopy">Desk annual is selected by default. Annual saves 50% versus monthly.</p>
          <div className="af-proof-grid">
            {proofItems.map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <small>{item.detail}</small>
              </article>
            ))}
          </div>
        </div>

        <section className="af-console" aria-label="Financial services agent readiness console">
          <div className="af-console-top">
            <div>
              <p className="af-eyebrow">Readiness console</p>
              <h2>Scope the first agent desk</h2>
            </div>
            <div className="af-score">
              <strong>{deskResult.score}</strong>
              <span>{deskResult.label}</span>
            </div>
          </div>

          <OptionGroup
            label="Workflow"
            value={deskSelection.workflow}
            options={workflowOptions}
            onChange={(value) => onSelect('workflow', value)}
          />
          <OptionGroup label="Data" value={deskSelection.data} options={dataOptions} onChange={(value) => onSelect('data', value)} />
          <OptionGroup
            label="Deployment"
            value={deskSelection.deployment}
            options={deploymentOptions}
            onChange={(value) => onSelect('deployment', value)}
          />
          <div className="af-console-row">
            <OptionGroup
              label="Controls"
              value={deskSelection.controls}
              options={controlOptions}
              onChange={(value) => onSelect('controls', value)}
              compact
            />
            <OptionGroup label="Output" value={deskSelection.output} options={outputOptions} onChange={(value) => onSelect('output', value)} compact />
          </div>

          <div className="af-result-card">
            <div>
              <p className="af-eyebrow">Recommended launch</p>
              <h3>{deskResult.headline}</h3>
              <p>{deskResult.operatorMessage}</p>
            </div>
            <ul>
              {deskResult.modules.map((module) => (
                <li key={module.label}>
                  <Check size={16} />
                  <span>
                    <strong>{module.label}</strong>
                    {module.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>

      <section className="af-section af-band">
        <div className="af-section-heading">
          <p className="af-eyebrow">Why this exists</p>
          <h2>The repository gives reference agents. The desk turns them into a controlled rollout.</h2>
          <p>
            The upstream project includes agents, plugins, managed-agent cookbooks, and MCP connector settings. The buying
            decision is whether your team can turn that reference structure into a workflow people trust enough to use.
          </p>
        </div>
        <div className="af-card-grid">
          {workflowCards.map((card) => (
            <article className="af-feature-card" key={card.title}>
              <span>{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="af-section af-two-column">
        <div>
          <p className="af-eyebrow">Workflow proof</p>
          <h2>Built around the finance work where Claude can create reviewable leverage.</h2>
          <p>
            Use Claude as a draft, synthesis, modeling, and exception-preparation layer. Keep professionals responsible for
            judgments, approvals, regulated actions, and client-ready output.
          </p>
          <div className="af-link-stack">
            {trustLinks.map((link) => (
              <button className="af-text-link" type="button" key={link.label} onClick={() => onNavigate(link.href)}>
                {link.icon}
                {link.label}
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>
        <div className="af-timeline">
          {[
            ['1', 'Choose a narrow workflow', 'Start with earnings review, model refresh, GL reconciliation, or KYC gap flags.'],
            ['2', 'Map data and connectors', 'Define public sources, licensed data, document stores, and internal-system boundaries.'],
            ['3', 'Name the reviewer', 'Every deck, memo, model, reconciliation, and exception queue needs an owner.'],
            ['4', 'Open Desk annual', 'Pay in a centered Creem popup while the product page stays open for onboarding.'],
          ].map(([step, title, body]) => (
            <article key={step}>
              <strong>{step}</strong>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <PricingPreview onNavigate={onNavigate} onCheckout={onCheckout} />
    </main>
  )
}

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  compact = false,
}: {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  compact?: boolean
}) {
  return (
    <div className={`af-option-group ${compact ? 'af-option-group-compact' : ''}`}>
      <span>{label}</span>
      <div>
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            className={option.id === value ? 'is-selected' : ''}
            onClick={() => onChange(option.id)}
            title={option.summary}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function PricingPreview({ onNavigate, onCheckout }: { onNavigate: (to: string) => void; onCheckout: () => void }) {
  return (
    <section className="af-section af-pricing-preview" id="pricing">
      <div>
        <p className="af-eyebrow">Default checkout</p>
        <h2>Desk annual is preselected because most teams need more than a solo demo.</h2>
        <p>
          The middle plan gives enough workflow design, connector policy, and reviewer setup to decide whether a broader firm
          rollout is worth it.
        </p>
      </div>
      <div className="af-preview-card">
        <span>Desk annual</span>
        <strong>$99.50/mo</strong>
        <small>Billed annually. 50% cheaper than monthly.</small>
        <button className="af-btn af-btn-primary" type="button" onClick={onCheckout}>
          <BadgeDollarSign size={18} />
          {ctaCheckout}
        </button>
        <button className="af-btn af-btn-secondary" type="button" onClick={() => onNavigate('/pricing')}>
          Compare all plans
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  )
}

function PricingView({
  billing,
  selectedPlanId,
  loadingKey,
  onBillingChange,
  onPlanSelect,
  onCheckout,
  onNavigate,
}: {
  billing: Billing
  selectedPlanId: PlanId
  loadingKey: string | null
  onBillingChange: (billing: Billing) => void
  onPlanSelect: (planId: PlanId) => void
  onCheckout: (planId: PlanId, billing: Billing) => void
  onNavigate: (to: string) => void
}) {
  return (
    <main className="af-main">
      <section className="af-page-hero">
        <p className="af-eyebrow">
          <BadgeDollarSign size={16} />
          Pricing
        </p>
        <h1>Start with the Desk annual plan, then expand only when the workflow proves itself.</h1>
        <p className="af-lede">
          Annual billing is selected by default and is 50% cheaper than monthly. Creem checkout opens in a centered popup while
          this page stays open.
        </p>
        <div className="af-billing-toggle" role="group" aria-label="Billing cycle">
          <button type="button" className={billing === 'annual' ? 'is-selected' : ''} onClick={() => onBillingChange('annual')}>
            Annual
            <span>Save 50%</span>
          </button>
          <button type="button" className={billing === 'monthly' ? 'is-selected' : ''} onClick={() => onBillingChange('monthly')}>
            Monthly
          </button>
        </div>
        <div className="af-pricing-quickbar">
          <span>Desk is selected. Annual is selected.</span>
          <button className="af-btn af-btn-primary" type="button" onClick={() => onCheckout('desk', billing)}>
            <BadgeDollarSign size={18} />
            {billing === 'annual' ? 'Checkout Desk annual' : 'Checkout Desk monthly'}
          </button>
        </div>
      </section>

      <section className="af-plan-grid" aria-label="Plans">
        {plans.map((plan) => {
          const selected = selectedPlanId === plan.id
          const monthlyEquivalent = billing === 'annual' ? plan.monthlyUsd * 0.5 : plan.monthlyUsd
          const billedAmount = billing === 'annual' ? monthlyEquivalent * 12 : monthlyEquivalent
          const loading = loadingKey === `${plan.id}:${billing}`
          return (
            <article className={`af-plan-card ${plan.popular ? 'is-popular' : ''} ${selected ? 'is-selected' : ''}`} key={plan.id}>
              {plan.popular && <div className="af-plan-badge">Default middle plan</div>}
              <div className="af-plan-card-top">
                <div>
                  <h2>{plan.name}</h2>
                  <p>{plan.tagline}</p>
                </div>
                <button type="button" className="af-select-plan" onClick={() => onPlanSelect(plan.id)} aria-pressed={selected}>
                  {selected ? <Check size={18} /> : <span />}
                </button>
              </div>
              <div className="af-price">
                <strong>{formatMoney(monthlyEquivalent)}</strong>
                <span>/mo</span>
              </div>
              <p className="af-price-note">
                {billing === 'annual' ? `${formatMoney(billedAmount)} billed annually` : 'Billed monthly'}
              </p>
              <ul>
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Check size={16} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button className="af-btn af-btn-primary" type="button" onClick={() => onCheckout(plan.id, billing)} disabled={loading}>
                <BadgeDollarSign size={18} />
                {loading ? 'Opening checkout...' : `Checkout ${plan.shortName} ${billing}`}
              </button>
            </article>
          )
        })}
      </section>

      <section className="af-section af-two-column">
        <div>
          <p className="af-eyebrow">Before checkout</p>
          <h2>What the paid workspace is meant to do</h2>
          <p>
            It helps turn a public reference project into a governed workflow: which agents matter, how data enters, what output
            is draft-only, and how reviewers sign off.
          </p>
        </div>
        <div className="af-checklist">
          {['Pick one front-office workflow', 'Pick one operations workflow', 'Define connector boundaries', 'Name reviewer owners', 'Return to homepage after payment'].map((item) => (
            <span key={item}>
              <Check size={16} />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="af-section af-resource-strip">
        <button type="button" onClick={() => onNavigate('/claude-for-financial-services-review')}>
          Read the practical review
          <ArrowRight size={18} />
        </button>
        <button type="button" onClick={() => onNavigate('/anthropic-financial-services-plugin')}>
          Plan plugin setup
          <ArrowRight size={18} />
        </button>
        <button type="button" onClick={() => onNavigate('/anthropic-ai-agents-financial-services')}>
          Map agent use cases
          <ArrowRight size={18} />
        </button>
      </section>
    </main>
  )
}

function KeywordPageView({ page, onNavigate }: { page: KeywordPage; onNavigate: (to: string) => void }) {
  return (
    <main className="af-main">
      <article className="af-article">
        <button className="af-back-link" type="button" onClick={() => onNavigate('/')}>
          <ChevronRight size={16} />
          Anthropic Financial Services
        </button>
        <p className="af-eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p className="af-lede">{page.lede}</p>
        <p>{page.intent}</p>
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets?.length ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
        <section className="af-faq">
          <h2>Common questions</h2>
          {page.faqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </section>
        <div className="af-article-cta">
          <button className="af-btn af-btn-primary" type="button" onClick={() => onNavigate('/pricing')}>
            <BadgeDollarSign size={18} />
            {page.ctaLabel}
          </button>
          <button className="af-btn af-btn-secondary" type="button" onClick={() => onNavigate('/')}>
            Try the readiness console
            <ArrowRight size={18} />
          </button>
        </div>
      </article>
    </main>
  )
}

function LegalView({
  title,
  description,
  sections,
  onNavigate,
}: {
  title: string
  description: string
  sections: Array<{ title: string; paragraphs: string[] }>
  onNavigate: (to: string) => void
}) {
  return (
    <main className="af-main">
      <article className="af-article af-legal">
        <button className="af-back-link" type="button" onClick={() => onNavigate('/')}>
          <ChevronRight size={16} />
          Anthropic Financial Services
        </button>
        <h1>{title}</h1>
        <p className="af-lede">{description}</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  )
}

function NotFoundView({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <main className="af-main">
      <section className="af-center-panel">
        <p className="af-eyebrow">404</p>
        <h1>This page is not available.</h1>
        <p className="af-muted">Return to the readiness console or compare the default Desk annual plan.</p>
        <button className="af-btn af-btn-primary" type="button" onClick={() => onNavigate('/')}>
          Go home
          <ArrowRight size={18} />
        </button>
      </section>
    </main>
  )
}

function Footer({ onNavigate }: { onNavigate: (to: string) => void }) {
  const footerPages = keywordPages.slice(0, 6)
  return (
    <footer className="af-footer">
      <div className="af-footer-inner">
        <div>
          <div className="af-footer-brand">
            <span className="af-brand-mark">AF</span>
            <strong>Anthropic Financial Services Desk</strong>
          </div>
          <p>
            Independent workspace for teams evaluating supervised Claude financial-services agents. Not affiliated with or endorsed
            by Anthropic.
          </p>
          <a href="mailto:support@aigeamy.com">support@aigeamy.com</a>
        </div>
        <div>
          <h2>Resources</h2>
          {footerPages.map((page) => (
            <button type="button" key={page.path} onClick={() => onNavigate(page.path)}>
              {page.title.replace('Anthropic Financial Services ', '')}
            </button>
          ))}
        </div>
        <div>
          <h2>Company</h2>
          <button type="button" onClick={() => onNavigate('/pricing')}>
            Pricing
          </button>
          <button type="button" onClick={() => onNavigate('/privacy')}>
            Privacy
          </button>
          <button type="button" onClick={() => onNavigate('/terms')}>
            Terms
          </button>
          <button type="button" onClick={() => onNavigate(upstreamRepoUrl)}>
            GitHub reference
          </button>
        </div>
      </div>
    </footer>
  )
}

export type PlanId = 'analyst' | 'desk' | 'firm'

export type Option<T extends string = string> = {
  id: T
  label: string
  summary: string
}

export type DeskSelection = {
  workflow: 'pitch' | 'research' | 'modeling' | 'fundops' | 'kyc'
  data: 'public' | 'market' | 'internal'
  deployment: 'plugin' | 'managed' | 'm365'
  controls: 'review' | 'strict'
  output: 'deck' | 'memo' | 'excel' | 'recon'
}

export type DeskResult = {
  score: number
  label: string
  headline: string
  recommendedPlanId: PlanId
  architecture: string
  workflowRun: string
  compliancePosture: string
  reasons: string[]
  watchouts: string[]
  modules: Array<{ label: string; detail: string }>
  nextSteps: string[]
  operatorMessage: string
}

export const workflowOptions: Option<DeskSelection['workflow']>[] = [
  { id: 'pitch', label: 'Pitch and advisory', summary: 'Comps, precedent transactions, LBO framing, and branded deck preparation.' },
  { id: 'research', label: 'Equity research', summary: 'Filings, calls, KPIs, model refresh, and analyst note drafting.' },
  { id: 'modeling', label: 'Model build', summary: 'DCF, LBO, 3-statement, comps, formula review, and Excel-ready outputs.' },
  { id: 'fundops', label: 'Fund operations', summary: 'Valuation review, GL reconciliation, month-end close, and LP statement checks.' },
  { id: 'kyc', label: 'KYC onboarding', summary: 'Document parsing, rules-grid checks, gap flags, and reviewer sign-off.' },
]

export const dataOptions: Option<DeskSelection['data']>[] = [
  { id: 'public', label: 'Public filings', summary: 'Start with public sources, uploaded documents, and team templates.' },
  { id: 'market', label: 'Market data', summary: 'Add research and market-data connectors where subscriptions already exist.' },
  { id: 'internal', label: 'Internal systems', summary: 'Plan controlled access to datarooms, document stores, and finance systems.' },
]

export const deploymentOptions: Option<DeskSelection['deployment']>[] = [
  { id: 'plugin', label: 'Claude plugin', summary: 'Best for a quick analyst-facing rollout inside Claude workflows.' },
  { id: 'managed', label: 'Managed Agent API', summary: 'Best for embedding the same prompts and skills behind your workflow engine.' },
  { id: 'm365', label: 'Microsoft 365 add-in', summary: 'Best when Excel, PowerPoint, Word, and Outlook are the center of gravity.' },
]

export const controlOptions: Option<DeskSelection['controls']>[] = [
  { id: 'review', label: 'Reviewer gate', summary: 'Every model, memo, deck, or exception is staged for human approval.' },
  { id: 'strict', label: 'Strict controls', summary: 'Recommended for regulated workflows, private data, and finance operations.' },
]

export const outputOptions: Option<DeskSelection['output']>[] = [
  { id: 'deck', label: 'Pitch deck', summary: 'Branded PowerPoint draft, chart refresh, and quality checks.' },
  { id: 'memo', label: 'Research memo', summary: 'Investment thesis, source-backed narrative, and reviewer checklist.' },
  { id: 'excel', label: 'Excel model', summary: 'Spreadsheet-ready model draft with audit trail and formula checks.' },
  { id: 'recon', label: 'Exception queue', summary: 'Breaks, gaps, route-to-owner comments, and sign-off package.' },
]

export const defaultDeskSelection: DeskSelection = {
  workflow: 'modeling',
  data: 'market',
  deployment: 'managed',
  controls: 'strict',
  output: 'excel',
}

export function analyzeDeskSelection(selection: DeskSelection): DeskResult {
  let score = 70
  const reasons: string[] = []
  const watchouts: string[] = []

  if (selection.workflow === 'modeling' || selection.workflow === 'research') {
    score += 8
    reasons.push('The reference project is especially strong where models, filings, earnings calls, and memo drafts meet reviewer sign-off.')
  }

  if (selection.workflow === 'fundops' || selection.workflow === 'kyc') {
    score += 5
    reasons.push('Operational workflows fit well when the agent stages exceptions instead of taking ledger or onboarding actions directly.')
  }

  if (selection.data === 'market') {
    score += 7
    reasons.push('Subscribed market-data connectors can turn the reference skills into repeatable analyst workflows.')
  } else if (selection.data === 'internal') {
    score += 3
    watchouts.push('Internal systems need a named data boundary, logging plan, and approval model before the first pilot.')
  } else {
    score += 2
    watchouts.push('Public-only pilots are safer, but the value rises when the team brings templates, filing packs, and licensed data.')
  }

  if (selection.deployment === 'managed') {
    score += 8
    reasons.push('Managed Agent deployment keeps the same prompts and skills but lets your platform own orchestration and approvals.')
  } else if (selection.deployment === 'm365') {
    score += 4
    reasons.push('Microsoft 365 deployment fits teams that live in Excel, PowerPoint, Word, and Outlook.')
  } else {
    score += 3
    reasons.push('Plugin rollout is the fastest way to put the reference workflows in front of analysts.')
  }

  if (selection.controls === 'strict') {
    score += 7
    reasons.push('Strict reviewer controls match the project’s design: draft work product first, human sign-off before decisions.')
  } else {
    score -= 2
    watchouts.push('Reviewer gates should be explicit before publishing research, distributing statements, or sending client materials.')
  }

  if (selection.output === 'excel' || selection.output === 'deck') score += 3
  if (selection.output === 'recon') score += 2

  score = Math.max(46, Math.min(96, score))

  const recommendedPlanId: PlanId =
    selection.data === 'internal' || selection.deployment === 'm365' || selection.workflow === 'fundops' ? 'firm' : 'desk'
  const label = score >= 86 ? 'Launch ready' : score >= 74 ? 'Pilot ready' : score >= 60 ? 'Scope first' : 'Needs controls'
  const workflowRun =
    selection.workflow === 'pitch'
      ? 'Company brief -> comps -> precedents -> LBO frame -> deck QC'
      : selection.workflow === 'research'
        ? 'Filings -> call transcript -> model update -> thesis note'
        : selection.workflow === 'fundops'
          ? 'Package ingest -> valuation template -> variance check -> sign-off queue'
          : selection.workflow === 'kyc'
            ? 'Document intake -> rules grid -> gap flags -> reviewer decision'
            : 'Source pack -> DCF/LBO/3-statement -> Excel audit -> reviewer memo'
  const architecture =
    selection.deployment === 'managed'
      ? 'Managed Agent API with orchestrated finance subagents and audit-ready events'
      : selection.deployment === 'm365'
        ? 'Claude for Microsoft 365 add-in path with Excel and PowerPoint at the center'
        : 'Claude plugin path with bundled financial-services skills and slash commands'

  const modules = [
    { label: 'Workflow', detail: workflowRun },
    { label: 'Deployment', detail: architecture },
    {
      label: 'Data posture',
      detail:
        selection.data === 'internal'
          ? 'Private connectors and document stores should be permissioned before launch.'
          : selection.data === 'market'
            ? 'Use licensed providers through MCP connectors where the firm already has access.'
            : 'Begin with public filings and analyst-owned templates to reduce pilot risk.',
    },
    {
      label: 'Controls',
      detail:
        selection.controls === 'strict'
          ? 'Every output remains a draft until a qualified reviewer approves it.'
          : 'Reviewer gates should be named before production use.',
    },
  ]

  const nextSteps = [
    'Pick one revenue-facing workflow and one operations workflow for the first pilot.',
    'Map which connectors are allowed, which outputs are drafts, and who signs off.',
    'Keep Desk annual selected for the first paid workspace unless internal systems already require Firm.',
    'Open secure checkout in the popup, then return to the homepage for onboarding.',
  ]

  return {
    score,
    label,
    headline:
      score >= 74
        ? 'This is a credible first supervised finance-agent workspace.'
        : 'Tighten data access, review gates, and output ownership before the first paid rollout.',
    recommendedPlanId,
    architecture,
    workflowRun,
    compliancePosture: selection.controls === 'strict' ? 'Strict reviewer sign-off' : 'Human review required',
    reasons,
    watchouts: watchouts.length ? watchouts : ['Do not let an agent make investment decisions, execute transactions, or approve onboarding without human authorization.'],
    modules,
    nextSteps,
    operatorMessage:
      recommendedPlanId === 'firm'
        ? 'Firm may be needed later, but Desk annual is still the cleanest default for a first controlled pilot.'
        : 'Desk annual is the default path for a serious financial-services pilot.',
  }
}

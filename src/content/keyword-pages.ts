export type KeywordPage = {
  path: string
  title: string
  description: string
  eyebrow: string
  h1: string
  lede: string
  intent: string
  ctaLabel: string
  sections: Array<{
    heading: string
    paragraphs: string[]
    bullets?: string[]
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
}

export const keywordPages: KeywordPage[] = [
  {
    path: '/anthropic-financial-services-github-project-explained',
    title: 'Anthropic Financial Services GitHub Project Explained',
    description:
      'A practical explanation of the Anthropic financial-services reference project, including agents, plugins, connectors, deployment paths, and review controls.',
    eyebrow: 'Project guide',
    h1: 'Anthropic Financial Services GitHub project explained for operators',
    lede:
      'The repository is best understood as a reference operating system for supervised finance-agent work, not as a one-click trading bot or an investment-advice product.',
    intent:
      'Use this page to decide which part of the project belongs in your first pilot and which controls should exist before analysts rely on it.',
    ctaLabel: 'Choose Desk annual',
    sections: [
      {
        heading: 'What the project actually gives you',
        paragraphs: [
          'The project packages reference agents, vertical plugins, skills, slash commands, MCP connector settings, and managed-agent cookbooks for common financial-services workflows.',
          'Its value is the structure: named agents for work like pitch creation, market research, model building, valuation review, GL reconciliation, month-end close, statement audit, and KYC screening.',
        ],
        bullets: [
          'Agent templates for end-to-end workflows such as pitch, meeting prep, market research, earnings review, and KYC screening.',
          'Vertical bundles for investment banking, equity research, private equity, wealth management, fund administration, and operations.',
          'Managed Agent cookbooks for teams that need to embed the same prompts and skills behind their own workflow engine.',
        ],
      },
      {
        heading: 'Where the commercial value appears',
        paragraphs: [
          'The strongest pilots usually reduce the time analysts spend turning source material into a reviewable first draft. That includes comps, DCF assumptions, earnings notes, IC memo sections, reconciliation narratives, and deck quality checks.',
          'The project is deliberately conservative. It stages output for human review instead of making investment recommendations, posting to ledgers, or approving onboarding decisions.',
        ],
      },
      {
        heading: 'How to scope the first rollout',
        paragraphs: [
          'Start with one high-frequency workflow and one operations workflow. A common pairing is earnings review plus GL reconciliation, because the team can measure both research-cycle speed and exception-handling quality.',
          'Before launch, define allowed data sources, reviewer ownership, output templates, retention rules, and the point where the agent must stop and ask for approval.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this an official financial-advice product?',
        answer:
          'No. The reference project describes supervised agent workflows that draft work product for qualified human review. It is not investment, legal, tax, accounting, trading, or onboarding approval advice.',
      },
      {
        question: 'What should a team pilot first?',
        answer:
          'Choose a workflow with clear source documents and a reviewable output: earnings note drafts, comps packs, DCF refreshes, pitch-deck QC, KYC gap flags, or reconciliation variance commentary.',
      },
    ],
  },
  {
    path: '/anthropic-financial-services-github',
    title: 'Anthropic Financial Services GitHub Implementation Guide',
    description:
      'How to evaluate the Anthropic financial-services GitHub repository and translate it into a controlled firm workflow.',
    eyebrow: 'GitHub guide',
    h1: 'How to use the Anthropic financial services GitHub reference without creating workflow chaos',
    lede:
      'The repository is file-based and approachable, but teams still need a deployment path, connector map, and approval policy before putting it near client or fund workflows.',
    intent:
      'Use this guide when a technical lead, COO, or analytics team is deciding whether to install plugins, use Managed Agents, or build a governed wrapper around the reference templates.',
    ctaLabel: 'Review the launch plan',
    sections: [
      {
        heading: 'Read the repository by layer',
        paragraphs: [
          'Start with the agent plugins to understand what each workflow owns. Then inspect the vertical plugins for reusable skills and commands. Finally, review managed-agent cookbooks if you need an API-controlled deployment.',
          'Avoid treating every directory as equally urgent. The first pilot should use the smallest set of skills and connectors that can produce a measurable reviewer-approved output.',
        ],
        bullets: [
          'Agent plugins: named workflows and bundled skills.',
          'Vertical plugins: reusable commands, methods, and connector settings.',
          'Managed-agent cookbooks: deployment wrappers and orchestration examples.',
        ],
      },
      {
        heading: 'Keep connectors boring on day one',
        paragraphs: [
          'MCP connectors can be powerful, especially for market data, research platforms, and document stores. They also create governance work. Start with sources your team already licenses and logs.',
          'The right first question is not how many connectors you can add. It is which connector materially improves the reviewer’s output quality without expanding the risk surface too quickly.',
        ],
      },
      {
        heading: 'Translate open-source structure into firm controls',
        paragraphs: [
          'Map every agent action to a human owner. Decide who approves a model change, who signs a client-ready deck, who clears a KYC exception, and who owns support when a connector is unavailable.',
          'This site’s Desk plan is designed around that first translation: workflow selection, output templates, approval boundaries, and checkout-led onboarding.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should we fork the repository directly?',
        answer:
          'A fork is useful for experimentation, but production use usually needs a controlled wrapper, firm templates, connector governance, logging, and reviewer policies.',
      },
      {
        question: 'Does the repository require a build step?',
        answer:
          'Most of the reference content is markdown, YAML, and JSON. The operational work is less about building assets and more about deploying the right workflow with the right controls.',
      },
    ],
  },
  {
    path: '/anthropic-ai-agents-financial-services',
    title: 'Anthropic AI Agents for Financial Services',
    description:
      'A practical map of Anthropic AI agent use cases in financial services, from analyst work to finance operations and KYC review.',
    eyebrow: 'Agent map',
    h1: 'Anthropic AI agents for financial services should start with supervised work product',
    lede:
      'The right use cases are the ones where agents assemble, check, and draft work that qualified professionals already know how to review.',
    intent:
      'Use this page to prioritize agent workflows by speed, controllability, and reviewer confidence rather than novelty.',
    ctaLabel: 'Start with Desk annual',
    sections: [
      {
        heading: 'High-fit agent workflows',
        paragraphs: [
          'The highest-fit workflows have clear inputs, recognizable outputs, and a reviewer who can judge quality quickly. That is why earnings reviews, comps, DCF refreshes, pitch materials, IC memo drafts, valuation checks, and GL break narratives make sense early.',
          'An AI agent should not be framed as a decision maker. It should be framed as a draft-and-check coworker that keeps sources, assumptions, and unresolved questions visible.',
        ],
        bullets: [
          'Investment banking: pitch decks, buyer lists, process letters, LBO and merger model support.',
          'Equity research: earnings notes, model updates, sector overviews, thesis tracking, catalyst calendars.',
          'Fund and finance operations: valuation review, month-end variance commentary, statement audit, GL reconciliation.',
          'Operations and onboarding: KYC document parsing, rules-grid evaluation, gap flagging, and reviewer routing.',
        ],
      },
      {
        heading: 'Where agents should stop',
        paragraphs: [
          'A financial-services agent should not execute trades, approve onboarding, post ledger entries, bind risk, publish client-ready recommendations, or make investment decisions without authorized human review.',
          'The more sensitive the data or action, the more important it is to keep the agent in a staged-output workflow with explicit approval moments.',
        ],
      },
      {
        heading: 'How to measure the pilot',
        paragraphs: [
          'Measure cycle time, reviewer edits, data-source coverage, exception rate, and rework. A useful agent pilot should make reviewers faster without making them less accountable.',
          'If the pilot cannot show what changed, who reviewed it, and why the output is safe to use, it is not ready for a wider rollout.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Which agent should a bank or fund test first?',
        answer:
          'Start with a repeatable workflow that already has templates and review habits, such as earnings review, pitch-deck QC, DCF refresh, KYC screening, or GL reconciliation.',
      },
      {
        question: 'Do AI agents replace analysts?',
        answer:
          'No serious rollout should promise that. The durable value is helping analysts and operators produce better first drafts, checks, and exception queues under human review.',
      },
    ],
  },
  {
    path: '/anthropic-financial-services-plugin',
    title: 'Anthropic Financial Services Plugin Setup',
    description:
      'How to think about Claude financial-services plugins, vertical bundles, commands, connector access, and governed installation.',
    eyebrow: 'Plugin setup',
    h1: 'Anthropic financial services plugin setup needs workflow ownership before installation',
    lede:
      'A plugin can make agents and commands easy to reach, but the rollout only works when the team knows which workflow it is installing and who reviews the result.',
    intent:
      'Use this page to plan a plugin-first rollout that gives analysts useful commands without opening uncontrolled data paths.',
    ctaLabel: 'Compare the plans',
    sections: [
      {
        heading: 'What plugins are good for',
        paragraphs: [
          'Plugins are useful when analysts need direct access to commands such as comps, DCF, earnings review, IC memo drafting, or deck QC inside a Claude workflow.',
          'A plugin-first rollout is usually faster than building a custom workflow engine, but it still needs a short policy: allowed inputs, allowed connectors, output status, and reviewer ownership.',
        ],
      },
      {
        heading: 'Start with vertical bundles',
        paragraphs: [
          'The repository separates financial-analysis foundations from vertical bundles such as investment banking, equity research, private equity, wealth management, fund administration, and operations.',
          'Install the smallest bundle that matches the first workflow. Adding everything at once makes training harder and creates a larger governance surface than most pilots need.',
        ],
        bullets: [
          'Financial analysis for core modeling and connector foundations.',
          'Investment banking for pitch, process, buyer-list, and transaction workflows.',
          'Equity research for earnings, model updates, thesis tracking, and morning notes.',
          'Fund administration and operations for reconciliations, statements, KYC, and month-end work.',
        ],
      },
      {
        heading: 'When to move beyond plugins',
        paragraphs: [
          'Move toward Managed Agent deployment when you need event orchestration, a workflow engine, centralized logs, approval routing, or integration with internal applications.',
          'The Desk plan is built for teams deciding exactly where that transition should happen.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is plugin setup enough for a regulated firm?',
        answer:
          'It can be enough for a limited pilot, but regulated production workflows usually need connector policy, logging, approval routing, and clear restrictions on what the agent can do.',
      },
      {
        question: 'What should be installed first?',
        answer:
          'Install the smallest vertical bundle that supports the first workflow, then add commands and connectors only when they improve a reviewer-approved output.',
      },
    ],
  },
  {
    path: '/anthropic-financial-services-event',
    title: 'Anthropic Financial Services Event Planning',
    description:
      'A useful event agenda for teams evaluating Claude financial-services agents, demos, controls, and pilot selection.',
    eyebrow: 'Workshop agenda',
    h1: 'Run an Anthropic Financial Services event that ends with a pilot decision',
    lede:
      'A good internal event should not be a generic AI talk. It should show real finance-agent workflows, surface risk questions, and leave the team with a scoped first pilot.',
    intent:
      'Use this agenda for an internal workshop, vendor review, innovation day, or operating-committee session.',
    ctaLabel: 'Build the pilot workspace',
    sections: [
      {
        heading: 'Suggested 90-minute agenda',
        paragraphs: [
          'The strongest event format starts with the repository’s actual workflow categories, then narrows to two or three demos that match the audience.',
          'Keep the final third of the session practical: what data is allowed, what outputs are reviewable, what cannot be automated, and what the first paid pilot should measure.',
        ],
        bullets: [
          '15 minutes: repository overview and what the agents are not allowed to do.',
          '25 minutes: analyst workflow demo such as earnings review, comps, or model refresh.',
          '20 minutes: operations workflow demo such as GL reconciliation, valuation review, or KYC screening.',
          '20 minutes: controls, data access, reviewer roles, and compliance questions.',
          '10 minutes: pilot scope, owner, success metrics, and next action.',
        ],
      },
      {
        heading: 'Questions the event should answer',
        paragraphs: [
          'Can the team identify one workflow where a draft saves real time? Can reviewers see sources and assumptions quickly? Can compliance explain the boundary between draft support and decision authority?',
          'If those questions are answered, the event can turn into a controlled pilot instead of another interesting but unfunded demo.',
        ],
      },
      {
        heading: 'What to prepare before the room',
        paragraphs: [
          'Bring sanitized documents, a familiar template, a sample approval policy, and a list of connector candidates. Avoid live private data until the permissions model is settled.',
          'The goal is not to impress the room with breadth. It is to make one credible workflow feel safe enough to fund.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Who should attend the event?',
        answer:
          'Invite the workflow owner, two hands-on analysts or operators, technology, compliance, information security, and a budget owner who can approve the pilot.',
      },
      {
        question: 'What should the event produce?',
        answer:
          'It should produce a selected workflow, data boundary, reviewer owner, deployment path, success metric, and target launch date.',
      },
    ],
  },
  {
    path: '/anthropic-financial-services-jobs',
    title: 'Anthropic Financial Services Jobs and Roles',
    description:
      'The roles a firm needs to launch Claude financial-services agents safely, including workflow owner, AI product lead, analyst reviewer, and connector engineer.',
    eyebrow: 'Roles',
    h1: 'Anthropic Financial Services jobs are really workflow ownership roles',
    lede:
      'The first successful pilots are rarely staffed by a single AI generalist. They need people who understand finance work, data access, review standards, and deployment.',
    intent:
      'Use this page to define internal responsibilities before hiring, assigning, or buying support for a financial-services agent rollout.',
    ctaLabel: 'Scope the rollout',
    sections: [
      {
        heading: 'Roles you need before the first pilot',
        paragraphs: [
          'A small team can cover the first pilot, but the responsibilities should be explicit. The workflow owner decides what good output looks like. The reviewer validates accuracy. The technical owner controls deployment and connectors.',
          'When these jobs are unclear, the agent becomes a novelty tool. When they are clear, it becomes a measurable operating improvement.',
        ],
        bullets: [
          'Workflow owner: selects use case, templates, review criteria, and success metrics.',
          'Analyst or operator reviewer: checks source coverage, assumptions, formulas, and final wording.',
          'AI product lead: turns the reference project into a rollout plan and adoption loop.',
          'Connector engineer: handles MCP access, permissions, logs, and failure modes.',
          'Compliance and risk reviewer: defines boundaries, disclaimers, and prohibited actions.',
        ],
      },
      {
        heading: 'Hiring signals',
        paragraphs: [
          'Look for people who can translate between front-office or operations work and production controls. Finance domain fluency matters more than generic prompt enthusiasm.',
          'The best operators can say no to a flashy automation if the data boundary, sign-off process, or output ownership is not ready.',
        ],
      },
      {
        heading: 'What to outsource',
        paragraphs: [
          'Outsource the first setup, templates, connector mapping, and pilot instrumentation if the internal team is overloaded. Keep final workflow ownership and review standards inside the firm.',
          'The Desk plan is designed for this middle ground: enough guidance to start quickly without pretending a vendor can own your regulated decisions.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do we need a dedicated AI agent engineer?',
        answer:
          'Not always for a first pilot. You do need someone accountable for connector access, logs, deployment shape, and failure handling.',
      },
      {
        question: 'Can analysts own the rollout?',
        answer:
          'Analysts should own output quality, but technology and compliance should own the access model and controls.',
      },
    ],
  },
  {
    path: '/claude-for-financial-services-demo',
    title: 'Claude for Financial Services Demo',
    description:
      'A demo blueprint for Claude financial-services workflows covering pitch, research, modeling, reconciliation, and KYC scenarios.',
    eyebrow: 'Demo blueprint',
    h1: 'A Claude for financial services demo should feel like a reviewer workflow',
    lede:
      'The demo that converts is the one where a qualified reviewer can see inputs, assumptions, draft output, unresolved questions, and the approval boundary.',
    intent:
      'Use this page to prepare a demo that buyers can trust, not just a model answering finance questions.',
    ctaLabel: 'Choose Desk annual',
    sections: [
      {
        heading: 'Demo flow that works',
        paragraphs: [
          'Start with a familiar packet: filings, a transcript, a CIM excerpt, a general ledger export, or a KYC document set. Then show the agent producing a draft artifact and the review trail behind it.',
          'The best demo moment is not a dramatic answer. It is the moment a reviewer can quickly decide whether the work is usable, what needs checking, and what the agent refused to do.',
        ],
        bullets: [
          'Input: a realistic but sanitized source pack.',
          'Agent task: one named workflow from the reference project.',
          'Output: a memo, model update, deck section, reconciliation narrative, or KYC exception list.',
          'Review: assumptions, citations, formulas, gaps, and approval status.',
        ],
      },
      {
        heading: 'Demo scenarios by audience',
        paragraphs: [
          'For investment banking, show comps and deck QC. For equity research, show earnings call and model refresh. For fund administration, show valuation review or statement audit. For operations, show KYC gap flagging.',
          'Executive audiences care about cycle time and risk boundaries. Practitioner audiences care about whether the output looks like work they can actually edit.',
        ],
      },
      {
        heading: 'What not to demo',
        paragraphs: [
          'Do not demo trade execution, final investment recommendations, ledger posting, or automated onboarding approval. Those create trust problems and do not match the reference project’s supervised design.',
          'Keep the demo grounded in draft work product and human sign-off.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How long should the demo be?',
        answer:
          'A 20-minute workflow demo is usually enough: five minutes of context, ten minutes of agent work, and five minutes of reviewer inspection.',
      },
      {
        question: 'What makes the demo credible?',
        answer:
          'Credibility comes from realistic source documents, a recognizable output, visible assumptions, and a clear point where the human reviewer takes responsibility.',
      },
    ],
  },
  {
    path: '/claude-for-financial-services-review',
    title: 'Claude for Financial Services Review',
    description:
      'A balanced review of Claude financial-services workflows: strengths, risks, best-fit use cases, and readiness questions.',
    eyebrow: 'Review',
    h1: 'Claude for financial services review: strong drafts, real controls required',
    lede:
      'The reference workflows are compelling because they target real analyst and operations work. They still need disciplined rollout design before they touch sensitive processes.',
    intent:
      'Use this review to decide whether your team is ready for a paid pilot and what to fix before deployment.',
    ctaLabel: 'See pricing',
    sections: [
      {
        heading: 'Strengths',
        paragraphs: [
          'The main strength is workflow specificity. The repository does not stop at generic finance chat. It names pitch, research, modeling, reconciliation, valuation, KYC, wealth, and fund-admin tasks.',
          'Another strength is deployment flexibility: plugin usage for fast access and Managed Agent cookbooks for teams that need their own orchestration layer.',
        ],
        bullets: [
          'Useful vertical coverage across banking, research, PE, wealth, fund admin, and operations.',
          'Good fit for draft work product, source synthesis, model checks, and reviewer queues.',
          'Clear reminder that outputs should be reviewed by qualified professionals.',
        ],
      },
      {
        heading: 'Risks',
        paragraphs: [
          'The biggest risk is over-automation. A team can damage trust if it lets an agent act like a decision maker rather than a drafter and checker.',
          'Connector access is the second risk. Market-data and document connectors should be permissioned, logged, and limited to the pilot scope.',
        ],
      },
      {
        heading: 'Readiness checklist',
        paragraphs: [
          'A firm is ready when it can name the first workflow, provide sanitized or permissioned inputs, define reviewer ownership, and measure whether the agent saves time without lowering quality.',
          'If any of those pieces are missing, start with the event or implementation-guide pages before checkout.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Claude good enough for financial-services workflows?',
        answer:
          'Claude can be useful for structured drafting, synthesis, modeling support, and review preparation, but firms should validate every output and keep regulated decisions with qualified humans.',
      },
      {
        question: 'What is the biggest adoption mistake?',
        answer:
          'The biggest mistake is launching broad access without a narrow workflow, connector policy, reviewer owner, and success metric.',
      },
    ],
  },
  {
    path: '/anthropic-claude-financial',
    title: 'Anthropic Claude Financial Workflow Guide',
    description:
      'How to apply Anthropic Claude to financial workflows with useful boundaries, from analyst drafts to controlled operations review.',
    eyebrow: 'Claude financial guide',
    h1: 'Anthropic Claude financial workflows work best when the boundary is explicit',
    lede:
      'Claude can help teams draft, compare, summarize, audit, and prepare finance work. The boundary is that humans own judgment, approval, and regulated actions.',
    intent:
      'Use this guide when explaining Claude financial workflows to a stakeholder who wants practical value without careless automation.',
    ctaLabel: 'Launch the Desk plan',
    sections: [
      {
        heading: 'Useful Claude financial workflows',
        paragraphs: [
          'The strongest workflows keep Claude close to source material and firm templates. Examples include earnings-call review, sector summaries, DCF assumption memos, deck quality checks, KYC gap summaries, and reconciliation explanations.',
          'The practical goal is to move from blank page to reviewable draft faster while keeping assumptions and unresolved questions visible.',
        ],
      },
      {
        heading: 'Controls that make Claude usable',
        paragraphs: [
          'Every workflow should define source permissions, output status, reviewer role, prohibited actions, and escalation rules. Without those controls, even useful drafts can create operational risk.',
          'For sensitive workflows, choose strict controls, start with a small data set, and review logs before expanding.',
        ],
      },
      {
        heading: 'When to pay for a workspace',
        paragraphs: [
          'Pay for a workspace when the team has a real workflow, not just curiosity. The moment a reviewer can say “this draft saves me time and I know how to check it,” the pilot becomes worth funding.',
          'Desk annual is the default because it balances serious onboarding, review design, and cost discipline for the first rollout.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can Claude write financial models?',
        answer:
          'Claude can help draft, update, and audit model logic, but professionals must validate formulas, assumptions, source data, and final use before relying on the work.',
      },
      {
        question: 'Can Claude provide financial advice?',
        answer:
          'This site is for supervised work-product workflows. It does not provide investment, legal, tax, accounting, trading, or regulated financial advice.',
      },
    ],
  },
]

export function findKeywordPageByPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return keywordPages.find((page) => page.path === normalized) ?? null
}

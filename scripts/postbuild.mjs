import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const sourceIndexPath = path.join(distDir, 'index.html')
const keywordSourcePath = path.join(rootDir, 'src', 'content', 'keyword-pages.ts')
const origin = 'https://anthropicfinancial.space'
const siteName = 'Anthropic Financial Services Desk'
const defaultTitle = 'Anthropic Financial Services | Claude Agent Workspace'
const defaultDescription =
  'Launch supervised Claude financial-services agents for analyst work, modeling, fund operations, KYC review, and firm-controlled checkout.'

const sourceIndex = await fs.readFile(sourceIndexPath, 'utf8')
const keywordPages = await loadKeywordPages()
const indexablePaths = ['/', ...keywordPages.map((page) => page.path), '/pricing', '/privacy', '/terms']

await writeStaticPage('/', {
  title: defaultTitle,
  description: defaultDescription,
  robots: 'index,follow',
  canonicalPath: '/',
  rootHtml: buildHomePrerender(),
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteName,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '39.50',
        highPrice: '249.50',
        availability: 'https://schema.org/InStock',
      },
      description: defaultDescription,
      url: `${origin}/`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: `${origin}/`,
    },
  ],
})

for (const page of keywordPages) {
  const title = `${page.title} | ${siteName}`
  await writeStaticPage(page.path, {
    title,
    description: page.description,
    robots: 'index,follow',
    canonicalPath: page.path,
    rootHtml: buildKeywordPrerender(page),
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description: page.description,
        url: `${origin}${page.path}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: page.h1, item: `${origin}${page.path}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  })
}

await writeStaticPage('/pricing', {
  title: 'Anthropic Financial Services Pricing | Desk Annual Plan',
  description:
    'Compare Analyst, Desk, and Firm plans. Desk annual is selected by default and annual billing is 50% cheaper than the monthly run-rate.',
  robots: 'index,follow',
  canonicalPath: '/pricing',
  rootHtml: buildPricingPrerender(),
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: 'Anthropic Financial Services Desk pricing',
      url: `${origin}/pricing`,
    },
  ],
})

await writeStaticPage('/privacy', {
  title: `Privacy | ${siteName}`,
  description: 'How this site handles analytics, checkout metadata, support requests, and hosted payment interactions.',
  robots: 'index,follow',
  canonicalPath: '/privacy',
  rootHtml: buildLegalPrerender('Privacy Policy', 'This policy covers analytics, checkout, support, and site interactions.', [
    {
      heading: 'What we collect',
      paragraphs: [
        'We collect only information reasonably needed to operate the site, process checkout, prevent abuse, understand product usage, and respond to support.',
        'The public readiness console does not require private credentials, regulated financial data, non-public financial information, or production secrets.',
      ],
    },
    {
      heading: 'Providers and contact',
      paragraphs: [
        'Cloudflare supports hosting, routing, and security infrastructure. Creem supports hosted checkout and payment processing.',
        'Privacy and support requests should be sent to support@aigeamy.com.',
      ],
    },
    {
      heading: 'Security, retention, and choices',
      paragraphs: [
        'No internet service can be guaranteed perfectly secure. Users should not submit secrets, regulated data, or highly sensitive information through the public website.',
        'Information is retained only as long as reasonably needed for support, security, accounting, fraud prevention, dispute handling, and legal compliance.',
      ],
    },
  ]),
  structuredData: [],
})

await writeStaticPage('/terms', {
  title: `Terms | ${siteName}`,
  description: 'Terms for using this supervised financial-services agent workspace, pricing flow, and hosted checkout.',
  robots: 'index,follow',
  canonicalPath: '/terms',
  rootHtml: buildLegalPrerender('Terms of Service', 'These terms define responsibilities and limits for using the site.', [
    {
      heading: 'Independent service and no advice',
      paragraphs: [
        'This site is independent and is not affiliated with, endorsed by, or sponsored by Anthropic.',
        'The service does not provide legal, financial, tax, accounting, investment, trading, compliance, underwriting, onboarding, audit, or professional advice.',
      ],
    },
    {
      heading: 'AI output and user responsibility',
      paragraphs: [
        'AI-assisted output may be incomplete, inaccurate, insecure, unsuitable, infringing, outdated, or wrong.',
        'Users must independently review, test, validate, and approve output before relying on it.',
      ],
    },
    {
      heading: 'No warranties and liability limits',
      paragraphs: [
        'The service is provided as is and as available. To the maximum extent permitted by law, all express, implied, statutory, and other warranties are disclaimed.',
        'To the maximum extent permitted by law, total liability for any claim relating to the service is limited to the greater of 100 USD or the amount paid in the three months before the event giving rise to the claim.',
      ],
    },
    {
      heading: 'Disputes and contact',
      paragraphs: [
        'Before filing a claim, users agree to email support@aigeamy.com and give us 30 days to try to resolve the dispute informally.',
        'Support requests and dispute notices should be sent to support@aigeamy.com.',
      ],
    },
  ]),
  structuredData: [],
})

await writeStaticPage('/checkout/done', {
  title: `Checkout | ${siteName}`,
  description: 'Completing your hosted checkout.',
  robots: 'noindex,nofollow',
  canonicalPath: '/checkout/done',
  rootHtml: buildLegalPrerender('Finishing checkout...', 'You will return to the homepage when the hosted payment session closes.'),
  structuredData: [],
})

await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml())
await fs.writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt())

async function loadKeywordPages() {
  const source = await fs.readFile(keywordSourcePath, 'utf8')
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: false,
    },
  })
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString('base64')}`
  const mod = await import(moduleUrl)
  return mod.keywordPages
}

async function writeStaticPage(routePath, page) {
  const html = renderHtml(page)

  if (routePath === '/') {
    await fs.writeFile(sourceIndexPath, html)
    return
  }

  const outputDir = path.join(distDir, routePath.replace(/^\/+/, ''))
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'index.html'), html)
}

function renderHtml({ title, description, robots, canonicalPath, rootHtml, structuredData }) {
  const canonicalUrl = `${origin}${canonicalPath === '/' ? '/' : canonicalPath}`
  let html = sourceIndex
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'name', 'robots', robots)
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', canonicalUrl)
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertCanonical(html, canonicalUrl)
  html = html.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`)

  const graph =
    structuredData.length > 1
      ? { '@context': 'https://schema.org', '@graph': structuredData.map(stripContext) }
      : structuredData[0]

  if (graph) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="afs-prerender-schema">${JSON.stringify(graph)}</script>\n  </head>`,
    )
  }

  return html
}

function upsertMeta(html, attrName, attrValue, content) {
  const pattern = new RegExp(`<meta(?=[^>]*\\s${attrName}="${escapeRegExp(attrValue)}")[^>]*>`, 's')
  const replacement = `<meta ${attrName}="${escapeAttr(attrValue)}" content="${escapeAttr(content)}" />`
  if (pattern.test(html)) return html.replace(pattern, replacement)
  return html.replace('</head>', `    ${replacement}\n  </head>`)
}

function upsertCanonical(html, href) {
  const replacement = `<link rel="canonical" href="${escapeAttr(href)}" />`
  const pattern = /<link(?=[^>]*\srel="canonical")[^>]*>/s
  if (pattern.test(html)) return html.replace(pattern, replacement)
  return html.replace('</head>', `    ${replacement}\n  </head>`)
}

function stripContext(item) {
  const { '@context': _context, ...rest } = item
  return rest
}

function buildHomePrerender() {
  return `
    <main class="af-main">
      <section class="af-hero" id="workspace">
        <div class="af-hero-copy">
          <p class="af-eyebrow">Anthropic financial services workspace</p>
          <h1>Launch Claude finance agents that reviewers can actually approve.</h1>
          <p class="af-lede">Convert the public Anthropic financial-services reference project into a paid, supervised SaaS rollout for modeling, research, fund operations, and KYC work.</p>
          <p><a class="af-btn af-btn-primary" href="/pricing">Choose Desk annual</a></p>
          <p class="af-microcopy">Desk annual is selected by default. Annual saves 50% versus monthly.</p>
        </div>
      </section>
    </main>
    <footer class="af-footer">
      <div class="af-footer-inner">
        <span>Anthropic Financial Services Desk</span>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="mailto:support@aigeamy.com">support@aigeamy.com</a>
      </div>
    </footer>`
}

function buildPricingPrerender() {
  return `
    <main class="af-main">
      <section class="af-page-hero">
        <p class="af-eyebrow">Pricing</p>
        <h1>Start with the Desk annual plan, then expand only when the workflow proves itself.</h1>
        <p class="af-lede">Desk annual is selected by default and annual billing is 50% cheaper than monthly.</p>
      </section>
    </main>`
}

function buildKeywordPrerender(page) {
  const sections = page.sections
    .map(
      (section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
          ${section.bullets?.length ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>` : ''}
        </section>`,
    )
    .join('\n')
  const faqs = page.faqs
    .map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`)
    .join('\n')

  return `
    <main class="af-main">
      <article class="af-article">
        <a href="/">Anthropic Financial Services</a>
        <p class="af-eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="af-lede">${escapeHtml(page.lede)}</p>
        <p>${escapeHtml(page.intent)}</p>
        ${sections}
        <section>
          <h2>Common questions</h2>
          ${faqs}
        </section>
        <p><a class="af-btn af-btn-primary" href="/pricing">${escapeHtml(page.ctaLabel)}</a></p>
      </article>
    </main>`
}

function buildLegalPrerender(title, description, sections = []) {
  const sectionHtml = sections
    .map(
      (section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
        </section>`,
    )
    .join('\n')

  return `
    <main class="af-main">
      <article class="af-article">
        <a href="/">Anthropic Financial Services</a>
        <h1>${escapeHtml(title)}</h1>
        <p class="af-lede">${escapeHtml(description)}</p>
        ${sectionHtml}
      </article>
    </main>`
}

function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = indexablePaths
    .map((routePath) => {
      const priority =
        routePath === '/' ? '1.0' : routePath === '/privacy' || routePath === '/terms' ? '0.4' : routePath === '/pricing' ? '0.9' : '0.78'
      const changefreq = routePath === '/' || routePath === '/pricing' ? 'weekly' : 'monthly'
      return `  <url>
    <loc>${origin}${routePath === '/' ? '/' : routePath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout/done
Sitemap: ${origin}/sitemap.xml
`
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;')
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

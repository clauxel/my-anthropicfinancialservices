# Anthropic Financial Services Desk

Conversion-focused SaaS site for teams evaluating supervised Claude financial-services agents based on the public Anthropic financial-services reference repository.

## Features

- Interactive first-screen readiness console for finance-agent workflow scoping.
- Natural keyword resource pages for implementation, plugins, demos, reviews, jobs, and events.
- Pricing page with Desk annual selected by default and annual billing at 50% off monthly.
- Centered Creem hosted-checkout popup with the original page kept open and blurred.
- Cloudflare Worker API for runtime, analytics, sitemap, robots, and checkout.
- Cloudflare Pages compatible static build and Pages Functions API fallback.

## Development

```bash
npm install
npm run dev
npm run build
```

## Deployment

```bash
npm run cloudflare:deploy
npm run pages:deploy
```

The production payment secret is expected as `API_PROD_KEY` in Cloudflare. Do not commit payment keys or account credentials.

## Related Project

- [OpenHuman Online](https://openhuman.online/?utm_source=github&utm_medium=readme&utm_campaign=openhuman_public_repos&utm_content=my_anthropicfinancialservices) helps teams turn source material, notes, and meetings into an inspectable AI memory tree for human-reviewed workflows.

# Vegas Vetted

Local Las Vegas guide built with [Astro](https://astro.build). Static HTML, ~2.5 KB of JS total, structured data on every page.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Where things live

| What | Where |
| --- | --- |
| Brand, domain, newsletter settings | `src/site.config.ts` |
| Categories and neighborhoods | `src/data/taxonomy.ts` |
| Businesses (one Markdown file each) | `src/content/places/*.md` |
| Best-of lists | `src/content/lists/*.md` |
| Styles / design tokens | `src/styles/global.css` |

## Adding a business

Create `src/content/places/<slug>.md`. Frontmatter holds the verified facts; the body is your take:

```md
---
name: "Business Name"
category: breakfast        # slug from taxonomy.ts
area: henderson            # slug from taxonomy.ts
price: "$$"
tags: ["Locals' pick", "Open early"]
address: "123 Example St"
zip: "89052"
phone: "(702) 555-0100"
website: "https://example.com"
hours: "Mon–Sun, 6am–2pm"
verified: 2026-11-06
---

Your 2–4 sentence take from a real visit or call.
```

## SEO rules built in

- `sample: true` entries are noindexed and excluded from the sitemap. **Delete the `sample-*` files before launch.**
- Hub and area×category pages are noindexed until they have `minListingsToIndex` (default 8) real listings, to avoid thin/doorway pages.
- JSON-LD: `ItemList` + `FAQPage` on lists, `LocalBusiness` subtypes on listings, `BreadcrumbList` everywhere.
- Newsletter slide-in only opens after 50% scroll, 30s, or desktop exit intent (never on arrival, so it is not an intrusive interstitial).

## Newsletter

Set `newsletter.action` in `src/site.config.ts` to your beehiiv or Kit form endpoint.

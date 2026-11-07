import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, AREAS } from './data/taxonomy';

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];
const areaSlugs = AREAS.map((a) => a.slug) as [string, ...string[]];

// One Markdown file per business. Frontmatter = verified facts; body = your take.
const places = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/places' }),
  schema: z.object({
    name: z.string(),
    category: z.enum(categorySlugs),
    area: z.enum(areaSlugs),
    price: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
    tags: z.array(z.string()).default([]),
    address: z.string().optional(),
    city: z.string().default('Las Vegas'),
    zip: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    hours: z.string().optional(),
    goodFor: z.array(z.string()).default([]),
    license: z.string().optional(), // e.g. NV contractor license #
    geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
    image: z.string().optional(), // e.g. /images/babystacks-cafe.jpg (put the file in public/images/)
    imageAlt: z.string().optional(),
    imageCredit: z.string().optional(), // e.g. "Photo courtesy of BabyStacks Cafe"
    // Extra locations for multi-location businesses (main location = the fields above)
    locations: z
      .array(z.object({ label: z.string(), area: z.enum(areaSlugs), address: z.string(), city: z.string().default('Las Vegas'), zip: z.string().optional(), phone: z.string().optional(), hours: z.string().optional(), note: z.string().optional() }))
      .default([]),
    // true once the body is your own first-hand take (visit or call). false = researched summary.
    firstHand: z.boolean().default(false),
    verified: z.coerce.date(), // date you last checked the facts
    sample: z.boolean().default(false), // placeholder entries are noindexed
  }),
});

// Best-of lists. Order of `items` is the ranking.
const lists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lists' }),
  schema: z.object({
    title: z.string(), // H1, matches the search: "The 15 Best Breakfast Spots in Las Vegas"
    seoTitle: z.string().optional(),
    description: z.string(),
    category: z.enum(categorySlugs),
    topPick: z.string(), // one-sentence answer shown first
    checked: z.coerce.date(),
    items: z.array(reference('places')),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    related: z.array(z.string()).default([]), // list slugs
  }),
});

export const collections = { places, lists };

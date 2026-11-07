// One place to change the brand, domain and newsletter settings.
export const SITE = {
  name: 'Vegas Vetted',
  // Logo is rendered as two words, the second in the accent color
  logo: ['Vegas', 'Vetted'] as const,
  url: 'https://vegasvetted.com', // TODO: set to your real domain
  tagline: 'The places locals actually use, checked by a local.',
  description:
    'Hand-picked Las Vegas restaurants and trusted local pros across the Valley. Every listing verified and dated. No paid rankings.',
  author: 'Michael',
  locale: 'en_US',
  newsletter: {
    name: "The Locals' List",
    cadence: 'Every Thursday',
    pitch: '5 new spots, 1 deal and 1 event each week.',
    leadMagnet: '25 Off-Strip Spots Locals Actually Go To',
    // Paste your beehiiv / Kit form action URL here. Empty = forms show but do not submit.
    action: '',
  },
  // Area x category pages with fewer listings than this are noindexed (thin/doorway risk)
  minListingsToIndex: 8,
} as const;

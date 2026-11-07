import type { CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';
import { categoryBySlug, areaBySlug } from '../data/taxonomy';

export const abs = (path: string) => new URL(path, SITE.url).toString();
export const placeUrl = (p: CollectionEntry<'places'>) => `/biz/${p.id}/`;
export const listUrl = (l: CollectionEntry<'lists'>) => `/best/${l.id}/`;

export function localBusiness(p: CollectionEntry<'places'>) {
  const d = p.data;
  const cat = categoryBySlug(d.category);
  return {
    '@context': 'https://schema.org',
    '@type': cat?.schemaType ?? 'LocalBusiness',
    name: d.name,
    url: abs(placeUrl(p)),
    ...(d.image ? { image: abs(d.image) } : {}),
    ...(d.phone ? { telephone: d.phone } : {}),
    ...(d.price ? { priceRange: d.price } : {}),
    ...(d.website ? { sameAs: [d.website] } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(d.address ? { streetAddress: d.address } : {}),
      addressLocality: d.city,
      addressRegion: 'NV',
      ...(d.zip ? { postalCode: d.zip } : {}),
      addressCountry: 'US',
    },
    ...(d.geo ? { geo: { '@type': 'GeoCoordinates', latitude: d.geo.lat, longitude: d.geo.lng } } : {}),
    areaServed: areaBySlug(d.area)?.name,
  };
}

export function itemList(name: string, places: CollectionEntry<'places'>[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: places.length,
    itemListElement: places.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(placeUrl(p)),
      name: p.data.name,
    })),
  };
}

export function faqPage(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function breadcrumbs(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.href) })),
  };
}

export const monthYear = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export const mapsUrl = (p: CollectionEntry<'places'>) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.data.name} ${p.data.address ?? ''} ${p.data.city} NV`)}`;

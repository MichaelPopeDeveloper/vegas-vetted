// Categories and areas. Slugs must be unique across BOTH lists (they share the /[hub]/ URL space).
export type Category = {
  slug: string;
  name: string; // singular label, e.g. "Plumber"
  plural: string; // "Plumbers"
  group: 'food' | 'services' | 'things-to-do';
  schemaType: string; // schema.org LocalBusiness subtype
  intro: string;
};

export type Area = { slug: string; name: string; intro: string };

export const CATEGORIES: Category[] = [
  { slug: 'breakfast', name: 'Breakfast spot', plural: 'Breakfast Spots', group: 'food', schemaType: 'Restaurant', intro: 'Where locals actually go for breakfast, from early-opening diners to off-Strip favorites.' },
  { slug: 'brunch', name: 'Brunch spot', plural: 'Brunch Spots', group: 'food', schemaType: 'Restaurant', intro: 'Weekend brunch across the Valley, checked for wait times, prices and who each spot suits.' },
  { slug: 'restaurants', name: 'Restaurant', plural: 'Restaurants', group: 'food', schemaType: 'Restaurant', intro: 'Restaurants worth the drive, picked and verified by a local.' },
  { slug: 'korean-bbq', name: 'Korean BBQ spot', plural: 'Korean BBQ Restaurants', group: 'food', schemaType: 'Restaurant', intro: 'All-you-can-eat and à la carte Korean BBQ across the Valley, from Spring Mountain Road to the Strip.' },
  { slug: 'coffee', name: 'Coffee & tea shop', plural: 'Coffee & Tea Shops', group: 'food', schemaType: 'CafeOrCoffeeShop', intro: 'Coffee shops, tea bars and boba spots locals actually go to.' },
  { slug: 'plumbers', name: 'Plumber', plural: 'Plumbers', group: 'services', schemaType: 'Plumber', intro: 'Licensed Las Vegas plumbers, checked against the Nevada State Contractors Board.' },
  { slug: 'locksmiths', name: 'Locksmith', plural: 'Locksmiths', group: 'services', schemaType: 'Locksmith', intro: 'Local locksmiths for homes, cars and businesses, including 24/7 options.' },
  { slug: 'house-cleaning', name: 'House cleaner', plural: 'House Cleaning Services', group: 'services', schemaType: 'HomeAndConstructionBusiness', intro: 'House cleaning services across Las Vegas and Henderson.' },
  { slug: 'barbers', name: 'Barber', plural: 'Barbers', group: 'services', schemaType: 'HairSalon', intro: 'Barbershops locals trust, from classic cuts to fades.' },
  { slug: 'property-management', name: 'Property manager', plural: 'Property Management Companies', group: 'services', schemaType: 'RealEstateAgent', intro: 'Property management companies for Las Vegas owners and investors.' },
];

export const AREAS: Area[] = [
  { slug: 'henderson', name: 'Henderson', intro: 'Henderson picks: restaurants, services and things to do southeast of the Strip.' },
  { slug: 'summerlin', name: 'Summerlin', intro: 'Summerlin picks on the west side of the Valley.' },
  { slug: 'downtown', name: 'Downtown', intro: 'Downtown Las Vegas and the Arts District.' },
  { slug: 'chinatown', name: 'Chinatown', intro: 'Spring Mountain Road and the Chinatown corridor.' },
  { slug: 'spring-valley', name: 'Spring Valley', intro: 'Spring Valley and the southwest.' },
  { slug: 'north-las-vegas', name: 'North Las Vegas', intro: 'North Las Vegas and Aliante.' },
  { slug: 'centennial-hills', name: 'Centennial Hills', intro: 'Centennial Hills and the northwest Valley.' },
  { slug: 'southwest', name: 'Southwest', intro: 'The southwest Valley, from Blue Diamond Road to Mountain\'s Edge.' },
  { slug: 'the-strip', name: 'The Strip', intro: 'On and just off Las Vegas Boulevard, from Sahara to the south Strip.' },
  { slug: 'westside', name: 'Westside', intro: 'Charleston Heights and the west side, between downtown and Summerlin.' },
];

export const categoryBySlug = (s: string) => CATEGORIES.find((c) => c.slug === s);
// A place belongs to an area if its main location or any extra location is there
export const placeAreas = (d: { area: string; locations?: { area: string }[] }) => [d.area, ...(d.locations ?? []).map((l) => l.area)];

export const areaBySlug = (s: string) => AREAS.find((a) => a.slug === s);

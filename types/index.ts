export type ContentFile =
  | 'menu.json'
  | 'pricing.json'
  | 'gallery.json'
  | 'services.json'
  | 'site.json';

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface GalleryItem {
  id: number;
  img: string;
  title: string;
  type: 'Food' | 'Venue';
}

export interface ServiceItem {
  id: string;
  title: string;
  titleEm: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  link: string;
}

export interface PricingPackage {
  id: string;
  tag: string;
  title: string;
  description: string;
  startingFrom: string;
  startingLabel: string;
  features: string[];
  ctaLabel: string;
  ctaLink: string;
  variant: 'light' | 'dark';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HourItem {
  label: string;
  value: string;
  note?: string;
  highlight: boolean;
}

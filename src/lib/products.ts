import productsData from '@/content/products.json';

export const ALL_CATEGORIES = [
  'Fiction & Literature',
  'Romance',
  'Mystery & Thriller',
  'Science Fiction & Fantasy',
  'Horror',
  "Children's Books",
  'Biography & Memoir',
  'Self-Help & Personal Development',
  'Business & Economics',
  'History',
  'Religion & Spirituality',
  'Health & Wellness',
  'Cooking & Food',
  'Poetry',
  'Science & Nature',
  'Travel',
  'Politics & Social Science',
  'Education & Reference',
  'Uncategorized',
];

export interface Product {
  slug: string;
  title: string;
  imageUrl: string;
  categories?: string[];
}

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getProduct(slug: string): Product | undefined {
  return (productsData as Product[]).find((p) => p.slug === slug);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

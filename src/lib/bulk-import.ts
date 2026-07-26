import { slugify } from './products';

export interface ParsedProduct {
  title: string;
  imageUrl: string;
  slug: string;
}

const URL_REGEX = /https?:\/\/[^\s,|]+/i;

export function parseBulkInput(input: string): ParsedProduct[] {
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines
    .map((line) => {
      // Split on comma or pipe
      const parts = line.split(/[,|]/).map((p) => p.trim()).filter(Boolean);

      let title = '';
      let imageUrl = '';

      for (const part of parts) {
        if (URL_REGEX.test(part)) {
          imageUrl = part.match(URL_REGEX)![0];
        } else if (!title) {
          title = part;
        }
      }

      // If line has no separator, try to extract URL from full line
      if (!imageUrl && !title) {
        const urlMatch = line.match(URL_REGEX);
        if (urlMatch) {
          imageUrl = urlMatch[0];
          title = line.replace(urlMatch[0], '').trim();
        } else {
          title = line;
        }
      }

      if (!title) return null;

      return {
        title,
        imageUrl: imageUrl || '',
        slug: slugify(title),
      };
    })
    .filter((item): item is ParsedProduct => item !== null);
}

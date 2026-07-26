import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_FILE = path.join(__dirname, '../src/content/products.json');

const words = ['Dragon', 'Wizard', 'Murder', 'Startup', 'Fitness', 'Cooking', 'History', 'Love Story', 'Quantum', 'Shadow', 'Journey', 'Space', 'Mystery'];

function generateRandomTitle(index) {
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  return `The ${w1} of ${w2} Volume ${index}`;
}

const existing = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));

for (let i = 1; i <= 1500; i++) {
  const title = generateRandomTitle(i);
  existing.push({
    slug: `dummy-book-${i}`,
    title: title,
    imageUrl: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
    categories: []
  });
}

fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(existing, null, 2));
console.log('Added 1500 dummy products.');

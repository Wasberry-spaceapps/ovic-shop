import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_FILE = path.join(__dirname, '../src/content/products.json');
const OVERRIDES_FILE = path.join(__dirname, 'category-overrides.json');

// Dictionary of keywords to categories
// Format: { category: { strong: [...], weak: [...] } }
const dictionary = {
  'Cooking & Food': { strong: ['cookbook', 'recipes', 'culinary', 'baking', 'cooking', 'chef', 'food'], weak: ['diet'] },
  "Children's Books": { strong: ['picture book', 'bedtime story', 'nursery rhyme', 'toddler', 'ages 3-5', 'children'], weak: ['kids', 'baby'] },
  'Self-Help & Personal Development': { strong: ['self-help', 'habits', 'mindset', 'productivity', 'self-improvement', 'success'], weak: ['guide', 'life', 'how to'] },
  'Business & Economics': { strong: ['entrepreneur', 'startup', 'leadership', 'marketing', 'investing', 'economics', 'finance', 'business'], weak: ['money', 'management'] },
  'Mystery & Thriller': { strong: ['murder', 'detective', 'thriller', 'whodunit', 'mystery', 'suspense'], weak: ['crime', 'suspect', 'killer', 'death'] },
  'Science Fiction & Fantasy': { strong: ['dragon', 'wizard', 'galaxy', 'sorcery', 'spaceship', 'sci-fi', 'fantasy', 'alien', 'magic'], weak: ['kingdom', 'space', 'sword', 'future'] },
  'Horror': { strong: ['haunted', 'zombie', 'vampire', 'demon', 'horror', 'ghost', 'terror'], weak: ['nightmare', 'dark', 'scary', 'blood'] },
  'Romance': { strong: ['romance', 'falling in love'], weak: ['love story', 'wedding', 'heart', 'kiss', 'lovers', 'love'] },
  'Biography & Memoir': { strong: ['memoir', 'autobiography', 'the life of', 'biography'], weak: ['diary', 'journey', 'life'] },
  'History': { strong: ['historical', 'empire', 'revolution', 'dynasty', 'history', 'world war'], weak: ['war', 'ancient', 'century', 'past'] },
  'Religion & Spirituality': { strong: ['bible', 'quran', 'prayer', 'scripture', 'religion', 'buddhism', 'christianity', 'spirituality', 'spiritual'], weak: ['faith', 'god', 'soul'] },
  'Health & Wellness': { strong: ['nutrition', 'fitness', 'wellness', 'yoga', 'health', 'healing', 'meditation'], weak: ['body', 'mind'] },
  'Poetry': { strong: ['poems', 'poetry', 'sonnets', 'verses', 'anthology'], weak: ['rhyme'] },
  'Science & Nature': { strong: ['physics', 'biology', 'climate', 'evolution', 'science', 'nature', 'astronomy', 'universe'], weak: ['earth', 'animals', 'plants'] },
  'Travel': { strong: ['travel guide', 'journey through', 'wanderlust', 'travel'], weak: ['guide', 'world', 'exploring'] },
  'Politics & Social Science': { strong: ['democracy', 'government policy', 'social justice', 'politics', 'sociology', 'political'], weak: ['society', 'rights', 'law'] },
  'Education & Reference': { strong: ['textbook', 'encyclopedia', 'for dummies', 'study guide', 'handbook', 'dictionary'], weak: ['reference', 'learn', 'guide'] },
  'Fiction & Literature': { strong: ['novel', 'fiction', 'literature', 'classic'], weak: ['tale', 'story', 'prose'] }
};

// We want to escape string for regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compileRegex(words) {
  if (!words || words.length === 0) return null;
  // Match word boundaries, case-insensitive
  const pattern = words.map(w => `\\b${escapeRegExp(w)}\\b`).join('|');
  return new RegExp(`(${pattern})`, 'i');
}

const compiledDict = {};
for (const [category, words] of Object.entries(dictionary)) {
  compiledDict[category] = {
    strong: compileRegex(words.strong),
    weak: compileRegex(words.weak),
  };
}

function categorizeProduct(title) {
  const categories = [];

  for (const [category, regexes] of Object.entries(compiledDict)) {
    let score = 0;

    if (regexes.strong) {
      const strongHits = (title.match(new RegExp(regexes.strong, 'ig')) || []).length;
      if (strongHits > 0) score += 2; // A single strong hit assigns it
    }

    if (regexes.weak) {
      const weakHits = (title.match(new RegExp(regexes.weak, 'ig')) || []).length;
      score += weakHits; 
    }

    // Require either one strong hit (score >= 2), or two or more weak hits (score >= 2)
    if (score >= 2) {
      categories.push(category);
    }
  }

  if (categories.length === 0) {
    return ['Uncategorized'];
  }

  return categories;
}

async function main() {
  const overrides = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'));
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));

  const stats = { Uncategorized: 0 };
  const uncategorizedList = [];

  const updatedProducts = products.map(product => {
    let cats = overrides[product.title];
    if (!cats) {
      cats = categorizeProduct(product.title);
    }

    product.categories = cats;

    // Stats
    for (const cat of cats) {
      stats[cat] = (stats[cat] || 0) + 1;
    }
    if (cats.includes('Uncategorized')) {
      uncategorizedList.push(product.title);
    }

    return product;
  });

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updatedProducts, null, 2));

  console.log('=== Categorization Report ===');
  console.log(`Total Products: ${updatedProducts.length}`);
  console.log('Category Distribution:');
  for (const [cat, count] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
    console.log(`  - ${cat}: ${count}`);
  }

  console.log('\n=== Uncategorized Titles (Needs Manual Review) ===');
  console.log(`Note: Title-only classification isn't perfect. This list flags titles that missed the automatic regex rules.`);
  uncategorizedList.forEach(t => console.log(`  - ${t}`));
}

main().catch(console.error);

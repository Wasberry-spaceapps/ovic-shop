// Cloudflare Worker — routes ovicbookstore.com traffic
// Deploy this as a Worker and attach it to your domain's route.
//
// Replace the placeholder URLs below with your actual GitHub Pages URLs:
//   SHOP_ORIGIN  → your shop repo's Pages URL (e.g. https://username.github.io/ovic-shop)
//   BLOG_ORIGIN  → your blog repo's Pages URL (e.g. https://username.github.io/ovic-blog)

const SHOP_ORIGIN = 'https://YOUR_USERNAME.github.io/ovic-shop';
const BLOG_ORIGIN = 'https://YOUR_USERNAME.github.io/ovic-blog';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    let targetOrigin;

    if (path === '/blog' || path.startsWith('/blog/')) {
      // Route blog traffic to the blog's GitHub Pages
      targetOrigin = BLOG_ORIGIN;
    } else {
      // Everything else goes to the shop
      targetOrigin = SHOP_ORIGIN;
    }

    const targetUrl = new URL(path + url.search, targetOrigin);

    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow',
    });

    // Clone response and pass through
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Routed-By', 'ovic-domain-router');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};

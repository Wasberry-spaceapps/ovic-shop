# Domain Setup Guide — ovicbookstore.com

This guide walks through the one-time setup to serve both the **shop** (this repo) and the **blog** (separate repo) under a single custom domain using Cloudflare Workers.

## Architecture

```
ovicbookstore.com/*        → Shop (this repo, GitHub Pages)
ovicbookstore.com/blog/*   → Blog (separate repo, GitHub Pages)
```

Cloudflare sits in front of the domain and routes requests to the correct GitHub Pages origin based on the URL path.

## Step 1: Move DNS to Cloudflare

1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Click **"Add a Site"** and enter `ovicbookstore.com`.
3. Select the **Free** plan.
4. Cloudflare will scan your existing DNS records. Verify they look correct.
5. Cloudflare will provide two nameservers (e.g. `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`).
6. Log into **Namecheap** → Domain List → Manage → **Nameservers** → select "Custom DNS".
7. Paste the two Cloudflare nameservers and save.
8. Back in Cloudflare, click **"Done, check nameservers"**. Propagation takes up to 24 hours.

## Step 2: Create the Cloudflare Worker

1. In Cloudflare dashboard, go to **Workers & Pages** → **Create**.
2. Name it `ovic-router` and click **Deploy**.
3. Click **"Edit Code"** and paste the contents of `infra/domain-router.js`.
4. **Update the two origin URLs** at the top of the script with your actual GitHub Pages URLs:
   - `SHOP_ORIGIN`: `https://YOUR_USERNAME.github.io/ovic-shop`
   - `BLOG_ORIGIN`: `https://YOUR_USERNAME.github.io/ovic-blog`
5. Click **Save and Deploy**.

## Step 3: Attach the Worker to Your Domain

1. Go to your `ovicbookstore.com` zone in Cloudflare.
2. Navigate to **Workers Routes** in the sidebar.
3. Click **Add Route**.
4. Set **Route**: `*ovicbookstore.com/*`
5. Select Worker: `ovic-router`.
6. Click **Save**.

## Step 4: Enable GitHub Pages on Both Repos

1. In each GitHub repo (shop + blog), go to **Settings** → **Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` to trigger the first deployment.

## Verification

- Visit `ovicbookstore.com` → should show the shop.
- Visit `ovicbookstore.com/blog/` → should show the blog.
- Check the `X-Routed-By: ovic-domain-router` response header to confirm the Worker is active.

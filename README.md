# Ovic Bookstore — The 20-Minute Master Guide

Hi! Because you are short on time and don't have Git installed, we've designed this entire process to be "noob-simple" and done entirely through your web browser. 

You do **not** need to use the command line, and you do **not** need to install anything on your computer.

Follow these 4 simple steps to get your Shop and Blog live on your custom domain, and set up your Admin Panel.

---

## STEP 1: Upload Your Code (5 Minutes)
We will upload your folders directly to GitHub's website.

1. Go to [GitHub.com](https://github.com) and create a free account if you don't have one.
2. Click the **+** icon in the top right and select **New repository**.
3. Name it `ovic-shop`. Make it **Public**. Check the box that says **"Add a README file"** (this is required to upload files via the web).
4. Click **Create repository**.
5. On the next page, click **Add file** > **Upload files**.
6. Drag and drop ALL the files and folders from your computer's `ovic-shop` folder into the browser window.
7. Wait for the upload to finish, then click **Commit changes**.
8. **Repeat this exact process** for your `ovic-blog` folder (name the repo `ovic-blog`).

*Boom! Your code is securely in the cloud.*

---

## STEP 2: Turn on GitHub Pages (2 Minutes)
Now we tell GitHub to turn those code folders into live websites.

1. Go to your `ovic-shop` repository on GitHub.
2. Click **Settings** (the gear icon near the top).
3. On the left menu, click **Pages**.
4. Under "Build and deployment" > "Source", click the dropdown and select **GitHub Actions**.
5. Do exactly the same thing for your `ovic-blog` repository.

GitHub is now building your sites in the background. In about 2 minutes, they will be live at `https://YOUR_USERNAME.github.io/ovic-shop` and `https://YOUR_USERNAME.github.io/ovic-blog`.

---

## STEP 3: Setup the Admin Panel Token (3 Minutes)
Your website doesn't use a database—it saves edits directly to GitHub! We need to give your browser a "key" to do this.

1. On GitHub, click your profile picture in the top right and go to **Settings**.
2. Scroll to the very bottom left and click **Developer settings**.
3. Click **Personal access tokens** > **Fine-grained tokens**.
4. Click **Generate new token**.
   - **Name**: Ovic Admin
   - **Expiration**: Set to 1 year.
   - **Repository access**: "Only select repositories" -> Choose `ovic-shop` and `ovic-blog`.
   - **Permissions**: Click "Repository permissions". Find **Contents** and change it to **Read and Write**.
5. Click **Generate token**.
6. **COPY THE TOKEN IMMEDIATELY** (it looks like a long string of random letters/numbers).

Now, go to your live shop website: `https://YOUR_USERNAME.github.io/ovic-shop/admin`. 
Paste your token into the box, type in your GitHub username, and click Save. You can now edit your store!

---

## STEP 4: The Custom Domain Router (10 Minutes)
To make your domain (`ovicbookstore.com`) show the Shop on the main page, and the Blog on `/blog`, we use a free tool called Cloudflare.

1. Go to your domain registrar (like Namecheap or GoDaddy) and change your Nameservers to point to **Cloudflare**. (Create a free Cloudflare account if needed).
2. Once Cloudflare is active, go to your Cloudflare dashboard and click **DNS**.
3. Add a dummy "A" record: Name = `@`, IPv4 = `192.0.2.1`. Make sure the orange cloud (Proxy status) is turned ON.
4. Now, go back to the main Cloudflare menu (left side) and click **Workers & Pages** > **Overview**.
5. Click **Create Application** > **Create Worker**. Name it `ovic-router` and deploy it.
6. Click **Edit Code**, and paste this exact text:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const SHOP_URL = 'https://YOUR_USERNAME.github.io/ovic-shop';
    const BLOG_URL = 'https://YOUR_USERNAME.github.io/ovic-blog';

    if (path.startsWith('/blog')) {
      const targetUrl = new URL(request.url.replace(url.origin, BLOG_URL));
      return await fetch(targetUrl, request);
    }

    const targetUrl = new URL(request.url.replace(url.origin, SHOP_URL));
    return await fetch(targetUrl, request);
  }
};
```
*(Make sure you change YOUR_USERNAME in the code above!)*

7. Click **Save and Deploy**.
8. Finally, go back to your domain's dashboard in Cloudflare. Click **Workers Routes** on the left.
9. Click **Add route**. Route = `*ovicbookstore.com/*`, Worker = `ovic-router`. Click Save.

**YOU ARE DONE!** 
- `ovicbookstore.com` goes to your shop.
- `ovicbookstore.com/blog` goes to your blog.
- `ovicbookstore.com/admin` lets you add books.
- `ovicbookstore.com/social-frames/index.html` opens your secret social media frame generator tool.

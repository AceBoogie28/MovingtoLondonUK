# movingtolondonuk.com — deploy & update guide

This is a static site (plain HTML/CSS/JS, no build step). A git repo has already been initialized in this folder with one commit. Recommended host: **Netlify** — free tier, connects straight to GitHub, and its built-in Forms feature makes the checklist and contact forms work with zero backend code.

## 1. Push to GitHub

1. Create a new empty repo on GitHub (e.g. `movingtolondonuk`) — don't initialize it with a README, since this folder already has one.
2. From this folder, run:
   ```
   git remote add origin https://github.com/YOUR-USERNAME/movingtolondonuk.git
   git branch -M main
   git push -u origin main
   ```
   (If `git init` wasn't already run for some reason, run `git init && git add -A && git commit -m "Initial site"` first.)

## 2. Connect Netlify

1. Sign up / log in at netlify.com (free tier is fine).
2. "Add new site" → "Import an existing project" → connect your GitHub account → select the `movingtolondonuk` repo.
3. Build settings: leave the build command blank and set the publish directory to `.` (this is a static site — nothing to build). Deploy.
4. You'll get a live `*.netlify.app` URL immediately. Forms are auto-detected on deploy because of the `data-netlify="true"` attribute already in `contact.html` and `resources/relocation-checklist.html` — no extra config needed. Check Site settings → Forms after your first deploy to see submissions, and set up email notifications there if you want an alert per lead.

## 3. Point movingtolondonuk.com at it

In Netlify: Site settings → Domain management → Add a custom domain → enter `movingtolondonuk.com`.

Then at your domain registrar (wherever movingtolondonuk.com is registered), update DNS. Netlify will show you one of two options:
- **Easiest:** point your domain's nameservers at Netlify DNS (Netlify manages everything, including `www` and SSL, automatically).
- **If you want to keep your current DNS provider:** add an `A` record for the root domain pointing to Netlify's load balancer IP, and a `CNAME` for `www` pointing to your `*.netlify.app` address. Netlify shows you the exact values to enter once you add the domain.

SSL (https) is issued automatically by Netlify within a few minutes of DNS propagating — no extra steps.

## 4. Ongoing updates (headers, content, new guide pages)

Every page shares the same header/nav and footer markup, copy-pasted at the top and bottom of each HTML file (this is a static scaffold, not a templating system — see note below on when that's worth changing).

**To update something everywhere** (e.g. a nav link, footer text, phone number): it currently has to be changed in each HTML file individually. Ask me to do a find-and-replace across all files, or use your editor's project-wide find/replace.

**To add a new guide or neighborhood page:** copy the closest existing example (e.g. `guides/cost-of-living.html` or `neighborhoods/clapham.html`), rename it, update the content and `<title>`/meta description, and add a card link to it from the relevant hub page (`guides/index.html` or `neighborhoods/index.html`) and from `index.html`'s featured section if it should appear there.

**To publish any change:**
```
git add -A
git commit -m "Describe what changed"
git push
```
Netlify redeploys automatically within about 30 seconds of the push — no manual upload step.

**If you'd rather not touch git/code directly**, you can also just tell me what changed and I'll edit the files and push for you — I have the same file access either way.

## When to consider upgrading past this scaffold

If you get to the point of publishing guide pages as often as you publish videos, the copy-paste-a-page workflow will start to feel repetitive. At that point it's worth moving to a static site generator (e.g. Eleventy/Astro) or a headless CMS, so header/footer live in one shared template and new guides are just a content file, not a full HTML page. Worth revisiting once movingtolondonuk.com's content cadence is established — not needed for launch.

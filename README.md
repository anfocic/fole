# Andrej Focic

Personal site and blog built with Astro.

## Commands

Run everything from `/Users/fole/Desktop/apps/fole`:

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run new-post -- "Post Title"` | Create a new draft post file |
| `npm run publish -- post-slug` | Flip a draft post to published |

## Writing Posts

Posts live in `/Users/fole/Desktop/apps/fole/src/content/blog`.

1. Run `npm run new-post -- "Your Post Title"`.
2. Write the post in the generated file under `src/content/blog/`.
3. Preview it locally with `npm run dev`.
4. Publish it with `npm run publish -- your-post-title`.
5. Run `npm run build`.
6. Deploy the generated site.

The generator:

- Creates `src/content/blog/<slug>.md`
- Fills in the title, slug, and today’s date
- Creates an asset folder at `public/blog/<slug>/`

Draft behavior:

- Drafts are visible locally while running `npm run dev`
- Drafts stay out of the production blog index, RSS feed, sitemap, analytics events, and generated production routes

Supported frontmatter:

```yaml
title: "Post title"
description: "One-sentence summary"
date: 2026-03-24
updatedDate: 2026-03-25
draft: false
tags:
  - astro
  - blogging
author: "Andrej Focic"
slug: custom-post-slug
canonicalURL: https://fole.dev/blog/custom-post-slug/
coverImage: /social-card.svg
```

Notes:

- `draft` defaults to `false` in the schema, but the post template and `new-post` command create drafts by default.
- `slug` is optional. If omitted, Astro uses the file path.
- `updatedDate`, `canonicalURL`, and `coverImage` are optional.
- Cover images are easiest to manage in `public/blog/<slug>/`.

## Publishing Baseline

The blog now includes:

- Canonical URLs, Open Graph metadata, and Twitter card metadata.
- `/rss.xml`, `/sitemap.xml`, and `/robots.txt`.
- A default social card at `/social-card.svg`.

Set the site URL with `SITE_URL`. If you do nothing, the build defaults to `https://fole.dev`.

## Analytics

Analytics is wired for Plausible because it works well on a static site and does not require adding a backend here.

Create a local `.env` file from `.env.example` and set:

```bash
SITE_URL=https://fole.dev
PUBLIC_PLAUSIBLE_DOMAIN=fole.dev
PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io
```

What gets tracked:

- Standard Plausible pageviews for all pages.
- Plausible’s built-in visitor, referrer, source, and landing-page reporting.
- `Blog Post Engaged` with `slug` and `reading_time_minutes` when a reader spends enough visible time on a post and reaches at least 50% depth.
- `Blog Post Read` with `slug` and `reading_time_minutes` when a reader spends enough visible time on a post and reaches at least 90% depth.
- `Profile Link Click` with `link` and `location` for important profile/contact actions from the hero and footer.

This intentionally avoids cookies, cross-site identifiers, session replay, heatmaps, ads pixels, or broad outbound tracking. The current event model is defined in `/Users/fole/Desktop/apps/fole/src/lib/analytics.ts`.

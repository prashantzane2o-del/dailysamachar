# DailySamachar

DailySamachar is a headless news frontend built with Next.js, React, Tailwind CSS, and next-intl. The public interface is deployed on Vercel at [dailysamachar.org](https://dailysamachar.org), while WordPress is the content and media backend at [api.dailysamachar.org](https://api.dailysamachar.org).

## Architecture

- WordPress manages articles, categories, media, plugins, and Rank Math SEO.
- The Next.js App Router fetches WordPress REST data through the typed CMS adapter.
- Locale-aware routes support English and Hindi with `next-intl`.
- Server APIs provide article feeds, weather, market data, draft mode, and cache revalidation.
- Vercel serves the frontend; Hostinger hPanel hosts the WordPress backend.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the WordPress and site URLs in `.env.local`. Keep revalidation and draft secrets server-only; never expose them through `NEXT_PUBLIC_*` variables.

## Quality gates

```bash
npm run lint
npm test
npm run format:check
npm run build
```

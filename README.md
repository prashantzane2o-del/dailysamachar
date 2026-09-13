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

### WordPress CMS configuration

The homepage needs a running WordPress REST API. Configure one reachable site origin in `.env.local`:

```dotenv
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.example
WORDPRESS_API_URL=https://your-wordpress-site.example
```

`WORDPRESS_API_URL` is used by server-side content reads. The public value is retained for image and browser configuration. Do not add a second `WORDPRESS_API_URL` line: the later value overrides the earlier one. After changing an environment file, stop and restart `npm run dev` because Next.js does not reload environment variables into an existing process.

Keep TLS verification enabled. Never use `NODE_TLS_REJECT_UNAUTHORIZED=0`; fix the CMS certificate or its hostname instead. To use a local WordPress instance, point both URL variables to it only after that service is listening (for example, `http://127.0.0.1:8000`).

Verify the configured CMS before starting the frontend:

```bash
curl --fail --location "$WORDPRESS_API_URL/wp-json/wp/v2/posts?per_page=1"
```

## Quality gates

```bash
npm run lint
npm test
npm run format:check
npm run build
```

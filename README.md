# NewsApp

A premium React + Vite news website with search, categories, language switching, infinite scroll, and light/dark interface support.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Add your NewsAPI key in `.env`:

```bash
VITE_NEWS_API_KEY=your_newsapi_key_here
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Deployment

Use these settings on Vercel or Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_NEWS_API_KEY`

Note: NewsAPI browser access may require a production-capable plan or a small serverless proxy for deployed public websites.

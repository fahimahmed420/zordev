# zordev.com

Studio website for Zordev. Built from `../Zordev-Website-Plan.md`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # also regenerates PLACEHOLDERS.md
```

## Where things live

- `content/` holds all copy and data: site config, services, pricing, process, FAQ, case studies, testimonials. Edit these files; pages read from them.
- `ph("...")` marks missing information. Placeholders show as yellow striped badges in the browser, and `PLACEHOLDERS.md` lists them all.
- `npm run check:launch` fails while any placeholder remains. Vercel production builds run the same check automatically.
- `app/contact/actions.ts` handles the brief form: honeypot, rate limit, Turnstile, Zod validation, Resend emails, CRM webhook.

## Before launch

1. Copy `.env.example` to `.env.local` (and to the host's env settings) and fill every value.
2. Replace every placeholder (`npm run check:launch` must pass).
3. Add real screenshots to `public/work/` and the owner photo to `public/fahim.jpg`, then point the `src` fields at them.
4. Swap the approximate logo in `components/layout/Logo.tsx` and `app/icon.svg` for the official SVG.
5. After checking the browser console in production, rename the `Content-Security-Policy-Report-Only` header in `next.config.ts` to `Content-Security-Policy`.

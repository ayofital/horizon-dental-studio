This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Booking persistence (Supabase)

Booking requests use the server-only Supabase client via `POST /api/bookings`. Zod validates and strips unknown fields before inserting a pending request. Contact remains a non-persistent demo. No email or appointment confirmation is generated.

1. Create your own Supabase project. In its SQL Editor, run `supabase/bookings.sql` once on a new project. If a bookings table already exists, review it separately; do not drop it. The transaction creates the table, enables RLS, removes public access and grants only inserts to the server role. No public policies or booking read endpoint are provided.
2. Ensure the project's Data API is enabled and exposes the `public` schema. Copy the project URL and privileged backend key from its API settings. A service-role key (or a newer Supabase backend secret key) stays on the server; an anon/publishable key is not sufficient.
3. Copy `.env.example` to `.env.local`. Set `SUPABASE_URL` to your project URL and `SUPABASE_SERVICE_ROLE_KEY` to that backend key. Never prefix the key with `NEXT_PUBLIC_`, put it in source/tests, log it, or commit `.env.local`. The example contains no values; real environment files are ignored.
4. With system Node 22, run `npm install` and `npm run dev`, then open `/book`. Restart after environment changes. For deployment, configure the same server variables and redeploy.
5. Submit example details only. Success returns HTTP 201 and a preference summary. Inspect the pending row in your own Supabase dashboard. Verify missing configuration returns 503, invalid requests return 422, and anon/authenticated roles cannot read or insert directly.

Without configuration, valid requests fail with a safe 503 response; there is no fake-success fallback. Builds do not connect to the database. Run `node --test tests/*.test.mjs`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Persistence tests mock the client and need no project.

The SQL has not been applied automatically. A privileged backend key bypasses RLS and remains powerful across your project: keep it private and rotate it if exposed. Use fictional example details, without medical information. Before public production use, establish abuse controls and a retention/privacy policy. A timeout can leave receipt uncertain; retrying may create another request. Idempotency is outside this phase.

# Deploying Chiniot Pakwan on Vercel

1. Put this folder on GitHub (or run `npx vercel` inside it).
2. In Vercel -> Project -> Settings -> Environment Variables add every name listed in `.env.example`
   (copy the real values from your own .env file). Set NEXT_PUBLIC_SITE_URL to https://www.chiniotpakwan.pk
3. Vercel -> Settings -> Domains: make www.chiniotpakwan.pk the primary domain and redirect chiniotpakwan.pk to it.
4. Deploy. The build runs `prisma generate` automatically.
5. Search Console: submit https://www.chiniotpakwan.pk/sitemap.xml

## Check before you go live
- prisma/schema.prisma was REBUILT from the code, because the original was not in the files provided.
  If your real project has its own prisma/schema.prisma, copy it over this one.
  Otherwise run `npx prisma db pull` (needs DATABASE_URL) to rewrite it from your live database.
  Never run `prisma db push` with the rebuilt file.
- app/globals.css was rebuilt from the compiled stylesheet. If you have your original, keep yours.
- public/og-image.jpg is a plain generated card. Replace it with a 1200x630 photo of your food.
- This code is a snapshot of your build from 15 Oct. Edits you made after that (framer-motion code, Google Ads / GTM tags)
  are NOT in it. Copy those files from your real project over this one.
- Security: create-second-admin.cjs contained a plain-text admin password. Change that password and don't keep it in code.

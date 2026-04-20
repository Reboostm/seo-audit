# ReBoost SEO Audit Lead Magnet

Full-stack SaaS for automated SEO audit reports. Capture leads via embeddable forms, generate personalized reports with local rankings, GMB scores, and lost revenue calculations.

## Quick Start

1. `npm install`
2. Copy `.env.local.example` → `.env.local` and add your API keys
3. `npm run dev` → `http://localhost:3000`

## Features

- **Embeddable Form** - Embed on any GHL landing page
- **Auto Report Generation** - Parallel API calls to gather business data
- **Local Ranking** - Map Pack position via SerpAPI
- **GMB Score** - Profile completeness analysis
- **Lost Revenue** - Dynamic calculation based on ranking + niche
- **Admin Dashboard** - Lead management, API toggles, config
- **GHL Integration** - Auto lead sync + email delivery

## Tech Stack

- Next.js 14, React, Tailwind, TypeScript
- Firebase Firestore + Cloud Functions
- Google Places, SerpAPI, PageSpeed, GoHighLevel APIs
- Vercel deployment

## Required APIs

Get free tier keys for:
- Google Places API
- SerpAPI  
- PageSpeed Insights (free)
- GoHighLevel API

## Deployment

Push to GitHub → Vercel auto-deploys.

Set environment variables in Vercel dashboard.

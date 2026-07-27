# GTA6NEWS - AI-Powered News Portal

A fully automated, AI-driven news portal about Grand Theft Auto VI, built with Next.js 15, Supabase, and the Anthropic Claude API.

## 🎯 Features

- **AI-Powered Article Generation**: Automatically generates unique, SEO-optimized articles using Claude Sonnet 4
- **Content Aggregation**: Searches for GTA 6 news from multiple sources using Tavily API
- **Automated Pipeline**: Generates 5-6 articles daily through Vercel Cron Jobs
- **Dark/Neon Aesthetic**: Vice City-inspired design with custom animations
- **Admin Dashboard**: Manage articles, view pipeline logs, and manually trigger generation
- **SEO Optimized**: Dynamic metadata, sitemaps, JSON-LD structured data
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- Anthropic API key
- Tavily API key
- Vercel account (for deployment)

### Installation

```bash
npm install
```

### Database Setup

1. Go to [Supabase](https://supabase.com) and create a project
2. Run the SQL from `SUPABASE_SETUP.sql` in Supabase SQL Editor
3. Copy your project URL and API keys

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=your-tavily-key
UNSPLASH_ACCESS_KEY=your-unsplash-key
CRON_SECRET=random-secret
NEXT_PUBLIC_ADMIN_PASSWORD=your-password
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

## 📁 Project Structure

- `app/` - Next.js pages and API routes
- `components/` - React components
- `lib/` - Utility functions and clients
- `types/` - TypeScript definitions
- `vercel.json` - Cron job configuration

## 🤖 AI Pipeline

The automated pipeline (runs 5x daily):
1. Searches for GTA 6 news
2. Deduplicates results
3. Generates unique articles with Claude
4. Validates content quality
5. Publishes to Supabase

## 🎨 Design

Vice City-inspired dark theme with neon accents:
- Neon Pink: #ff2d78
- Neon Cyan: #00d4ff
- Dark Navy: #0a0a0f

## 🔐 Admin Panel

Access `/admin` with configured password to:
- View pipeline logs
- Manage articles
- Manually trigger generation

## 🚀 Deployment

Deploy to Vercel and add your environment variables. Enable Cron Jobs in Vercel settings (Pro plan required).

## 📚 Documentation

See `SUPABASE_SETUP.sql` for database schema and full README in project for detailed documentation.

---

**GTA 6 Release**: November 19, 2026 | PS5 & Xbox Series X|S
